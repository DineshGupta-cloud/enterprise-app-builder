import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createProjectSpec, validateProjectSpec } from './projectSpec.js';

const pkgPath = p => p.split('.').join('/');

export async function generateAuthArtifacts(input, outputDir) {
  const spec = createProjectSpec(input);
  const check = validateProjectSpec(spec);
  if (!check.valid) throw new Error(`Invalid ProjectSpec: ${check.errors.join('; ')}`);
  const root = path.resolve(outputDir);
  const pkg = spec.project.packageName;
  const dir = path.join(root, 'backend/src/main/java', pkgPath(pkg), 'security');
  await mkdir(dir, { recursive: true });

  const jwt = `package ${pkg}.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {
  private final byte[] key; private final long expirationMs;
  public JwtService(@Value("\\${app.jwt.secret}") String secret, @Value("\\${app.jwt.expiration-ms:3600000}") long expirationMs) {
    this.key = secret.getBytes(StandardCharsets.UTF_8); this.expirationMs = expirationMs;
  }
  public String generate(String username, List<String> roles, List<String> permissions) {
    Date now = new Date();
    return Jwts.builder().subject(username).claim("roles", roles).claim("permissions", permissions).issuedAt(now).expiration(new Date(now.getTime()+expirationMs)).signWith(Keys.hmacShaKeyFor(key)).compact();
  }
  public Claims parse(String token) { return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(key)).build().parseSignedClaims(token).getPayload(); }
}`;

  const filter = `package ${pkg}.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  public JwtAuthenticationFilter(JwtService jwtService) { this.jwtService = jwtService; }
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
    String h=request.getHeader("Authorization");
    if(h!=null && h.startsWith("Bearer ")) try {
      var c=jwtService.parse(h.substring(7)); List<String> roles=c.get("roles",List.class);
      var a=roles==null?List.<SimpleGrantedAuthority>of():roles.stream().map(r->new SimpleGrantedAuthority("ROLE_"+r)).toList();
      SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(c.getSubject(),null,a));
    } catch(Exception ignored) { SecurityContextHolder.clearContext(); }
    chain.doFilter(request,response);
  }
}`;

  const controller = `package ${pkg}.security;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
  private final JwtService jwtService;
  public AuthController(JwtService jwtService) { this.jwtService=jwtService; }
  @PostMapping("/token") public TokenResponse token(@RequestBody LoginRequest r) {
    if(!"admin".equals(r.username()) || !"admin".equals(r.password())) throw new IllegalArgumentException("Invalid credentials");
    return new TokenResponse(jwtService.generate(r.username(),List.of("ADMIN"),List.of("*")));
  }
  public record LoginRequest(String username,String password) {}
  public record TokenResponse(String accessToken) {}
}`;

  const permission = `package ${pkg}.security;
import org.springframework.stereotype.Service;
@Service public class PermissionService { public boolean can(String granted,String required){ return "*".equals(granted)||granted.equalsIgnoreCase(required); } }`;
  const roles = (spec.roles||[]).map(r=>({name:r.name,scope:r.scope||'ALL',permissions:r.permissions||[]}));

  await writeFile(path.join(dir,'JwtService.java'),jwt);
  await writeFile(path.join(dir,'JwtAuthenticationFilter.java'),filter);
  await writeFile(path.join(dir,'AuthController.java'),controller);
  await writeFile(path.join(dir,'PermissionService.java'),permission);
  await mkdir(path.join(root,'config'),{recursive:true});
  await writeFile(path.join(root,'config','security.json'),JSON.stringify({authentication:'jwt-rbac',roles,dataScopes:['ALL','COMPANY','BRANCH','DEPARTMENT','SELF']},null,2));
  return {generated:true,jwt:true,roles:roles.length,permissions:true};
}

import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppBar, Box, Button, Chip, Container, CssBaseline, Divider, Drawer,
  IconButton, List, ListItemButton, ListItemText, MenuItem, Paper, Select,
  Stack, Step, StepLabel, Stepper, TextField, ThemeProvider, Toolbar,
  Typography, createTheme
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

const steps = ['Project', 'Architecture', 'Modules', 'Review'];
const defaultModules = [
  { name: 'Employee', entity: 'Employee', fields: 'employeeNumber, firstName, lastName, email, department, active' },
  { name: 'Customer', entity: 'Customer', fields: 'customerNumber, name, email, mobile, status' },
  { name: 'Lead', entity: 'Lead', fields: 'leadNumber, name, email, source, status, priority' }
];

const theme = createTheme({
  palette: { mode: 'dark', background: { default: '#080d18', paper: '#101827' }, primary: { main: '#6ee7b7' } },
  typography: { fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' },
  shape: { borderRadius: 12 }
});

function downloadSpec(spec) {
  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${spec.project.name || 'enterprise-app'}-spec.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [step, setStep] = useState(0);
  const [project, setProject] = useState({ name: 'Enterprise CRM', packageName: 'com.example.crm', database: 'mysql', java: '17' });
  const [architecture, setArchitecture] = useState({ backend: 'spring-boot', frontend: 'react-mui', security: 'jwt-rbac', migration: 'flyway' });
  const [modules, setModules] = useState(defaultModules);

  const spec = useMemo(() => ({ version: '0.1.0', project, architecture, modules }), [project, architecture, modules]);

  const updateProject = (key, value) => setProject((current) => ({ ...current, [key]: value }));
  const updateArchitecture = (key, value) => setArchitecture((current) => ({ ...current, [key]: value }));
  const addModule = () => setModules((current) => [...current, { name: 'New Module', entity: 'NewEntity', fields: 'name, description, active' }]);
  const removeModule = (index) => setModules((current) => current.filter((_, i) => i !== index));
  const updateModule = (index, key, value) => setModules((current) => current.map((item, i) => i === index ? { ...item, [key]: value } : item));

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ borderBottom: '1px solid #202a3b', backdropFilter: 'blur(12px)' }}>
        <Toolbar sx={{ maxWidth: 1400, width: '100%', mx: 'auto' }}>
          <AutoAwesomeRoundedIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={800}>Enterprise App Builder</Typography>
          <Chip size="small" label="v0.1 Foundation" sx={{ ml: 2 }} />
          <Box sx={{ flex: 1 }} />
          <Button startIcon={<DownloadRoundedIcon />} onClick={() => downloadSpec(spec)}>Export Spec</Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', top: 64, background: '#0b1220', borderRight: '1px solid #202a3b' } }}>
        <List sx={{ p: 2 }}>
          {['Project Designer', 'Architecture', 'Modules', 'Generated Output', 'Settings'].map((label, index) => (
            <ListItemButton key={label} selected={step === Math.min(index, 3)} onClick={() => setStep(Math.min(index, 3))} sx={{ mb: 0.5, borderRadius: 2 }}>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ ml: '240px' }}>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography variant="overline" color="primary.main">Enterprise scaffolding platform</Typography>
            <Typography variant="h3" fontWeight={850}>Design once. Generate consistently.</Typography>
            <Typography color="text.secondary" maxWidth={760}>Define your application's architecture and business modules. This specification becomes the contract for the future Spring Boot, React, database, test and deployment generators.</Typography>
          </Stack>

          <Stepper activeStep={step} sx={{ mb: 5 }}>
            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>

          {step === 0 && <ProjectStep project={project} updateProject={updateProject} />}
          {step === 1 && <ArchitectureStep architecture={architecture} updateArchitecture={updateArchitecture} />}
          {step === 2 && <ModulesStep modules={modules} addModule={addModule} removeModule={removeModule} updateModule={updateModule} />}
          {step === 3 && <ReviewStep spec={spec} />}

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
            <Button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
            {step < steps.length - 1 ? <Button variant="contained" onClick={() => setStep((s) => s + 1)}>Continue</Button> : <Button variant="contained" startIcon={<DownloadRoundedIcon />} onClick={() => downloadSpec(spec)}>Export Project Specification</Button>}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

function ProjectStep({ project, updateProject }) {
  return <Paper sx={{ p: 4 }}>
    <Typography variant="h5" fontWeight={750} gutterBottom>Project foundation</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>These values drive package names, generated configuration and deployment metadata.</Typography>
    <Stack spacing={2}>
      <TextField label="Project name" value={project.name} onChange={(e) => updateProject('name', e.target.value)} fullWidth />
      <TextField label="Java package" value={project.packageName} onChange={(e) => updateProject('packageName', e.target.value)} fullWidth />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField select label="Java" value={project.java} onChange={(e) => updateProject('java', e.target.value)} fullWidth><MenuItem value="17">Java 17</MenuItem><MenuItem value="21">Java 21</MenuItem></TextField>
        <TextField select label="Database" value={project.database} onChange={(e) => updateProject('database', e.target.value)} fullWidth><MenuItem value="mysql">MySQL</MenuItem><MenuItem value="postgresql">PostgreSQL</MenuItem></TextField>
      </Stack>
    </Stack>
  </Paper>;
}

function ArchitectureStep({ architecture, updateArchitecture }) {
  const fields = [['backend', 'Backend', ['spring-boot', 'spring-cloud']], ['frontend', 'Frontend', ['react-mui', 'react-tailwind']], ['security', 'Security', ['jwt-rbac', 'oauth2']], ['migration', 'Database migrations', ['flyway', 'liquibase']]];
  return <Paper sx={{ p: 4 }}><Typography variant="h5" fontWeight={750} gutterBottom>Architecture standards</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Select the defaults every generated project should inherit.</Typography><Stack spacing={2}>{fields.map(([key, label, values]) => <TextField key={key} select label={label} value={architecture[key]} onChange={(e) => updateArchitecture(key, e.target.value)}>{values.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField>)}</Stack></Paper>;
}

function ModulesStep({ modules, addModule, removeModule, updateModule }) {
  return <Stack spacing={2}>
    <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="h5" fontWeight={750}>Business modules</Typography><Typography color="text.secondary">Each module will eventually generate entity, DTO, mapper, repository, service, controller, UI and tests.</Typography></Box><Button startIcon={<AddRoundedIcon />} variant="contained" onClick={addModule}>Add Module</Button></Stack>
    {modules.map((module, index) => <Paper key={`${module.name}-${index}`} sx={{ p: 3 }}><Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center"><TextField label="Module" value={module.name} onChange={(e) => updateModule(index, 'name', e.target.value)} sx={{ flex: 1 }} /><TextField label="Entity" value={module.entity} onChange={(e) => updateModule(index, 'entity', e.target.value)} sx={{ flex: 1 }} /><TextField label="Fields (comma separated)" value={module.fields} onChange={(e) => updateModule(index, 'fields', e.target.value)} sx={{ flex: 3 }} /><IconButton color="error" onClick={() => removeModule(index)}><DeleteOutlineRoundedIcon /></IconButton></Stack></Paper>)}
  </Stack>;
}

function ReviewStep({ spec }) {
  return <Paper sx={{ p: 4 }}><Typography variant="h5" fontWeight={750} gutterBottom>Generation contract</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>This is the normalized project specification that future generator engines will consume.</Typography><Box component="pre" sx={{ m: 0, p: 3, overflow: 'auto', borderRadius: 2, bgcolor: '#070b13', fontSize: 13 }}>{JSON.stringify(spec, null, 2)}</Box><Divider sx={{ my: 3 }} /><Typography color="text.secondary">Next generator phase: convert this contract into a complete Spring Boot + React + MySQL source tree, including migrations, security, tests, Docker and CI/CD.</Typography></Paper>;
}

createRoot(document.getElementById('root')).render(<ThemeProvider theme={theme}><CssBaseline /><App /></ThemeProvider>);

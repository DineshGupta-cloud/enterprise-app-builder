export async function generateApplication(projectSpec) {
  if (!projectSpec || typeof projectSpec !== 'object') throw new Error('A valid ProjectSpec is required.');
  const response = await fetch('/api/generator/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(projectSpec) });
  if (!response.ok) throw new Error((await response.text()) || `Generation failed (${response.status})`);
  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^";]+)"?/i);
  const filename = match?.[1] || `${projectSpec.project?.name || 'generated-application'}.zip`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  URL.revokeObjectURL(url);
}

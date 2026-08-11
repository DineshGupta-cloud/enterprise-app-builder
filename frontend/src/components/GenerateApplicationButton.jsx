import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { generateApplication } from '../services/generatorService';

export default function GenerateApplicationButton({ projectSpec, onGenerated, onError }) {
  const [busy, setBusy] = useState(false);
  const handleGenerate = async () => {
    setBusy(true);
    try { await generateApplication(projectSpec); onGenerated?.(); }
    catch (error) { onError?.(error); }
    finally { setBusy(false); }
  };
  return <Button variant="contained" onClick={handleGenerate} disabled={busy} startIcon={busy ? <CircularProgress size={18} /> : null}>{busy ? 'Generating...' : 'Generate Application'}</Button>;
}

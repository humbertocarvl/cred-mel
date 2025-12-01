import React, { useState } from 'react';
import api from '../services/api';
import * as XLSX from 'xlsx';
import Card from '../components/Card';

const ImportarParticipantes: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<{ created: number; skipped: number; errors: Array<{ row: number; message: string }> } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] || null);
    setSuccess('');
    setError('');
  }

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    setSuccess('');
    setError('');
    setReport(null);
    setProgress(0);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);
      if (rows.length === 0) {
        setError('Planilha vazia');
        setLoading(false);
        return;
      }

      setProgress(10);
      // Send all rows to the bulk endpoint — server will validate, dedupe and insert
      const resp = await api.post('/participants/bulk', rows);
      const respData = resp.data;
      setReport({ created: respData.created ?? 0, skipped: respData.skipped ?? 0, errors: respData.errors ?? [] });
      setProgress(100);
      setSuccess('Importação concluída!');
    } catch {
      setError('Erro ao importar participantes.');
    }
    setLoading(false);
  }

  function handleDownloadTemplate() {
    const headers = [
      ['name', 'city', 'state', 'email', 'whatsapp', 'contribuicao', 'alojamento', 'tipoInscricao'],
      ['Maria Silva', 'São Paulo', 'SP', 'maria@example.com', '5511999999999', '50', 'false', 'participante'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'participants-template.xlsx');
  }

  return (
    <div className="dashboard-mel" style={{ background: 'var(--mel-gray)', minHeight: '100vh', padding: '1em 0' }}>
      <div className="container">
        <h2 className="page-title">Importar Participantes</h2>
        <Card>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} />
            <button className="button" onClick={handleDownloadTemplate}>
              Baixar template (.xlsx)
            </button>
          </div>
          <button className="button" onClick={handleImport} disabled={!file || loading}>
            {loading ? 'Importando...' : 'Importar'}
          </button>
          {success && <div style={{ color: 'green', marginTop: '0.5rem' }}>{success}</div>}
          {error && <div style={{ color: 'crimson', marginTop: '0.5rem' }}>{error}</div>}
          {loading && <div style={{ marginTop: '0.5rem' }}>Progresso: {progress}%</div>}
          {report && (
            <div style={{ marginTop: '0.75rem' }}>
              <div><strong>Criados:</strong> {report.created}</div>
              <div><strong>Ignorados (duplicados):</strong> {report.skipped}</div>
              <div><strong>Erros:</strong> {report.errors.length}</div>
              {report.errors.length > 0 && (
                <div style={{ marginTop: '0.5rem', maxHeight: '200px', overflow: 'auto', border: '1px solid #eee', padding: '0.5rem' }}>
                  {report.errors.map(e => (
                    <div key={e.row} style={{ color: 'crimson' }}>Linha {e.row}: {e.message}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ImportarParticipantes;

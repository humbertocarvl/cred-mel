import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../services/api';
import ParticipantsForm from './ParticipantsForm';
import Card from '../components/Card';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 50;

interface Participant {
  id: number;
  name: string;
  city: string;
  state: string;
  email: string;
  whatsapp: string;
  contribuicao: boolean;
  alojamento: boolean;
  tipoInscricao: string;
  credenciada: boolean;
  credenciada_em?: string;
  credencial?: string;
}

const Credenciadas: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filtered, setFiltered] = useState<Participant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get('/participants?credenciada=true').then(res => {
      setParticipants(res.data);
      setFiltered(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFiltered(
      participants.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.state.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.whatsapp.toLowerCase().includes(search.toLowerCase()) ||
        p.tipoInscricao.toLowerCase().includes(search.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset para primeira página ao filtrar
  }, [search, participants]);

  function exportXLSX() {
    const data = filtered.map((p: Participant) => ({
      'Nome': p.name,
      'Cidade': p.city,
      'Estado': p.state,
      'E-mail': p.email,
      'Telefone': p.whatsapp,
      'Contribuição': p.contribuicao ? 'Sim' : 'Não',
      'Alojamento': p.alojamento ? 'Sim' : 'Não',
      'Tipo de inscrição': p.tipoInscricao,
      'Credenciada em': p.credenciada_em ? new Date(p.credenciada_em).toLocaleString() : '-',
      'Credencial': p.credencial || '-'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Credenciadas');
    XLSX.writeFile(wb, 'credenciadas.xlsx');
  }

  function handleEdit(id: number) {
    const participant = participants.find(p => p.id === id);
    setEditId(id);
    setEditData(participant);
  }

  function handleEditSubmit(data: any) {
    api.put(`/participants/${editId}`, data).then(res => {
      setParticipants(prev => prev.map(p => p.id === editId ? res.data : p));
      setEditId(null);
      setEditData(null);
    });
  }

  function handleEditCancel() {
    setEditId(null);
    setEditData(null);
  }

  function handleDelete(id: number) {
    setDeleteId(id);
  }

  function confirmDelete() {
    api.delete(`/participants/${deleteId}`).then(() => {
      setParticipants(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
    });
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  // Paginação
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="dashboard-mel" style={{ background: 'var(--mel-gray)', minHeight: '100vh', padding: '1em 0' }}>
      <div className="container">
        <h1 className="page-title">Credenciadas</h1>
        <Card>
          <div style={{ display: 'flex', gap: '1em', alignItems: 'center', marginBottom: '0', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nome, cidade, estado ou e-mail"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '220px' }}
        />
        <button onClick={exportXLSX} className="button">Exportar XLSX</button>
          </div>
        </Card>

        {loading ? (
          <div style={{ color: 'var(--mel-gold)', fontWeight: 'bold' }}>Carregando...</div>
        ) : (
          <Card>
            <div>
              <div className="cards-grid">
                {paginatedData.map(p => (
                  <div className="participant-card" key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{p.name}</strong>
                      <span className="small">{p.credencial || ''}</span>
                    </div>
                    <div className="meta">{p.city} — {p.state}</div>
                    <div className="small">{p.email}</div>
                    <div className="small">{p.whatsapp}</div>
                    <div className="small">Refeição: {p.tipoInscricao || '-'}</div>
                    <div className="small">Contribuição: {p.contribuicao ? 'Sim' : 'Não'} • Alojamento: {p.alojamento ? 'Sim' : 'Não'}</div>
                    <div className="small">Credenciada em: {p.credenciada_em ? new Date(p.credenciada_em).toLocaleDateString() : '-'}</div>
                    <div className="actions">
                      <button onClick={() => handleEdit(p.id)} className="button" style={{ marginRight: '0.5em', background: 'var(--mel-gold)' }}>Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="button" style={{ background: 'var(--mel-yellow)' }}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </Card>
        )}

        {editId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <Card>
              <ParticipantsForm
                initialData={editData}
                onSubmit={handleEditSubmit}
                onCancel={handleEditCancel}
              />
            </Card>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <Card>
              <p style={{ color: 'var(--mel-black)', fontWeight: 'bold', marginBottom: '1em' }}>Confirma a exclusão?</p>
              <button onClick={confirmDelete} className="button" style={{ background: 'var(--mel-yellow)', marginRight: '1em' }}>Sim</button>
              <button onClick={cancelDelete} className="button" style={{ background: 'var(--mel-gray)' }}>Não</button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Credenciadas;

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../services/api';
import ParticipantsForm from './ParticipantsForm';
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 50;

const Participants: React.FC = () => {
    const [participants, setParticipants] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<any | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      setLoading(true);
      api.get('/participants').then(res => {
        setParticipants(res.data);
        setFiltered(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
      setFiltered(participants.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase()) ||
        p.state?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase())
      ));
      setCurrentPage(1); // Reset para primeira página ao filtrar
    }, [search, participants]);

    function exportXLSX() {
      const data = filtered.map(p => ({
        'Nome': p.name,
        'Cidade': p.city,
        'Estado': p.state,
        'E-mail': p.email,
        'Whatsapp': p.whatsapp,
        'Contribuição': p.contribuicao ? 'Sim' : 'Não',
        'Alojamento': p.alojamento ? 'Sim' : 'Não',
        'Tipo Inscrição': p.tipoInscricao,
        'Credenciada': p.credenciada ? 'Sim' : 'Não'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inscritas');
      XLSX.writeFile(wb, 'inscritas.xlsx');
    }

    function handleAdd(data: any) {
      const created = { ...data, id: participants.length ? Math.max(...participants.map(p => p.id)) + 1 : 1 };
      setParticipants(prev => [created, ...prev]);
      setShowForm(false);
    }

    function handleEdit(id: number) {
      const participant = participants.find(p => p.id === id);
      setEditId(id);
      setEditData(participant);
    }

    function handleEditSubmit(data: any) {
      if (editId === null) return;
      api.put(`/participants/${editId}`, data).then(res => {
        setParticipants(prev => prev.map(p => p.id === editId ? res.data : p));
        setEditId(null);
        setEditData(null);
      }).catch(() => {
        setParticipants(prev => prev.map(p => p.id === editId ? { ...p, ...data } : p));
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
      if (deleteId === null) return;
      api.delete(`/participants/${deleteId}`).then(() => {
        setParticipants(prev => prev.filter(p => p.id !== deleteId));
        setDeleteId(null);
      }).catch(() => {
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
          <h1 className="page-title">Inscritas</h1>

          <Card>
            <input
              type="text"
              placeholder="Buscar por nome, cidade, estado ou e-mail"
              className="mb-4 w-full"
              style={{
                border: '1px solid var(--mel-gold)',
                borderRadius: 'var(--mel-border-radius)',
                padding: '0.75em 1em',
                fontFamily: 'var(--mel-font-body)',
                fontSize: '1.1em',
                marginBottom: '1em',
                background: 'var(--mel-white)',
                color: 'var(--mel-black)'
              }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '1em', marginBottom: '1em', flexWrap: 'wrap' }}>
              <button className="button" onClick={() => setShowForm(true)}>
                Nova inscrição
              </button>
              <button className="button" style={{ background: 'var(--mel-gold)' }} onClick={exportXLSX}>
                Exportar XLSX
              </button>
              <Link to="/importar" className="button" style={{ textDecoration: 'none', display: 'inline-block', background: 'var(--mel-yellow)' }}>
                Importar Participantes
              </Link>
            </div>
            {showForm && <ParticipantsForm onSubmit={handleAdd} />}
          </Card>

          <Card>
            {loading ? (
              <div style={{ color: 'var(--mel-gold)', fontWeight: 'bold' }}>Carregando...</div>
            ) : filtered.length === 0 ? (
              <div style={{ color: 'var(--mel-black)', fontWeight: 'bold' }}>Nenhuma inscrita cadastrada</div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table className="table-mel">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Cidade</th>
                      <th>Estado</th>
                      <th>E-mail</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map(p => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.city}</td>
                        <td>{p.state}</td>
                        <td>{p.email}</td>
                        <td>
                          <button className="button" style={{ marginRight: '0.5em', background: 'var(--mel-gold)' }} onClick={() => handleEdit(p.id)}>
                            Editar
                          </button>
                          <button className="button" style={{ background: 'var(--mel-yellow)' }} onClick={() => handleDelete(p.id)}>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </Card>

          {editId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" style={{ padding: '1rem' }}>
              <div className="card" style={{ background: 'var(--mel-white)', maxWidth: '500px', width: '100%', margin: 'auto', borderRadius: 'var(--mel-border-radius)', boxShadow: '0 2px 8px rgba(34,34,34,0.12)', padding: '1.5em' }}>
                <h2 style={{ color: 'var(--mel-gold)', fontFamily: 'var(--mel-font-title)', fontWeight: 'bold', marginBottom: '1em' }}>Editar Participante</h2>
                <ParticipantsForm
                  onSubmit={handleEditSubmit}
                  initialData={editData}
                />
                <button className="button" style={{ background: 'var(--mel-gray)', marginTop: '1.5em' }} onClick={handleEditCancel}>Cancelar</button>
              </div>
            </div>
          )}

          {deleteId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" style={{ padding: '1rem' }}>
              <div className="card" style={{ background: 'var(--mel-white)', maxWidth: '400px', width: '100%', margin: 'auto', borderRadius: 'var(--mel-border-radius)', boxShadow: '0 2px 8px rgba(34,34,34,0.12)', padding: '1.5em' }}>
                <h2 style={{ color: 'var(--mel-gold)', fontFamily: 'var(--mel-font-title)', fontWeight: 'bold', marginBottom: '1em' }}>Confirmar exclusão</h2>
                <p style={{ marginBottom: '1.5em', color: 'var(--mel-black)' }}>Tem certeza que deseja excluir esta participante?</p>
                <button className="button" style={{ background: 'var(--mel-yellow)', marginRight: '1em' }} onClick={confirmDelete}>Excluir</button>
                <button className="button" style={{ background: 'var(--mel-gray)' }} onClick={cancelDelete}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default Participants;

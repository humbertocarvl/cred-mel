import React, { useState } from 'react';
import api from '../services/api';
import MobileCard from '../components/MobileCard';
import MobileButton from '../components/MobileButton';

const initialState = {
  name: '',
  city: '',
  state: '',
  email: '',
  whatsapp: '',
  contribuicao: false,
  alojamento: false,
  tipoInscricao: 'participante',
};

const Inscricao: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: fieldValue,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/participants', form);
      setSuccess('Inscrição realizada com sucesso!');
      setForm(initialState);
    } catch {
      setError('Erro ao cadastrar participante.');
    }
  }

  return (
    <div className="container-mobile">
      <MobileCard>
        <h1 className="text-2xl font-bold mb-4">Nova Inscrição</h1>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 10 }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nome completo" className="border p-2 rounded" required />
            <input name="city" value={form.city} onChange={handleChange} placeholder="Cidade" className="border p-2 rounded" required />
            <input name="state" value={form.state} onChange={handleChange} placeholder="Estado" className="border p-2 rounded" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="E-mail" className="border p-2 rounded" required />
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="Telefone" className="border p-2 rounded" required />
            <label className="flex items-center"><input type="checkbox" name="contribuicao" checked={form.contribuicao} onChange={handleChange} className="mr-2" />Contribuição</label>
            <label className="flex items-center"><input type="checkbox" name="alojamento" checked={form.alojamento} onChange={handleChange} className="mr-2" />Alojamento</label>
            <select name="tipoInscricao" value={form.tipoInscricao} onChange={handleChange} className="border p-2 rounded" required>
              <option value="comunicacao">Comunicação</option>
              <option value="organizacao">Organização</option>
              <option value="parlamentar">Parlamentar</option>
              <option value="participante">Participante</option>
            </select>
          </div>
          <MobileButton type="submit" full className="mt-4">Salvar</MobileButton>
        </form>
      </MobileCard>
    </div>
  );
};

export default Inscricao;

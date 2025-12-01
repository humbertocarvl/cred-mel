import React, { useState } from 'react';

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


interface Props {
  onSubmit: (data: any) => void;
  initialData?: any;
  onCancel?: () => void;
}

const ParticipantsForm: React.FC<Props> = ({ onSubmit, initialData, onCancel }) => {
  const [form, setForm] = useState(initialData || initialState);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev: typeof form) => ({
      ...prev,
      [name]: fieldValue,
    }));
  }


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="card" style={{ maxWidth: '600px', margin: 'auto' }} onSubmit={handleSubmit}>
      <h2 style={{ fontFamily: 'var(--mel-font-title)', color: 'var(--mel-gold)', fontWeight: 'bold', fontSize: '1.5em', marginBottom: '1em' }}>{initialData ? 'Editar' : 'Nova'} Inscrição</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1em' }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nome completo" required />
        <input name="city" value={form.city} onChange={handleChange} placeholder="Cidade" required />
        <input name="state" value={form.state} onChange={handleChange} placeholder="Estado" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="E-mail" required />
        <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="Telefone" required />
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" name="contribuicao" checked={form.contribuicao} onChange={handleChange} style={{ marginRight: '0.5em' }} />
          Contribuição
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" name="alojamento" checked={form.alojamento} onChange={handleChange} style={{ marginRight: '0.5em' }} />
          Alojamento
        </label>
        <select name="tipoInscricao" value={form.tipoInscricao} onChange={handleChange} required>
          <option value="comunicacao">Comunicação</option>
          <option value="organizacao">Organização</option>
          <option value="parlamentar">Parlamentar</option>
          <option value="participante">Participante</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em', justifyContent: 'flex-end' }}>
        <button type="submit" className="button">Salvar</button>
        {onCancel && (
          <button type="button" className="button" style={{ background: 'var(--mel-gray)' }} onClick={onCancel}>Cancelar</button>
        )}
      </div>
    </form>
  );
};

export default ParticipantsForm;

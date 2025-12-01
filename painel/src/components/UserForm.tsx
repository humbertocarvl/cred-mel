import React, { useState } from 'react';

const initialState = {
  name: '',
  email: '',
  password: '',
  role: 'scanner',
  active: true,
};

const UserForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [form, setForm] = useState(initialState);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Novo Usuário</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="border p-2 rounded mb-2 w-full" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="E-mail" className="border p-2 rounded mb-2 w-full" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Senha" className="border p-2 rounded mb-2 w-full" required />
      <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded mb-2 w-full">
        <option value="scanner">Scanner</option>
        <option value="admin">Admin</option>
      </select>
      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
        <span>Ativo</span>
      </div>
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded font-semibold">Salvar</button>
    </form>
  );
};

export default UserForm;

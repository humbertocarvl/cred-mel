import React, { useState } from 'react';
import Card from '../components/Card';

const Accredited: React.FC = () => {
  const [accredited, setAccredited] = useState<any[]>([]);

  function handleUndo(id: number) {
    setAccredited(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="dashboard-mel" style={{ background: 'var(--mel-gray)', minHeight: '100vh', padding: '1em 0' }}>
      <div className="container">
        <h1 className="page-title">Credenciadas</h1>
        <Card>
          {accredited.length === 0 ? (
            <div style={{ color: 'var(--mel-black)' }}>Nenhuma credenciada</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
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
                  {accredited.map(a => (
                    <tr key={a.id}>
                      <td>{a.name}</td>
                      <td>{a.city}</td>
                      <td>{a.state}</td>
                      <td>{a.email}</td>
                      <td>
                        <button className="button" style={{ background: 'var(--mel-yellow)' }} onClick={() => handleUndo(a.id)}>Desfazer credenciamento</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Accredited;

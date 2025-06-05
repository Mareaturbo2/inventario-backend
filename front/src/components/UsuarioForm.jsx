import React, { useState } from 'react';
import axios from 'axios';

export default function UsuarioForm({ onSuccess }) {
  const [id, setId] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    if (!id || !senha) {
      setErro('Preencha todos os campos');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/admin/usuarios', { id, senha });
      if (res.data.success) {
        setSucesso('Usuário criado com sucesso');
        setId('');
        setSenha('');
        if (onSuccess) onSuccess();
      } else {
        setErro(res.data.message || 'Erro ao criar usuário');
      }
    } catch {
      setErro('Erro ao conectar no servidor');
    }
  };

  return (
    <div>
      <h3>Cadastrar Usuário</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="ID" value={id} onChange={e => setId(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
      {erro && <p style={{color:'red'}}>{erro}</p>}
      {sucesso && <p style={{color:'green'}}>{sucesso}</p>}
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';

export default function LoginUser({ setUser }) {
  const [id, setId] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', { id, senha });
      if (res.data.success) {
        setUser({ id });
      } else {
        setErro('ID ou senha inválidos');
      }
    } catch (error) {
      setErro('Erro ao conectar no servidor');
    }
  };

  return (
    <div>
      <h2>Login Usuário</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
  );
}

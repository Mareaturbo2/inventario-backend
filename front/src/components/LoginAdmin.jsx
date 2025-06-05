import React, { useState } from 'react';

export default function LoginAdmin({ setAdmin }) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (senha === 'pidorri17') {
      setAdmin(true);
    } else {
      setErro('Senha incorreta');
    }
  };

  return (
    <div>
      <h2>Login Administrador</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Senha master"
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

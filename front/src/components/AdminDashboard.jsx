import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UsuarioForm from './UsuarioForm';

export default function AdminDashboard() {
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const fetchProdutos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/produtos');
      setProdutos(res.data);
    } catch {
      setErro('Erro ao buscar produtos');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3001/admin/usuarios');
      setUsuarios(res.data);
    } catch {
      setErro('Erro ao buscar usuários');
    }
  };

  const fetchHistorico = async () => {
    try {
      const res = await axios.get('http://localhost:3001/admin/historico');
      setHistorico(res.data);
    } catch {
      setErro('Erro ao buscar histórico');
    }
  };

  useEffect(() => {
    fetchProdutos();
    fetchUsuarios();
    fetchHistorico();
  }, []);

  const adicionarProduto = async () => {
    const nome = prompt('Nome do produto:');
    const quantidadeStr = prompt('Quantidade inicial:');
    const quantidade = parseInt(quantidadeStr, 10);
    if (!nome || isNaN(quantidade)) {
      alert('Dados inválidos');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/admin/produtos', { nome, quantidade });
      if (res.data.success) {
        setSucesso('Produto adicionado');
        fetchProdutos();
      } else {
        setErro(res.data.message || 'Erro ao adicionar produto');
      }
    } catch {
      setErro('Erro ao conectar no servidor');
    }
  };

  return (
    <div>
      <h2>Painel Administrativo</h2>

      <button onClick={adicionarProduto}>Adicionar Produto</button>

      <h3>Produtos</h3>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>{p.nome} - Quantidade: {p.quantidade}</li>
        ))}
      </ul>

      <UsuarioForm onSuccess={fetchUsuarios} />

      <h3>Usuários</h3>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.id}</li>
        ))}
      </ul>

      <h3>Histórico de Retiradas</h3>
      <ul>
        {historico.map((h, i) => (
          <li key={i}>
            Usuário: {h.id_usuario} retirou Produto: {h.id_produto} em {new Date(h.data).toLocaleString()}
          </li>
        ))}
      </ul>

      {erro && <p style={{color:'red'}}>{erro}</p>}
      {sucesso && <p style={{color:'green'}}>{sucesso}</p>}
    </div>
  );
}

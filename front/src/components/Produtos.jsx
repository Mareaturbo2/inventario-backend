import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Produtos({ user }) {
  const [produtos, setProdutos] = useState([]);
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

  useEffect(() => {
    fetchProdutos();
  }, []);

  const retirarProduto = async (produtoId) => {
    setErro('');
    setSucesso('');
    try {
      const res = await axios.post('http://localhost:3001/retirar', {
        idProduto: produtoId,
        idUsuario: user.id,
      });
      if (res.data.success) {
        setSucesso('Produto retirado com sucesso');
        fetchProdutos();
      } else {
        setErro(res.data.message || 'Erro na retirada');
      }
    } catch {
      setErro('Erro ao conectar no servidor');
    }
  };

  return (
    <div>
      <h2>Produtos</h2>
      {erro && <p style={{color:'red'}}>{erro}</p>}
      {sucesso && <p style={{color:'green'}}>{sucesso}</p>}
      <ul>
        {produtos.map(p => (
          <li key={p.id}>
            {p.nome} - Quantidade: {p.quantidade} {' '}
            {p.quantidade > 0 ? (
              <button onClick={() => retirarProduto(p.id)}>Retirar 1</button>
            ) : (
              <span>Sem estoque</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

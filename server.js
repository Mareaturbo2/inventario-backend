// backend/server.js

const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

const MASTER_PASSWORD = "pidorri17";

app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco SQLite
const db = new sqlite3.Database('./inventario.db', (err) => {
  if (err) console.error(err);
  else console.log("Banco de dados conectado");
});

// Criação das tabelas
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nome TEXT, senha TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY, nome TEXT, quantidade INTEGER)");
  db.run(`CREATE TABLE IF NOT EXISTS retiradas (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER,
    produto_id INTEGER,
    quantidade INTEGER,
    data TEXT,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(produto_id) REFERENCES produtos(id)
  )`);
});

// Login de usuário
app.post('/login', (req, res) => {
  const { id, senha } = req.body;
  db.get("SELECT * FROM usuarios WHERE id = ? AND senha = ?", [id, senha], (err, row) => {
    if (err) return res.status(500).json({ error: err });
    if (row) res.json({ success: true, user: row });
    else res.status(401).json({ error: "ID ou senha inválidos" });
  });
});

// Listar produtos
app.get('/produtos', (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// Retirada de produto
app.post('/retirar', (req, res) => {
  const { usuario_id, senha, produto_id, quantidade } = req.body;

  db.get("SELECT * FROM usuarios WHERE id = ? AND senha = ?", [usuario_id, senha], (err, user) => {
    if (err || !user) return res.status(401).json({ error: "ID ou senha inválidos" });

    db.get("SELECT * FROM produtos WHERE id = ?", [produto_id], (err, produto) => {
      if (!produto || produto.quantidade < quantidade) {
        return res.status(400).json({ error: "Produto inexistente ou quantidade insuficiente" });
      }

      const novaQuantidade = produto.quantidade - quantidade;
      db.run("UPDATE produtos SET quantidade = ? WHERE id = ?", [novaQuantidade, produto_id]);
      db.run("INSERT INTO retiradas (usuario_id, produto_id, quantidade, data) VALUES (?, ?, ?, datetime('now'))",
        [usuario_id, produto_id, quantidade]);

      res.json({ success: true });
    });
  });
});

// Login do admin
app.post('/admin/login', (req, res) => {
  const { senha } = req.body;
  if (senha === MASTER_PASSWORD) res.json({ success: true });
  else res.status(401).json({ error: "Senha inválida" });
});

// Adicionar produto (admin)
app.post('/admin/produtos', (req, res) => {
  const { senha, nome, quantidade } = req.body;
  if (senha !== MASTER_PASSWORD) return res.status(401).json({ error: "Senha inválida" });
  db.run("INSERT INTO produtos (nome, quantidade) VALUES (?, ?)", [nome, quantidade], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// Editar produto (admin)
app.put('/admin/produtos/:id', (req, res) => {
  const { senha, nome, quantidade } = req.body;
  if (senha !== MASTER_PASSWORD) return res.status(401).json({ error: "Senha inválida" });
  db.run("UPDATE produtos SET nome = ?, quantidade = ? WHERE id = ?", [nome, quantidade, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// Cadastrar usuário (admin)
app.post('/admin/usuarios', (req, res) => {
  const { senha, nome, senhaUsuario } = req.body;
  if (senha !== MASTER_PASSWORD) return res.status(401).json({ error: "Senha inválida" });
  db.run("INSERT INTO usuarios (nome, senha) VALUES (?, ?)", [nome, senhaUsuario], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// Editar usuário (admin)
app.put('/admin/usuarios/:id', (req, res) => {
  const { senha, nome, novaSenha } = req.body;
  if (senha !== MASTER_PASSWORD) return res.status(401).json({ error: "Senha inválida" });
  db.run("UPDATE usuarios SET nome = ?, senha = ? WHERE id = ?", [nome, novaSenha, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

// Ver histórico (admin)
app.get('/admin/historico', (req, res) => {
  const senha = req.query.senha;
  if (senha !== MASTER_PASSWORD) return res.status(401).json({ error: "Senha inválida" });
  db.all(`SELECT r.id, u.nome AS usuario, p.nome AS produto, r.quantidade, r.data
          FROM retiradas r
          JOIN usuarios u ON r.usuario_id = u.id
          JOIN produtos p ON r.produto_id = p.id
          ORDER BY r.data DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

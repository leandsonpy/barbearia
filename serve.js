const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permite que o HTML converse com o servidor backend

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',          // Seu usuário do MySQL
    password: 'suasenha',   // Sua senha do MySQL
    database: 'barbearia'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado com sucesso ao banco de dados MySQL!');
});

// Rota de Cadastro de Clientes
app.post('/api/cadastro', (req, res) => {
    const { nome, telefone, email, senha } = req.body;

    const sql = "INSERT INTO usuarios (nome, telefone, email, senha) VALUES (?, ?, ?, ?)";
    db.query(sql, [nome, telefone, email, senha], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado.' });
            }
            return res.status(500).json({ mensagem: 'Erro ao salvar no banco de dados.' });
        }
        res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
    });
});

// Rota de validação de Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
    db.query(sql, [email, senha], (err, results) => {
        if (err) return res.status(500).json({ mensagem: 'Erro no servidor.' });

        if (results.length > 0) {
            res.status(200).json({ mensagem: 'Acesso permitido', usuario: results[0] });
        } else {
            res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
        }
    });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando em http://127.0.0.1:3306');
});
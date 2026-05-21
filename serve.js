const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// AJUSTADO: Sem senha '' para o padrão do SENAI/XAMPP
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',          
    password: '',   
    database: 'barbearia'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado com sucesso ao banco de dados MySQL!');
});

// NOVA ROTA: Salva usuário E cria o agendamento dele
app.post('/api/cadastro', (req, res) => {
    const { nome, telefone, email, senha, data_agendada, horario } = req.body;

    const sqlUsuario = "INSERT INTO usuarios (nome, telefone, email, senha) VALUES (?, ?, ?, ?)";
    db.query(sqlUsuario, [nome, telefone, email, senha], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado.' });
            }
            return res.status(500).json({ mensagem: 'Erro ao salvar o usuário.' });
        }

        const sqlAgendamento = "INSERT INTO agendamentos (cliente_nome, data_agendada, horario) VALUES (?, ?, ?)";
        db.query(sqlAgendamento, [nome, data_agendada, horario], (errAgend) => {
            if (errAgend) {
                return res.status(500).json({ mensagem: 'Usuário criado, mas erro na agenda.' });
            }
            res.status(201).json({ mensagem: 'Usuário registrado e horário agendado!' });
        });
    });
});

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

// NOVA ROTA: Envia os horários para o seu HTML montar a lista
app.get('/api/agendamentos', (req, res) => {
    const sql = "SELECT cliente_nome, data_agendada, horario FROM agendamentos ORDER BY data_agendada ASC, horario ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ mensagem: 'Erro ao buscar agendamentos.' });
        res.status(200).json(results);
    });
});

// AJUSTADO: Porta 3000 correta no log
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
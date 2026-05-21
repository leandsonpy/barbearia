const loginBox = document.getElementById('loginBox');
const cadastroBox = document.getElementById('cadastroBox');
const painelBox = document.getElementById('painelBox');

// Alternar entre telas
document.getElementById('linkIrParaCadastro').addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.classList.add('hide');
    cadastroBox.classList.remove('hide');
});

document.getElementById('linkIrParaLogin').addEventListener('click', (e) => {
    e.preventDefault();
    cadastroBox.classList.add('hide');
    loginBox.classList.remove('hide');
});

document.getElementById('btnDesconectar').addEventListener('click', () => {
    painelBox.classList.add('hide');
    loginBox.classList.remove('hide');
});

// LOGIN: Se der certo, abre a tabela
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;

    try {
        const resposta = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const dados = await resposta.json();

        if (resposta.ok) {
            alert('Login efetuado com sucesso!');
            loginBox.classList.add('hide');
            painelBox.classList.remove('hide');
            carregarAgendamentos(); // Busca os horários no banco
        } else {
            alert('Erro: ' + dados.mensagem);
        }
    } catch (erro) {
        alert('Erro ao conectar ao servidor backend.');
    }
});

// BUSCAR HORÁRIOS DO BANCO DE DADOS
async function carregarAgendamentos() {
    const tabelaCorpo = document.getElementById('corpoTabelaAgendamentos');
    try {
        const resposta = await fetch('http://localhost:3000/api/agendamentos');
        const agendamentos = await resposta.json();
        tabelaCorpo.innerHTML = '';

        if (agendamentos.length === 0) {
            tabelaCorpo.innerHTML = `<tr><td colspan="3" style="color: #888;">Nenhum horário agendado.</td></tr>`;
            return;
        }

        agendamentos.forEach(item => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td><strong>${item.cliente_nome}</strong></td>
                <td>${new Date(item.data_agendada).toLocaleDateString('pt-BR')}</td>
                <td>${item.horario.substring(0, 5)} h</td>
            `;
            tabelaCorpo.appendChild(linha);
        });
    } catch (erro) {
        tabelaCorpo.innerHTML = `<tr><td colspan="3" style="color: #ff4d4d;">Erro ao carregar dados da agenda.</td></tr>`;
    }
}

// CADASTRO + AGENDAMENTO
document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const nome = document.getElementById('cadNome').value;
    const telefone = document.getElementById('cadTelefone').value;
    const email = document.getElementById('cadEmail').value;
    const senha = document.getElementById('cadSenha').value;
    const data_agendada = document.getElementById('cadData').value;
    const horario = document.getElementById('cadHorario').value;

    try {
        const resposta = await fetch('http://localhost:3000/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email, senha, data_agendada, horario })
        });
        const dados = await resposta.json();

        if (resposta.ok) {
            alert('Cadastro e Agendamento realizados!');
            document.getElementById('cadastroForm').reset();
            cadastroBox.classList.add('hide');
            loginBox.classList.remove('hide');
        } else {
            alert('Erro: ' + dados.mensagem);
        }
    } catch (erro) {
        alert('Não foi possível conectar ao servidor backend.');
    }
});
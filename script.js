const loginBox = document.getElementById('loginBox');
const cadastroBox = document.getElementById('cadastroBox');

// Alternar entre Login e Cadastro
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

// EVENTO DE CADASTRO (Envia dados para o MySQL através do Backend)
document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('cadNome').value;
    const telefone = document.getElementById('cadTelefone').value;
    const email = document.getElementById('cadEmail').value;
    const senha = document.getElementById('cadSenha').value;

    try {
        // Envia os dados para a API do servidor local
        const resposta = await fetch('http://localhost:3000/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert('Cadastro realizado com sucesso!');
            cadastroForm.reset();
            // Voltar para a tela de login
            cadastroBox.classList.add('hide');
            loginBox.classList.remove('hide');
        } else {
            alert('Erro: ' + dados.mensagem);
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        alert('Não foi possível conectar ao servidor backend.');
    }
});

// EVENTO DE LOGIN
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
            alert('Login efetuado com sucesso! Redirecionando...');
            // window.location.href = 'painel.html';
        } else {
            alert('Erro: ' + dados.mensagem);
        }
    } catch (erro) {
        alert('Erro ao conectar ao servidor.');
    }
});
// ==============================
// 🌿 ANIMAÇÃO DE FUNDO (FOLHAS)
// ==============================

// Cria folhas caindo
function createLeaf() {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");

    leaf.style.left = Math.random() * window.innerWidth + 'px';
    leaf.style.animationDuration = (5 + Math.random() * 5) + 's';

    let size = 10 + Math.random() * 20;
    leaf.style.width = size + 'px';
    leaf.style.height = size / 2 + 'px';

    let hue = Math.random() * 40 + 100;
    leaf.style.background = `linear-gradient(45deg, hsl(${hue},80%,50%), hsl(${hue},80%,30%))`;
    leaf.style.boxShadow = `0 0 10px hsl(${hue},80%,50%)`;

    document.body.appendChild(leaf);

    // Remove a folha depois AQde um tempo
    setTimeout(() => leaf.remove(), 10000);
}

// Gera folhas continuamente
setInterval(createLeaf, 250);


// Anima o fundo (cor mudando)
function animateBackground() {
    let hue = 160;

    setInterval(() => {
        hue += 0.2;

        document.body.style.background = `
        linear-gradient(120deg, 
        hsl(${hue}, 70%, 12%), 
        #000
        )`;
    }, 10);
}

animateBackground();


// ==============================
// 🔐 ESQUECI MINHA SENHA
// ==============================

function esqSenha() {

    const email = document.getElementById("email").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const msg = document.getElementById("mensagem");

    msg.className = "msg";

    // Validação de campos
    if (!email || !novaSenha || !confirmarSenha) {
        msg.innerText = "Preencha todos os campos!";
        msg.classList.add("erro");
        return;
    }

    // Verifica se senhas coincidem
    if (novaSenha !== confirmarSenha) {
        msg.innerText = "As senhas não são iguais!";
        msg.classList.add("erro");
        return;
    }

    // Busca usuário no localStorage
    const usuario = JSON.parse(localStorage.getItem(email));

    if (!usuario) {
        msg.innerText = "E-mail não encontrado!";
        msg.classList.add("erro");
        return;
    }

    // Atualiza senha
    usuario.senha = novaSenha;
    localStorage.setItem(email, JSON.stringify(usuario));

    msg.innerText = "Senha redefinida com sucesso!";
    msg.classList.add("sucesso");

    // Volta pro login após 1.5s
    setTimeout(voltarLogin, 1500);
}


// ==============================
// 🔄 MODO RESET SENHA
// ==============================

function ativarModoReset() {

    document.getElementById("titulo").innerText = "Redefinir senha";

    document.getElementById("password").classList.add("hidden");
    document.getElementById("btnLogin").classList.add("hidden");

    document.getElementById("novaSenha").classList.remove("hidden");
    document.getElementById("confirmarSenha").classList.remove("hidden");
    document.getElementById("btnReset").classList.remove("hidden");

    // Link para voltar pro login

    document.getElementById("textoTroca").innerHTML =
        'Já tem uma conta? <span><a href="#" onclick="voltarLogin()">Faça login</a></span>';
}


// ==============================
// 🔙 VOLTAR PARA LOGIN
// ==============================

function voltarLogin() {

    document.getElementById("titulo").innerText = "Login";
    document.getElementById("cadastro").classList.remove("hidden");

    // Mostra login
    document.getElementById("password").classList.remove("hidden");
    document.getElementById("btnLogin").classList.remove("hidden");

    // Esconde outros
    document.getElementById("nome").classList.add("hidden");
    document.getElementById("sobrenome").classList.add("hidden");
    document.getElementById("novaSenha").classList.add("hidden");
    document.getElementById("confirmarSenha").classList.add("hidden");
    document.getElementById("btnReset").classList.add("hidden");
    document.getElementById("btnCadastro").classList.add("hidden");

    // Link para cadastro

    document.getElementById("textoTroca").innerHTML =
        'Esqueceu sua senha? <span><a href="#" onclick="ativarModoReset()">Clique aqui</a></span>';
}


// ==============================
// 🧾 MODO CADASTRO
// ==============================

function ativarModoCadastro() {

    document.getElementById("titulo").innerText = "Cadastro";
    document.getElementById("cadastro").classList.add("hidden");

    // Esconde login
    document.getElementById("password").classList.add("hidden");
    document.getElementById("btnLogin").classList.add("hidden");
    document.getElementById("btnReset").classList.add("hidden");

    // Mostra cadastro
    document.getElementById("nome").classList.remove("hidden");
    document.getElementById("sobrenome").classList.remove("hidden");
    document.getElementById("novaSenha").classList.remove("hidden");
    document.getElementById("confirmarSenha").classList.remove("hidden");
    document.getElementById("btnCadastro").classList.remove("hidden");

    // Link para voltar pro login
    document.getElementById("textoTroca").innerHTML =
        'Já tem uma conta? <span><a href="#" onclick="voltarLogin()">Faça login</a></span>';
}


// ==============================
// 🧾 CADASTRAR USUÁRIO
// ==============================

function cadastrar() {

    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("novaSenha").value;
    const confirmar = document.getElementById("confirmarSenha").value;
    const msg = document.getElementById("mensagem");

    msg.className = "msg";

    if (!nome || !sobrenome || !email || !senha || !confirmar) {
        msg.innerText = "Preencha todos os campos!";
        msg.classList.add("erro");
        return;
    }

    if (senha !== confirmar) {
        msg.innerText = "As senhas não coincidem!";
        msg.classList.add("erro");
        return;
    }

    if (localStorage.getItem(email)) {
        msg.innerText = "Usuário já cadastrado!";
        msg.classList.add("erro");
        return;
    }

    const usuario = {
        nome,
        sobrenome,
        email,
        senha,
        pontos: 0
    };

    localStorage.setItem(email, JSON.stringify(usuario));

    msg.innerText = "Cadastro realizado com sucesso!";
    msg.classList.add("sucesso");

    setTimeout(voltarLogin, 1500);
}


// ==============================
// EVENTOS DE CLIQUE
// ==============================

document.getElementById("btnReset").onclick = esqSenha;
document.getElementById("btnCadastro").onclick = cadastrar;


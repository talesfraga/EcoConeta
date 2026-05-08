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
    const msg = document.getElementById("mensagem");

    msg.className = "msg";

    // Validação de campos
    if (!email) {
        msg.innerText = "Preencha todos os campos!";
        msg.classList.add("erro");
        return;
    }

    // Verifica se senhas coincidem
    supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: new URL("reset-password.html", window.location.href).href
    }).then(({ error }) => {
        if (error) {
            msg.innerText = "Erro ao enviar e-mail de redefinição.";
            msg.classList.add("erro");
            return;
        }

        msg.innerText = "E-mail de redefinição enviado! Verifique sua caixa de entrada.";
        msg.classList.add("sucesso");

        setTimeout(voltarLogin, 2000);
    }).catch(err => {
        console.error("Erro na redefinição:", err);
        msg.innerText = "Erro ao redefinir senha. Tente novamente.";
        msg.classList.add("erro");
    });
}


// ==============================
// 🔄 MODO RESET SENHA
// ==============================

function ativarModoReset() {

    document.getElementById("titulo").innerText = "Redefinir senha";

    document.getElementById("password").classList.add("hidden");
    document.getElementById("btnLogin").classList.add("hidden");

    document.getElementById("novaSenha").classList.add("hidden");
    document.getElementById("confirmarSenha").classList.add("hidden");
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

    if (senha.length < 6) {
        msg.innerText = "A senha deve ter pelo menos 6 caracteres!";
        msg.classList.add("erro");
        return;
    }

    supabaseClient.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: {
                nome: nome,
                sobrenome: sobrenome
            },
            emailRedirectTo: new URL("index.html", window.location.href).href
        }
    }).then(({ data, error }) => {
        if (error) {
            console.error('Erro no signup:', error);
            if (error.message.includes("already registered")) {
                msg.innerText = "E-mail já cadastrado!";
            } else if (error.message.includes("Password should be at least")) {
                msg.innerText = "A senha deve ter pelo menos 6 caracteres!";
            } else {
                msg.innerText = "Erro ao cadastrar: " + error.message;
            }
            msg.classList.add("erro");
            return;
        }

        if (data.user && !data.user.email_confirmed_at) {
            msg.innerText = "Cadastro realizado! Faça login com suas credenciais.";
            msg.classList.add("sucesso");
            setTimeout(voltarLogin, 2000);
        } else {
            msg.innerText = "Cadastro realizado com sucesso!";
            msg.classList.add("sucesso");
            setTimeout(voltarLogin, 2000);
        }
    }).catch(err => {
        console.error("Erro no cadastro:", err);
        msg.innerText = "Erro ao cadastrar. Verifique o console para mais detalhes.";
        msg.classList.add("erro");
    });
}


// ==============================
// EVENTOS DE CLIQUE
// ==============================

const btnReset = document.getElementById("btnReset");
const btnCadastro = document.getElementById("btnCadastro");

if (btnReset) btnReset.onclick = esqSenha;
if (btnCadastro) btnCadastro.onclick = cadastrar;

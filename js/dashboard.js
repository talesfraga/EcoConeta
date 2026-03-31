// ==============================
// CONECTANDO USUARIO
// ==============================

const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

if (document.getElementById("boasVindas")) {

    if (usuario && usuario.nome) {
        document.getElementById("boasVindas").innerText =
            `Bem-vindo, ${usuario.nome}!`;
    } else {
        document.getElementById("boasVindas").innerText =
            "Bem-vindo, Visitante!";
    }

    document.getElementById("pontos").innerText =
        `Pontos: ${usuario ? usuario.pontos || 0 : 0}`;
}

// ==============================
// 🔐 Entrar no Site
// ==============================

function logar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const msg = document.getElementById("mensagem");

    const usuario = JSON.parse(localStorage.getItem(email));

    if (!usuario || usuario.senha !== senha) {
        msg.className = "msg erro";
        msg.innerText = "E-mail ou senha incorretos!";
        return;
    }

    // 🔐 salva usuário logado
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    msg.className = "msg sucesso";
    msg.innerText = "Login realizado com sucesso!";

    setTimeout(() => {
        window.location.href = "./html/dashboard.html";
    }, 1000);
}

// Sair da conta

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../index.html";
}

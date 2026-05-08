// ==============================
// CONECTANDO USUARIO
// ==============================

const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

function atualizarBoasVindas(usuarioAtual) {
    const boasVindas = document.getElementById("boasVindas");
    const pontos = document.getElementById("pontos");

    if (!boasVindas) return;

    if (usuarioAtual && usuarioAtual.nome) {
        boasVindas.innerText = `Bem-vindo, ${usuarioAtual.nome}!`;
    } else {
        boasVindas.innerText = "Bem-vindo, Visitante!";
    }

    if (pontos) {
        pontos.innerText = `Pontos: ${usuarioAtual ? usuarioAtual.pontos || 0 : 0}`;
    }
}

atualizarBoasVindas(usuario);

function atualizarBotaoAuth(logado) {
    const authButton = document.getElementById("authButton");
    if (!authButton) return;

    authButton.innerText = logado ? "Sair" : "Entrar";
}

// ==============================
// 🔐 Entrar no Site
// ==============================

function logar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const msg = document.getElementById("mensagem");

    msg.className = "msg";

    if (!email || !senha) {
        msg.innerText = "Preencha e-mail e senha!";
        msg.classList.add("erro");
        return;
    }

    supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    }).then(({ data, error }) => {
        if (error || !data?.user) {
            msg.innerText = "E-mail ou senha incorretos!";
            msg.classList.add("erro");
            return;
        }

        // Salva dados do usuário logado
        const usuario = {
            id: data.user.id,
            email: data.user.email,
            nome: data.user.user_metadata?.nome || "Usuário",
            sobrenome: data.user.user_metadata?.sobrenome || "",
            pontos: 0
        };

        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        msg.innerText = "Login realizado com sucesso!";
        msg.classList.add("sucesso");

        // Pequena pausa para garantir que a sessão seja estabelecida
        setTimeout(async () => {
            try {
                // Verifica se a sessão foi criada corretamente
                const { data: { user: currentUser } } = await supabaseClient.auth.getUser();
                if (currentUser) {
                    // Redirecionamento com caminho absoluto
                    window.location.href = "./html/dashboard.html";
                } else {
                    console.error('Sessão não foi estabelecida corretamente');
                    localStorage.removeItem("usuarioLogado");
                    msg.innerText = "Erro na autenticação. Tente novamente.";
                    msg.classList.add("erro");
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
                localStorage.removeItem("usuarioLogado");
                msg.innerText = "Erro na autenticação. Tente novamente.";
                msg.classList.add("erro");
            }
        }, 500);
    }).catch(err => {
        console.error("Erro no login:", err);
        msg.innerText = "Erro ao fazer login. Tente novamente.";
        msg.classList.add("erro");
    });
}

// Sair da conta

function handleAuthAction() {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuarioLocal) {
        logout();
        return;
    }

    window.location.href = "../index.html?login=1";
}

function logout() {
    // Limpa dados locais primeiro
    localStorage.removeItem("usuarioLogado");

    // Depois limpa a sessão do Supabase
    supabaseClient.auth.signOut().then(() => {
        window.location.href = "../index.html?login=1";
    }).catch(err => {
        console.error("Erro ao fazer logout do Supabase:", err);
        // Mesmo com erro, redireciona para login
        window.location.href = "../index.html?login=1";
    });
}

async function verificarAcessoDashboard() {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLocal) {
        atualizarBoasVindas(null);
        atualizarBotaoAuth(false);
        return;
    }

    atualizarBoasVindas(usuarioLocal);
    atualizarBotaoAuth(true);

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const { data: { user }, error } = await supabaseClient.auth.getUser();

        if (error || !user || !session) {
            localStorage.removeItem("usuarioLogado");
            atualizarBoasVindas(null);
            atualizarBotaoAuth(false);
            return;
        }

        atualizarBotaoAuth(true);
    } catch (error) {
        console.error("Erro ao verificar sessao Supabase:", error);
    }
}

function mostrarSecao(secao) {
    document.querySelectorAll('[id^="secao-"]').forEach(el => el.classList.add("hidden"));

    const alvo = document.getElementById("secao-" + secao);
    if (!alvo) return;

    alvo.classList.remove("hidden");

    if (secao === "mapa") {
        setTimeout(async () => {
            await inicializarMapa();
            if (mapa) mapa.invalidateSize();
        }, 100);
    }

    if (secao === "denuncia") carregarDenuncias();
    if (secao === "educacao") renderizarEducacao("todos");
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("secao-inicio")) {
        verificarAcessoDashboard();
    }
});

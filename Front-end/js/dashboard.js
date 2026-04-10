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
        if (error) {
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
                    console.log('Sessão estabelecida, redirecionando para dashboard...');
                    console.log('Caminho atual:', window.location.href);
                    console.log('Redirecionando para:', window.location.origin + '/Front-end/html/dashboard.html');

                    // Redirecionamento com caminho absoluto
                    window.location.href = "./html/dashboard.html";
                } else {
                    console.error('Sessão não foi estabelecida corretamente');
                    msg.innerText = "Erro na autenticação. Tente novamente.";
                    msg.classList.add("erro");
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
                // Mesmo com erro na verificação, tenta redirecionar
                console.log('Tentando redirecionamento forçado...');
                window.location.href = "./html/dashboard.html";
            }
        }, 500);
    }).catch(err => {
        console.error("Erro no login:", err);
        msg.innerText = "Erro ao fazer login. Tente novamente.";
        msg.classList.add("erro");
    });
}

// Sair da conta

function logout() {
    // Limpa dados locais primeiro
    localStorage.removeItem("usuarioLogado");

    // Depois limpa a sessão do Supabase
    supabaseClient.auth.signOut().then(() => {
        console.log('Logout realizado com sucesso');
        window.location.href = "../index.html";
    }).catch(err => {
        console.error("Erro ao fazer logout do Supabase:", err);
        // Mesmo com erro, redireciona para login
        window.location.href = "../index.html";
    });
}

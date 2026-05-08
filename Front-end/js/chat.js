// ==============================
// ECOCHAT - Chatbot Ambiental
// ==============================

async function enviarMensagem() {
  const input = document.getElementById("chatInput");
  const mensagem = input.value.trim();
  if (!mensagem) return;

  if (mensagem.length > 1000) {
    adicionarBolha("Envie uma mensagem com no maximo 1000 caracteres.", "bot");
    return;
  }

  adicionarBolha(mensagem, "usuario");
  input.value = "";

  const digitando = adicionarBolha("...", "bot", true);

  try {
    let { data: { session } } = await supabaseClient.auth.getSession();

    if (!session?.access_token) {
      const { data } = await supabaseClient.auth.refreshSession();
      session = data.session;
    }

    if (!session?.user || !session?.access_token) {
      digitando.remove();
      adicionarBolha("Faca login novamente para usar o EcoChat.", "bot");
      return;
    }

    const { data, error } = await supabaseClient.functions.invoke("chat", {
      body: { message: mensagem },
    });

    digitando.remove();

    if (error) {
      console.error("Erro na funcao chat:", error);
      adicionarBolha("EcoChat indisponivel agora. Tente novamente em instantes.", "bot");
      return;
    }

    if (!data?.answer) {
      console.error("Resposta invalida da funcao chat:", data);
      adicionarBolha("Nao foi possivel obter resposta da IA. Tente novamente.", "bot");
      return;
    }

    adicionarBolha(data.answer, "bot");
  } catch (err) {
    digitando.remove();
    console.error("Erro no chat:", err);
    adicionarBolha("Erro ao conectar com o assistente. Tente novamente.", "bot");
  }
}

function adicionarBolha(texto, tipo, temporaria = false) {
  const chat = document.getElementById("chatMensagens");
  const bolha = document.createElement("div");
  bolha.classList.add("bolha", tipo);
  if (temporaria) bolha.classList.add("digitando");
  bolha.innerText = texto;
  chat.appendChild(bolha);
  chat.scrollTop = chat.scrollHeight;
  return bolha;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chatInput");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") enviarMensagem();
    });
  }
});

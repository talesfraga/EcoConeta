// ==============================
// 💬 ECOCHAT — Chatbot Ambiental
// ==============================

const FUNCTION_URL = "https://hkgfyzyzfhxdttyxvxkd.supabase.co/functions/v1/chat"; // ← troque pela sua URL

async function enviarMensagem() {
  const input = document.getElementById("chatInput");
  const mensagem = input.value.trim();
  if (!mensagem) return;

  adicionarBolha(mensagem, "usuario");
  input.value = "";

  const digitando = adicionarBolha("...", "bot", true);

  try {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "anonimo", message: mensagem }),
    });

    const data = await response.json();
    digitando.remove();

    if (!response.ok) {
      console.error("Erro na função chat:", data);
      adicionarBolha("Erro ao conectar com o assistente. Tente novamente.", "bot");
      return;
    }

    if (!data?.answer) {
      console.error("Resposta inválida da função chat:", data);
      adicionarBolha("Não foi possível obter resposta da IA. Tente novamente.", "bot");
      return;
    }

    adicionarBolha(data.answer, "bot");

  } catch (err) {
    digitando.remove();
    console.error("Erro no chat:", err);
    adicionarBolha("Erro ao conectar com o assistente. Tente novamente.", "bot");
  }
}

// Cria uma bolha de mensagem no chat
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

// Permite enviar com Enter
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chatInput");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") enviarMensagem();
    });
  }
});

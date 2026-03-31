// ==============================
// 🚨 ECODENÚNCIA
// ==============================

// Envia uma denúncia para o Supabase
async function enviarDenuncia() {
  const email = document.getElementById("denunciaEmail").value.trim();
  const titulo = document.getElementById("denunciaTitulo").value.trim();
  const descricao = document.getElementById("denunciaDescricao").value.trim();
  const fotoInput = document.getElementById("denunciaFoto");
  const msg = document.getElementById("denunciaMensagem");

  msg.className = "denuncia-msg";
  msg.innerText = "";

  if (!email || !titulo || !descricao) {
    msg.innerText = "Preencha e-mail, título e descrição!";
    msg.classList.add("erro");
    return;
  }

  let foto_url = null;

  // Upload da foto se houver
  if (fotoInput.files.length > 0) {
    const file = fotoInput.files[0];
    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await supabaseClient.storage
      .from("denuncias-fotos")
      .upload(fileName, file);

    if (error) {
      msg.innerText = "Erro ao enviar foto. Tente sem a imagem.";
      msg.classList.add("erro");
      return;
    }

    const { data: urlData } = supabaseClient.storage
      .from("denuncias-fotos")
      .getPublicUrl(fileName);

    foto_url = urlData.publicUrl;
  }

  // Salva a denúncia no banco
  const { error } = await supabaseClient.from("denuncias").insert({
    email,
    titulo,
    descricao,
    foto_url,
  });

  if (error) {
    msg.innerText = "Erro ao enviar denúncia. Tente novamente.";
    msg.classList.add("erro");
    return;
  }

  msg.innerText = "Denúncia enviada com sucesso! Obrigado pela sua contribuição. 🌿";
  msg.classList.add("sucesso");

  // Limpa o formulário
  document.getElementById("denunciaEmail").value = "";
  document.getElementById("denunciaTitulo").value = "";
  document.getElementById("denunciaDescricao").value = "";
  fotoInput.value = "";

  // Atualiza o feed
  carregarDenuncias();
}

// Carrega o feed público de denúncias
async function carregarDenuncias() {
  const feed = document.getElementById("denunciaFeed");
  if (!feed) return;

  feed.innerHTML = "<p class='feed-carregando'>Carregando denúncias...</p>";

  const { data, error } = await supabaseClient
    .from("denuncias")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    feed.innerHTML = "<p class='feed-vazio'>Nenhuma denúncia registrada ainda.</p>";
    return;
  }

  feed.innerHTML = data.map((d) => `
    <div class="denuncia-card">
      <div class="denuncia-card-header">
        <span class="denuncia-titulo">${d.titulo}</span>
        <span class="denuncia-data">${new Date(d.created_at).toLocaleDateString("pt-BR")}</span>
      </div>
      <p class="denuncia-descricao">${d.descricao}</p>
      ${d.foto_url ? `<img src="${d.foto_url}" class="denuncia-foto" alt="Foto da denúncia">` : ""}
      <span class="denuncia-status status-${d.status}">${traduzirStatus(d.status)}</span>
    </div>
  `).join("");
}

function traduzirStatus(status) {
  const map = {
    pendente: "🕐 Pendente",
    "em analise": "🔍 Em análise",
    resolvido: "✅ Resolvido",
  };
  return map[status] || status;
}

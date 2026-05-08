// ==============================
// ECODENUNCIA
// ==============================

const DENUNCIA_MAX_FILE_SIZE = 5 * 1024 * 1024;
const DENUNCIA_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function enviarDenuncia() {
  const email = document.getElementById("denunciaEmail").value.trim();
  const titulo = document.getElementById("denunciaTitulo").value.trim();
  const descricao = document.getElementById("denunciaDescricao").value.trim();
  const fotoInput = document.getElementById("denunciaFoto");
  const msg = document.getElementById("denunciaMensagem");

  msg.className = "denuncia-msg";
  msg.innerText = "";

  if (!validarDenuncia(email, titulo, descricao, msg)) return;

  let foto_url = null;

  if (fotoInput.files.length > 0) {
    const upload = await enviarFotoDenuncia(fotoInput.files[0], msg);
    if (!upload.ok) return;
    foto_url = upload.url;
  }

  const { error } = await supabaseClient.from("denuncias").insert({
    user_id: null,
    email,
    titulo,
    descricao,
    foto_url,
  });

  if (error) {
    msg.innerText = "Erro ao enviar denuncia. Tente novamente.";
    msg.classList.add("erro");
    return;
  }

  msg.innerText = "Denuncia enviada com sucesso! Obrigado pela sua contribuicao.";
  msg.classList.add("sucesso");

  document.getElementById("denunciaEmail").value = "";
  document.getElementById("denunciaTitulo").value = "";
  document.getElementById("denunciaDescricao").value = "";
  fotoInput.value = "";

  carregarDenuncias();
}

function validarDenuncia(email, titulo, descricao, msg) {
  if (!email || !titulo || !descricao) {
    msg.innerText = "Preencha e-mail, titulo e descricao.";
    msg.classList.add("erro");
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.innerText = "Digite um e-mail valido.";
    msg.classList.add("erro");
    return false;
  }

  if (titulo.length > 120) {
    msg.innerText = "O titulo deve ter no maximo 120 caracteres.";
    msg.classList.add("erro");
    return false;
  }

  if (descricao.length > 1200) {
    msg.innerText = "A descricao deve ter no maximo 1200 caracteres.";
    msg.classList.add("erro");
    return false;
  }

  return true;
}

async function enviarFotoDenuncia(file, msg) {
  if (!DENUNCIA_ALLOWED_TYPES.includes(file.type)) {
    msg.innerText = "Envie uma imagem JPG, PNG ou WEBP.";
    msg.classList.add("erro");
    return { ok: false };
  }

  if (file.size > DENUNCIA_MAX_FILE_SIZE) {
    msg.innerText = "A imagem deve ter no maximo 5MB.";
    msg.classList.add("erro");
    return { ok: false };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `public/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseClient.storage
    .from("denuncias-fotos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    msg.innerText = "Erro ao enviar foto. Tente sem a imagem.";
    msg.classList.add("erro");
    return { ok: false };
  }

  const { data: urlData } = supabaseClient.storage
    .from("denuncias-fotos")
    .getPublicUrl(fileName);

  return { ok: true, url: urlData.publicUrl };
}

async function carregarDenuncias() {
  const feed = document.getElementById("denunciaFeed");
  if (!feed) return;

  feed.replaceChildren(criarMensagemFeed("Carregando denuncias...", "feed-carregando"));

  const { data, error } = await supabaseClient
    .from("denuncias")
    .select("titulo, descricao, foto_url, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    feed.replaceChildren(criarMensagemFeed("Nenhuma denuncia registrada ainda.", "feed-vazio"));
    return;
  }

  feed.replaceChildren(...data.map(criarCardDenuncia));
}

function criarMensagemFeed(texto, classe) {
  const p = document.createElement("p");
  p.className = classe;
  p.innerText = texto;
  return p;
}

function criarCardDenuncia(denuncia) {
  const card = document.createElement("div");
  card.className = "denuncia-card";

  const header = document.createElement("div");
  header.className = "denuncia-card-header";

  const titulo = document.createElement("span");
  titulo.className = "denuncia-titulo";
  titulo.innerText = denuncia.titulo || "Denuncia sem titulo";

  const data = document.createElement("span");
  data.className = "denuncia-data";
  data.innerText = denuncia.created_at
    ? new Date(denuncia.created_at).toLocaleDateString("pt-BR")
    : "";

  header.append(titulo, data);

  const descricao = document.createElement("p");
  descricao.className = "denuncia-descricao";
  descricao.innerText = denuncia.descricao || "";

  card.append(header, descricao);

  if (denuncia.foto_url && denuncia.foto_url.startsWith(SUPABASE_URL)) {
    const img = document.createElement("img");
    img.src = denuncia.foto_url;
    img.className = "denuncia-foto";
    img.alt = "Foto da denuncia";
    img.loading = "lazy";
    card.appendChild(img);
  }

  const status = document.createElement("span");
  status.className = `denuncia-status ${classeStatus(denuncia.status)}`;
  status.innerText = traduzirStatus(denuncia.status);
  card.appendChild(status);

  return card;
}

function classeStatus(status) {
  const classes = {
    pendente: "status-pendente",
    "em analise": "status-em-analise",
    resolvido: "status-resolvido",
  };
  return classes[status] || "status-pendente";
}

function traduzirStatus(status) {
  const map = {
    pendente: "Pendente",
    "em analise": "Em analise",
    resolvido: "Resolvido",
  };
  return map[status] || "Pendente";
}

// ==============================
// 📚 ECOEDUCAÇÃO — Artigos estáticos
// ==============================

const artigos = [
  {
    id: 1,
    categoria: "reciclagem",
    emoji: "♻️",
    titulo: "Como separar o lixo corretamente",
    resumo: "Entenda as cores das lixeiras e o que vai em cada uma. A separação correta aumenta em até 3x a eficiência da reciclagem.",
    leitura: "3 min",
    dicas: [
      "🔵 Azul: papel e papelão (secos e limpos)",
      "🔴 Vermelho: plásticos em geral",
      "🟡 Amarelo: metais (latas, tampas, panelas velhas)",
      "🟢 Verde: vidros (garrafas, potes)",
      "🟤 Marrom: resíduos orgânicos (cascas, restos de comida)",
      "⚫ Preto/Cinza: rejeitos (fraldas, papel higiênico, isopor sujo)"
    ]
  },
  {
    id: 2,
    categoria: "reciclagem",
    emoji: "🧴",
    titulo: "Embalagens: o que pode e o que não pode reciclar",
    resumo: "Nem tudo que parece reciclável pode ser reciclado. Saiba identificar os materiais e evitar a contaminação do lixo.",
    leitura: "4 min",
    dicas: [
      "✅ Garrafas PET limpas e amassadas",
      "✅ Caixas de leite e suco (Tetra Pak) — reutilizáveis!",
      "✅ Latinhas de alumínio (sempre vale a pena)",
      "❌ Isopor: dificulta reciclagem, evite sempre que possível",
      "❌ Papel engordurado (caixas de pizza com resíduo)",
      "❌ Fraldas e absorventes são rejeitos, nunca reciclagem"
    ]
  },
  {
    id: 3,
    categoria: "clima",
    emoji: "🌡️",
    titulo: "O que é o efeito estufa e por que importa",
    resumo: "O efeito estufa é natural e necessário — mas o excesso de CO₂ causado por humanos está aquecendo o planeta além do limite seguro.",
    leitura: "5 min",
    dicas: [
      "🌍 Temperatura média global subiu ~1.1°C desde a era pré-industrial",
      "🔥 Queima de combustíveis fósseis é a maior fonte de CO₂",
      "🌊 Derretimento das geleiras eleva o nível dos oceanos",
      "🌱 Florestas absorvem CO₂ — desmatar piora a crise",
      "💡 Cada pessoa emite em média 4–8 toneladas de CO₂/ano no Brasil",
      "🚶 Andar a pé, usar transporte público e comer menos carne ajudam"
    ]
  },
  {
    id: 4,
    categoria: "clima",
    emoji: "🌧️",
    titulo: "Eventos climáticos extremos no Brasil",
    resumo: "Enchentes, secas e ondas de calor estão ficando mais frequentes. Entenda a conexão com as mudanças climáticas.",
    leitura: "4 min",
    dicas: [
      "🌊 Chuvas intensas aumentam com o aquecimento global",
      "🔥 O Pantanal sofre secas cada vez mais severas",
      "🏔️ Serra Gaúcha e regiões serranas têm mais deslizamentos",
      "💧 Nordeste enfrenta períodos de seca mais longos",
      "🏙️ Ilhas de calor urbanas pioram o desconforto nas cidades",
      "🌳 Arborização urbana reduz temperatura local em até 5°C"
    ]
  },
  {
    id: 5,
    categoria: "consumo",
    emoji: "🛒",
    titulo: "Consumo consciente no dia a dia",
    resumo: "Pequenas escolhas diárias têm grande impacto ambiental. Veja hábitos simples que reduzem sua pegada ecológica.",
    leitura: "3 min",
    dicas: [
      "🛍️ Leve sacola reutilizável às compras",
      "💧 Conserte vazamentos — um torneira gotejando desperdiça 46L/dia",
      "🚿 Banhos de 5 minutos economizam até 90L de água",
      "🥦 Compre produtos locais e da estação (menos transporte, mais sabor)",
      "📱 Evite trocar eletrônicos sem necessidade — o lixo eletrônico é tóxico",
      "🍽️ Planejar refeições reduz o desperdício de alimentos"
    ]
  },
  {
    id: 6,
    categoria: "consumo",
    emoji: "👕",
    titulo: "Moda sustentável: o problema do fast fashion",
    resumo: "A indústria têxtil é a 2ª mais poluente do mundo. Entenda por que e como fazer escolhas melhores.",
    leitura: "4 min",
    dicas: [
      "👖 Produzir 1 calça jeans consome ~7.500L de água",
      "🏭 Toneladas de roupas vão para aterros todo ano",
      "♻️ Brechós e trocas de roupas são ótimas alternativas",
      "🧵 Prefira marcas com certificação de sustentabilidade",
      "🔧 Consertar roupas em vez de descartar é sempre a melhor opção",
      "🌿 Fibras naturais orgânicas (algodão orgânico, linho) poluem menos"
    ]
  },
  {
    id: 7,
    categoria: "energia",
    emoji: "⚡",
    titulo: "Energia solar: vale a pena para o Brasil?",
    resumo: "O Brasil é um dos países com maior potencial solar do mundo. Entenda como funciona e quando compensa instalar.",
    leitura: "5 min",
    dicas: [
      "☀️ O Brasil recebe sol o ano todo — média de 4–6 horas/pico/dia",
      "💰 Retorno do investimento em painéis solares: 4 a 8 anos em média",
      "🏠 Sistemas residenciais custam entre R$15k–R$30k (2024)",
      "📉 Preço dos painéis caiu 90% na última década",
      "⚡ Energia gerada pode ser injetada na rede (créditos na conta)",
      "🏦 Existem financiamentos com juros reduzidos para energia solar"
    ]
  },
  {
    id: 8,
    categoria: "energia",
    emoji: "💡",
    titulo: "Como reduzir o consumo de energia em casa",
    resumo: "Economizar energia elétrica é bom para o bolso e para o planeta. Veja dicas práticas para cada cômodo.",
    leitura: "3 min",
    dicas: [
      "💡 Troque lâmpadas incandescentes por LED (80% menos energia)",
      "🌡️ Ar-condicionado em 23°C consome 30% menos que em 20°C",
      "🔌 Desative o modo standby de TVs, computadores e carregadores",
      "🧺 Lave roupas com água fria e em cargas completas",
      "❄️ Geladeira longe do fogão e com borracha bem vedada consome menos",
      "🪟 Aproveite luz natural — abra as cortinas durante o dia"
    ]
  },
  {
    id: 9,
    categoria: "biodiversidade",
    emoji: "🌿",
    titulo: "Por que a biodiversidade é vital para todos nós",
    resumo: "A diversidade de espécies não é apenas bonita — ela sustenta a produção de alimentos, água limpa e ar respirável.",
    leitura: "4 min",
    dicas: [
      "🐝 1/3 dos alimentos que comemos depende de polinizadores como abelhas",
      "🌳 Florestas regulam o ciclo da água e previnem secas",
      "🐟 Oceanos saudáveis absorvem 30% do CO₂ emitido",
      "🌾 Monoculturas são vulneráveis — diversidade garante segurança alimentar",
      "🦜 Extinção de uma espécie pode colapsar toda uma cadeia alimentar",
      "🏡 Jardins com plantas nativas atraem polinizadores e contribuem localmente"
    ]
  },
  {
    id: 10,
    categoria: "biodiversidade",
    emoji: "🌊",
    titulo: "Oceanos em perigo: o que está acontecendo",
    resumo: "Poluição por plástico, acidificação e sobrepesca ameaçam os oceanos — que cobrem 71% do planeta.",
    leitura: "5 min",
    dicas: [
      "🪸 50% dos recifes de coral do mundo já foram perdidos",
      "🐢 8 milhões de toneladas de plástico entram nos oceanos todo ano",
      "🎣 90% dos estoques pesqueiros estão no limite ou sobreexplotados",
      "🧪 Microplásticos já foram encontrados no sangue humano",
      "🌡️ Acidificação dos oceanos ameaça crustáceos e coral",
      "♻️ Evitar plástico descartável é a ação individual mais impactante"
    ]
  }
];

// ==============================
// Renderiza os cards de educação
// ==============================

function renderizarEducacao(categoriaFiltro) {
  const grid = document.getElementById("educacaoGrid");
  if (!grid) return;

  const filtrados = categoriaFiltro === "todos"
    ? artigos
    : artigos.filter(a => a.categoria === categoriaFiltro);

  grid.innerHTML = filtrados.map(artigo => `
    <div class="educacao-card" onclick="abrirArtigo(${artigo.id})">
      <div class="educacao-card-emoji">${artigo.emoji}</div>
      <div class="educacao-card-categoria categoria-${artigo.categoria}">${traduzirCategoria(artigo.categoria)}</div>
      <h3 class="educacao-card-titulo">${artigo.titulo}</h3>
      <p class="educacao-card-resumo">${artigo.resumo}</p>
      <div class="educacao-card-footer">
        <span class="educacao-leitura">⏱ ${artigo.leitura} de leitura</span>
        <span class="educacao-ver-mais">Ver dicas →</span>
      </div>
    </div>
  `).join("");
}

// ==============================
// Filtro de categoria
// ==============================

function filtrarCategoria(categoria, btn) {
  document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("ativo"));
  btn.classList.add("ativo");
  renderizarEducacao(categoria);
}

// ==============================
// Abre modal com dicas do artigo
// ==============================

function abrirArtigo(id) {
  const artigo = artigos.find(a => a.id === id);
  if (!artigo) return;

  // Remove modal anterior se existir
  const anterior = document.getElementById("educacaoModal");
  if (anterior) anterior.remove();

  const modal = document.createElement("div");
  modal.id = "educacaoModal";
  modal.className = "educacao-modal-overlay";
  modal.innerHTML = `
    <div class="educacao-modal">
      <button class="modal-fechar" onclick="fecharModal()">✕</button>
      <div class="modal-emoji">${artigo.emoji}</div>
      <h2 class="modal-titulo">${artigo.titulo}</h2>
      <p class="modal-resumo">${artigo.resumo}</p>
      <div class="modal-dicas-titulo">📌 Dicas e fatos:</div>
      <ul class="modal-dicas">
        ${artigo.dicas.map(d => `<li>${d}</li>`).join("")}
      </ul>
      <div class="modal-footer">
        <span class="educacao-leitura">⏱ ${artigo.leitura} de leitura</span>
      </div>
    </div>
  `;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("visivel"), 10);
}

function fecharModal() {
  const modal = document.getElementById("educacaoModal");
  if (modal) {
    modal.classList.remove("visivel");
    setTimeout(() => modal.remove(), 300);
  }
}

// ==============================
// Utilitário
// ==============================

function traduzirCategoria(cat) {
  const map = {
    reciclagem: "♻️ Reciclagem",
    clima: "🌡️ Clima",
    consumo: "🛒 Consumo",
    energia: "⚡ Energia",
    biodiversidade: "🌿 Biodiversidade",
  };
  return map[cat] || cat;
}

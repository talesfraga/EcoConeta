// ==============================
// ECOMAPA - Mapa de Pontos de Reciclagem em Sorocaba
// ==============================

const SOROCABA_CENTER = [-23.5015, -47.4526];

// Pontos de fallback caso o Supabase ainda nao esteja populado.
let pontosReciclagem = [
  {
    nome: "Ecoponto Vila Helena",
    tipo: "ecoponto",
    lat: -23.47699,
    lng: -47.49332,
    endereco: "Rua Roque Sampaio, 100 - Vila Helena, Sorocaba/SP",
    horario: "Segunda a sexta, 7h as 17h; sabado, 7h as 12h",
    materiais: ["Entulho ate 1m3", "Madeira", "Moveis", "Reciclaveis", "Eletronicos"],
  },
  {
    nome: "Ecoponto Cajuru",
    tipo: "ecoponto",
    lat: -23.39753,
    lng: -47.38012,
    endereco: "Rua Mario Monteiro de Carvalho, s/n - Cajuru do Sul, Sorocaba/SP",
    horario: "Segunda a sexta, 7h as 17h; sabado, 7h as 12h",
    materiais: ["Entulho ate 1m3", "Madeira", "Moveis", "Reciclaveis", "Eletronicos"],
  },
  {
    nome: "Ecoponto Julio de Mesquita Filho",
    tipo: "ecoponto",
    lat: -23.4747,
    lng: -47.4698,
    endereco: "Av. Domingos Martins Vieira, 100 - Julio de Mesquita Filho, Sorocaba/SP",
    horario: "Segunda a sexta, 7h as 17h; sabado, 7h as 12h",
    materiais: ["Entulho ate 1m3", "Madeira", "Moveis", "Reciclaveis", "Eletronicos"],
  },
  {
    nome: "Ecoponto Vila Hortencia",
    tipo: "ecoponto",
    lat: -23.5068,
    lng: -47.4316,
    endereco: "Rua Lourenco Molineiro, 200 - Vila Hortencia, Sorocaba/SP",
    horario: "Segunda a sexta, 7h as 17h; sabado, 7h as 12h",
    materiais: ["Entulho ate 1m3", "Madeira", "Moveis", "Reciclaveis", "Eletronicos"],
  },
  {
    nome: "Ecoponto Brigadeiro Tobias",
    tipo: "ecoponto",
    lat: -23.5491,
    lng: -47.3543,
    endereco: "Rua Jose Sarti, 636 - Brigadeiro Tobias, Sorocaba/SP",
    horario: "Segunda a sexta, 7h as 17h; sabado, 7h as 12h",
    materiais: ["Entulho ate 1m3", "Madeira", "Moveis", "Reciclaveis", "Eletronicos"],
  },
  {
    nome: "Ecoponto Aparecidinha",
    tipo: "ecoponto",
    lat: -23.4305,
    lng: -47.3739,
    endereco: "Rua Luiz Alberto Mitidieri com Estrada do Barreiro - Aparecidinha, Sorocaba/SP",
    horario: "Segunda a sexta, 7h as 17h; sabado, 7h as 12h",
    materiais: ["Entulho ate 1m3", "Madeira", "Moveis", "Reciclaveis", "Eletronicos"],
  },
  {
    nome: "CORESO",
    tipo: "cooperativa",
    lat: -23.5006,
    lng: -47.4692,
    endereco: "Rua Jose Henrique Dias, 215 - Sorocaba/SP",
    horario: "Consulte antes de levar materiais",
    materiais: ["Papel", "Papelao", "Plastico", "Metal", "Oleo de cozinha", "Eletroeletronicos"],
  },
];

let mapa = null;
let pontosCarregados = false;

async function inicializarMapa() {
  if (mapa) return;

  await carregarPontosColeta();

  mapa = L.map("mapa").setView(SOROCABA_CENTER, 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(mapa);

  adicionarPontosAoMapa();
  adicionarControleLocalizacao();
}

async function carregarPontosColeta() {
  if (pontosCarregados || typeof supabaseClient === "undefined") return;

  const { data, error } = await supabaseClient
    .from("pontos_coleta")
    .select("nome, tipo, lat, lng, endereco, horario, materiais")
    .order("nome", { ascending: true });

  if (!error && data && data.length > 0) {
    pontosReciclagem = data;
  }

  pontosCarregados = true;
}

function adicionarPontosAoMapa() {
  pontosReciclagem.forEach((ponto) => {
    L.marker([ponto.lat, ponto.lng], { icon: criarIcone(ponto.tipo) })
      .addTo(mapa)
      .bindPopup(criarPopupConteudo(ponto));
  });
}

function criarIcone(tipo) {
  const cores = {
    reciclagem: "#4CAF50",
    ecoponto: "#2196F3",
    cooperativa: "#FF9800",
  };

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${cores[tipo] || cores.reciclagem}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function criarPopupConteudo(ponto) {
  return `
    <div class="mapa-popup">
      <h4>${ponto.nome}</h4>
      <p><strong>Endereco:</strong> ${ponto.endereco}</p>
      <p><strong>Horario:</strong> ${ponto.horario || "Consulte antes de ir"}</p>
      <p><strong>Materiais aceitos:</strong></p>
      <ul>
        ${(ponto.materiais || []).map((mat) => `<li>${mat}</li>`).join("")}
      </ul>
      <button onclick="abrirNoMaps(${ponto.lat}, ${ponto.lng})">Ver no Google Maps</button>
    </div>
  `;
}

function adicionarControleLocalizacao() {
  if (!L.control.locate) return;

  L.control.locate({
    position: "topright",
    strings: {
      title: "Mostrar minha localizacao",
    },
    locateOptions: {
      enableHighAccuracy: true,
    },
  }).addTo(mapa);
}

function abrirNoMaps(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
}

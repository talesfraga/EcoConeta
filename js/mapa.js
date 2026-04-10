// ==============================
// 🗺️ ECOMAPA — Mapa de Pontos de Reciclagem
// ==============================

// Pontos de exemplo (substitua por dados reais do Supabase)
const pontosReciclagem = [
  {
    nome: "Ecoponto Centro",
    tipo: "ecoponto",
    lat: -23.550520,
    lng: -46.633308,
    endereco: "Av. Paulista, 1000 - São Paulo, SP",
    horario: "24h",
    materiais: ["Papel", "Plástico", "Metal", "Vidro"]
  },
  {
    nome: "Cooperativa Verde",
    tipo: "cooperativa",
    lat: -23.561684,
    lng: -46.625758,
    endereco: "Rua da Consolação, 500 - São Paulo, SP",
    horario: "08h às 18h",
    materiais: ["Eletrônicos", "Pilhas", "Óleo de cozinha"]
  },
  {
    nome: "Ponto de Reciclagem Vila Madalena",
    tipo: "reciclagem",
    lat: -23.546389,
    lng: -46.691111,
    endereco: "Rua Aspicuelta, 300 - São Paulo, SP",
    horario: "07h às 19h",
    materiais: ["Papel", "Plástico", "Orgânicos"]
  }
];

let mapa = null;

function inicializarMapa() {
  if (mapa) return; // Já inicializado

  // Cria o mapa centrado em São Paulo
  mapa = L.map('mapa').setView([-23.550520, -46.633308], 12);

  // Adiciona tiles do OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(mapa);

  // Adiciona pontos ao mapa
  adicionarPontosAoMapa();

  // Adiciona controle de localização do usuário
  adicionarControleLocalizacao();
}

function adicionarPontosAoMapa() {
  pontosReciclagem.forEach(ponto => {
    const icone = criarIcone(ponto.tipo);

    const marker = L.marker([ponto.lat, ponto.lng], { icon: icone })
      .addTo(mapa)
      .bindPopup(criarPopupConteudo(ponto));
  });
}

function criarIcone(tipo) {
  const cores = {
    reciclagem: '#4CAF50',
    ecoponto: '#2196F3',
    cooperativa: '#FF9800'
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${cores[tipo]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

function criarPopupConteudo(ponto) {
  return `
    <div class="mapa-popup">
      <h4>${ponto.nome}</h4>
      <p><strong>Endereço:</strong> ${ponto.endereco}</p>
      <p><strong>Horário:</strong> ${ponto.horario}</p>
      <p><strong>Materiais aceitos:</strong></p>
      <ul>
        ${ponto.materiais.map(mat => `<li>${mat}</li>`).join('')}
      </ul>
      <button onclick="abrirNoMaps(${ponto.lat}, ${ponto.lng})">Ver no Google Maps</button>
    </div>
  `;
}

function adicionarControleLocalizacao() {
  L.control.locate({
    position: 'topright',
    strings: {
      title: "Mostrar minha localização"
    },
    locateOptions: {
      enableHighAccuracy: true
    }
  }).addTo(mapa);
}

function abrirNoMaps(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, '_blank');
}

// Inicializa o mapa quando a seção for mostrada
function mostrarSecao(secao) {
  document.querySelectorAll('[id^="secao-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById('secao-' + secao).classList.remove('hidden');

  if (secao === 'mapa') {
    // Pequeno delay para garantir que o container esteja visível
    setTimeout(() => {
      inicializarMapa();
      mapa.invalidateSize(); // Recalcula o tamanho do mapa
    }, 100);
  }

  if (secao === 'denuncia') carregarDenuncias();
  if (secao === 'educacao') renderizarEducacao('todos');
}
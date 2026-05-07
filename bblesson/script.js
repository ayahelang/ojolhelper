const data = [
  {
    q: "Pintu keluar tol menuju Bandara Soekarno Hatta",
    a: "Keluar Tol Bandara Soekarno-Hatta (Tol Prof. Dr. Sedyatmo)",
    map: "https://maps.google.com/?q=Bandara+Soekarno+Hatta"
  },
  {
    q: "Pintu keluar tol menuju Bandara Halim Perdana Kusuma",
    a: "Gerbang Tol Halim Utama",
    map: "https://maps.google.com/?q=Bandara+Halim+Perdanakusuma"
  },
  {
    q: "Tempat wisata terkenal sekitar Stasiun Gambir",
    a: "Monas, Masjid Istiqlal, Gereja Katedral",
    map: "https://maps.google.com/?q=Monas+Jakarta"
  },
  {
    q: "Stasiun Pasar Senen masuk wilayah mana",
    a: "Jakarta Pusat",
    map: "https://maps.google.com/?q=Stasiun+Pasar+Senen"
  },
  {
    q: "Pintu masuk ke KCIC Halim",
    a: "Jalan DI Panjaitan dan kawasan Halim Perdanakusuma",
    map: "https://maps.google.com/?q=KCIC+Halim"
  },
  {
    q: "Jalan menuju RSCM dari Rawamangun",
    a: "Jalan Pramuka → Salemba Raya atau Ahmad Yani → Diponegoro",
    map: "https://maps.google.com/?q=RSCM+Jakarta"
  },
  {
    q: "Rumah Sakit Jantung Harapan Kita terletak di jalan apa",
    a: "Jalan Letjen S. Parman",
    map: "https://maps.google.com/?q=RS+Harapan+Kita"
  },
  {
    q: "Landmark di depan Hotel Grand Hyatt",
    a: "Bundaran HI",
    map: "https://maps.google.com/?q=Bundaran+HI"
  },
  {
    q: "The Ritz-Carlton berada di kawasan apa",
    a: "Mega Kuningan",
    map: "https://maps.google.com/?q=Ritz+Carlton+Mega+Kuningan"
  },
  {
    q: "Jalan masuk menuju Mercure Gatot Subroto",
    a: "Jalan Gatot Subroto",
    map: "https://maps.google.com/?q=Mercure+Jakarta+Gatot+Subroto"
  },
  {
    q: "Hotel Shangri-La terletak di jalan apa",
    a: "Jalan Jenderal Sudirman",
    map: "https://maps.google.com/?q=Shangri+La+Jakarta"
  },
  {
    q: "Jalan penghubung Mall Kota Kasablanka ke Kuningan",
    a: "Jalan Casablanca",
    map: "https://maps.google.com/?q=Kota+Kasablanka"
  },
  {
    q: "Gedung perkantoran bagian dari Senayan City",
    a: "Panin Tower",
    map: "https://maps.google.com/?q=Panin+Tower"
  },
  {
    q: "Hotel bintang lima di Pacific Place",
    a: "The Ritz-Carlton Jakarta, Pacific Place",
    map: "https://maps.google.com/?q=Pacific+Place+Jakarta"
  },
  {
    q: "Mall di kawasan Pondok Indah",
    a: "Pondok Indah Mall 1, 2, dan 3",
    map: "https://maps.google.com/?q=Pondok+Indah+Mall"
  },
  {
    q: "Tempat perbelanjaan di sekitar Blok M",
    a: "Blok M Plaza, Blok M Square, Plaza Blok M",
    map: "https://maps.google.com/?q=Blok+M+Jakarta"
  },
  {
    q: "Jalan masuk menuju SCBD",
    a: "Jalan Jenderal Sudirman dan Jalan Senopati",
    map: "https://maps.google.com/?q=SCBD+Jakarta"
  },
  {
    q: "Hotel bintang lima di Grand Indonesia",
    a: "Hotel Indonesia Kempinski Jakarta",
    map: "https://maps.google.com/?q=Grand+Indonesia"
  },
  {
    q: "Stasiun KRL terdekat dari JIExpo Kemayoran",
    a: "Stasiun Rajawali",
    map: "https://maps.google.com/?q=JIExpo+Kemayoran"
  },
  {
    q: "Pusat perbelanjaan utama di Pantai Indah Kapuk",
    a: "PIK Avenue",
    map: "https://maps.google.com/?q=PIK+Avenue"
  }
];

const container = document.getElementById("qaContainer");
const searchInput = document.getElementById("searchInput");

function renderData(items) {
  container.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="question">Q: ${item.q}</div>
      <div class="answer">A: ${item.a}</div>
      <a class="map-link" href="${item.map}" target="_blank">Buka Google Maps</a>
    `;

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  const filtered = data.filter(item =>
    item.q.toLowerCase().includes(keyword) ||
    item.a.toLowerCase().includes(keyword)
  );

  renderData(filtered);
});

renderData(data);

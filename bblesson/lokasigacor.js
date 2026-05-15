/* =========================================
DATABASE FILES
========================================= */

const databaseFiles = [

  "../assets/data/depok.json",
  "../assets/data/jaksel.json",
  "../assets/data/jaktim.json",
  "../assets/data/jakbar.json",
  "../assets/data/jakpus.json",
  "../assets/data/jakut.json",
  "../assets/data/bekasi.json",
  "../assets/data/bogor.json",
  "../assets/data/tangerang.json"

];

let masterData = [];

/* =========================================
LOAD ALL DATABASES
========================================= */

async function loadAllData() {

  try {

    const promises =
      databaseFiles.map(
        file =>
          fetch(file)
            .then(res => res.json())
            .catch(() => [])
      );

    const results =
      await Promise.all(promises);

    masterData =
      results.flat();

    renderLocations(masterData);

  }

  catch (err) {

    console.log(err);

    document.getElementById(
      "content"
    ).innerHTML = `

      <div class="loading">

        ❌ Gagal memuat database lokasi.

      </div>

    `;

  }

}

/* =========================================
RENDER LOCATIONS
========================================= */

function renderLocations(data) {

  const container =
    document.getElementById(
      "content"
    );

  if (!data.length) {

    container.innerHTML = `

      <div class="loading">
        Tidak ada data lokasi.
      </div>

    `;

    return;

  }

  const grouped = {};

  data.forEach(item => {

    if (!grouped[item.wilayah]) {

      grouped[item.wilayah] = [];

    }

    grouped[item.wilayah]
      .push(item);

  });

  let html = "";

  Object.keys(grouped)
    .sort()
    .forEach(region => {

      html += `

        <div class="region-title">
          ${region}
        </div>

        <div class="card-grid">

      `;

      grouped[region]
        .forEach(item => {

          html += `

           <div
  class="location-card"
  onclick='openGoogleMaps(
    ${item.latitude},
    ${item.longitude},
    ${JSON.stringify(item.nama)}
  )'
>

              <div class="location-name">
                ${item.nama}
              </div>

              <div class="meta">
                📍 ${item.alamat}
              </div>

              <div class="meta">
                🏷️ ${item.kategori}
              </div>

              <div class="meta">
                🌐 ${item.latitude},
                ${item.longitude}
              </div>

              <div class="badge">
                ${item.wilayah}
              </div>

            </div>

          `;

        });

      html += `
        </div>
      `;

    });

  container.innerHTML = html;

}

/* =========================================
SEARCH SYSTEM
========================================= */

document
  .getElementById(
    "searchInput"
  )

  .addEventListener(
    "input",

    function (e) {

      const keyword =
        e.target.value
          .toLowerCase();

      const filtered =
        masterData.filter(item => {

          return (

            item.nama
              .toLowerCase()
              .includes(keyword)

            ||

            item.wilayah
              .toLowerCase()
              .includes(keyword)

            ||

            item.kategori
              .toLowerCase()
              .includes(keyword)

            ||

            item.alamat
              .toLowerCase()
              .includes(keyword)

          );

        });

      renderLocations(filtered);

    }

  );

/* =========================================
START
========================================= */

loadAllData();

/* =========================================
OPEN GOOGLE MAPS
========================================= */

/* =========================================
OPEN GOOGLE MAPS
========================================= */

function openGoogleMaps(
  lat,
  lng,
  name
) {

  const url =
    `https://www.google.com/maps?q=${lat},${lng}`;

  /*
  OPEN NEW TAB
  TANPA POPUP BLOCKER
  */

  const link =
    document.createElement("a");

  link.href = url;

  link.target = "_blank";

  link.rel =
    "noopener noreferrer";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

}
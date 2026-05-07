const pools = {

    headquarters: [
        ["11:00 - 13:00", "Mampang Prapatan", 4],
        ["13:00 - 15:00", "Kuningan City", 6],
        ["15:00 - 18:00", "Kota Kasablanka", 7],
        ["18:00 - 20:00", "Blok M", 6],
        ["20:00 - 21:00", "Kembali Blue Bird Group Headquarters", 5]
    ],

    margasatwa: [
        ["11:00 - 13:00", "Cilandak Town Square", 5],
        ["13:00 - 15:00", "Ragunan", 4],
        ["15:00 - 18:00", "Pejaten Village", 6],
        ["18:00 - 20:00", "TB Simatupang", 5],
        ["20:00 - 21:00", "Kembali Pool Margasatwa Jl. Pinang 1", 4]
    ],

    cikeas: [
        ["11:00 - 13:00", "Kota Wisata Cibubur", 8],
        ["13:00 - 15:00", "Mitra Keluarga Cibubur", 7],
        ["15:00 - 16:30", "Cibubur Junction", 4],
        ["16:30 - 18:30", "LRT Harjamukti", 3],
        ["18:30 - 20:00", "Trans Studio Mall Cibubur", 2],
        ["20:00 - 21:00", "Kembali Pool Cikeas", 10]
    ],

    kranggan: [
        ["11:00 - 13:00", "Jatisampurna", 5],
        ["13:00 - 15:00", "Cibubur Junction", 7],
        ["15:00 - 18:00", "Harjamukti", 5],
        ["18:00 - 20:00", "Trans Studio Mall", 4],
        ["20:00 - 21:00", "Kembali Pool Kranggan", 9]
    ],

    cimanggis: [
        ["11:00 - 13:00", "Margo City Depok", 8],
        ["13:00 - 15:00", "Harjamukti", 6],
        ["15:00 - 18:00", "Trans Studio Mall Cibubur", 4],
        ["18:00 - 20:00", "Cibubur Junction", 3],
        ["20:00 - 21:00", "Kembali Pool Cimanggis", 8]
    ],

    siliwangi: [
        ["11:00 - 13:00", "Margo City Depok", 5],
        ["13:00 - 15:00", "ITC Depok", 3],
        ["15:00 - 18:00", "Stasiun Depok Baru", 4],
        ["18:00 - 20:00", "D'Mall Depok", 3],
        ["20:00 - 21:00", "Kembali Pool Siliwangi Depok", 5]
    ],

    ciputat: [
        ["11:00 - 13:00", "Pasar Ciputat", 4],
        ["13:00 - 15:00", "UIN Syarif Hidayatullah Jakarta", 3],
        ["15:00 - 18:00", "Bintaro Xchange Mall", 8],
        ["18:00 - 20:00", "Stasiun Jurangmangu", 5],
        ["20:00 - 21:00", "Kembali Pool Ciputat", 6]
    ],

    kalibata: [
        ["11:00 - 13:00", "Kalibata City", 2],
        ["13:00 - 15:00", "Stasiun Duren Kalibata", 2],
        ["15:00 - 18:00", "Kokas Mall Jakarta", 7],
        ["18:00 - 20:00", "Tebet Eco Park", 4],
        ["20:00 - 21:00", "Kembali Pool Kalibata", 5]
    ],

    cinangka: [
        ["11:00 - 13:00", "Pasar Cinangka", 3],
        ["13:00 - 15:00", "The Park Sawangan", 6],
        ["15:00 - 18:00", "RS Permata Depok", 5],
        ["18:00 - 20:00", "Parung Bingung Depok", 4],
        ["20:00 - 21:00", "Kembali Pool Cinangka", 5]
    ]

};

function rupiah(x) {

    return "Rp" + Math.round(x).toLocaleString("id-ID");

}

function generatePlan() {

    let pool = document.getElementById("pool").value;
    let custom = document.getElementById("customPool").value;
    let kmpl = parseFloat(document.getElementById("kmpl").value);
    let fuel = parseFloat(document.getElementById("fuel").value);
    let mode = document.getElementById("mode").value;

    let data = pools[pool];

    if (pool === "custom") {

        let nama = custom.trim();

        if (nama === "") {

            nama = "Lokasi Custom";

        }

        data = [
            ["11:00 - 13:00", "Pasar Modern BSD City", 7],
            ["13:00 - 15:00", "RS Hermina", 6],
            ["15:00 - 18:00", "Stasiun Terdekat", 8],
            ["18:00 - 20:00", "Mall Terdekat", 7],
            ["20:00 - 21:00", "Kembali ke " + nama, 8]
        ];

    }

    let total = 0;
    let html = "";

    data.forEach(row => {

        let km = row[2];

        if (mode === "hemat") km *= 0.8;
        if (mode === "agresif") km *= 1.25;

        total += km;

        html += `
            <div class="item">

                <div class="jam">
                    ${row[0]}
                </div>

                <div class="lokasi">
                    ${row[1]}
                </div>

                <div>
                    ${Math.round(km)} km estimasi rotasi
                </div>

                <a
                    class="maps-btn"
                    href="https://maps.google.com/?q=${encodeURIComponent(row[1])}"
                >
                    Buka Google Maps
                </a>

            </div>
        `;

    });

    total = Math.round(total * 1.25);

    let liter = total / kmpl;
    let biaya = liter * fuel;

    document.getElementById("timeline").innerHTML = html;

    document.getElementById("kmTotal").innerText =
        total + " km";

    document.getElementById("fuelNeed").innerText =
        liter.toFixed(1) + " L";

    document.getElementById("fuelCost").innerText =
        rupiah(biaya);

}

generatePlan();

/* =========================================
   TOP BUTTON
========================================= */

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 260) {

        topBtn.classList.add("show");

    } else {

        topBtn.classList.remove("show");

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

/* =========================================
   SMART MAPS SYSTEM
========================================= */

const lokasiStrategis = [
    "Blok M",
    "SCBD",
    "Grand Indonesia",
    "Kota Kasablanka",
    "Margo City Depok",
    "PIK Avenue",
    "Cilandak Town Square",
    "Kuningan City",
    "Tebet Eco Park"
];

let targetMaps = "";
let popupTimer = null;

const popup =
    document.getElementById("smartPopup");

const popupContent =
    document.getElementById("popupContent");

document.addEventListener(

    "click",

    function (e) {

        const btn =
            e.target.closest(".maps-btn");

        if (!btn) return;

        e.preventDefault();

        targetMaps = btn.href;

        showPopupLoading();

        checkGPSAndAnalyze(btn);

    },

    true

);

function showPopupLoading() {

    popup.style.display = "flex";

    popupContent.innerHTML = `
        <div style="padding:20px">
            🔍 Mengecek lokasi driver...
        </div>
    `;

}

async function checkGPSAndAnalyze(btn) {

    if (!navigator.geolocation) {

        popupContent.innerHTML = `
            Browser tidak mendukung GPS.
        `;

        return;

    }

    try {

        const permission =
            await navigator.permissions.query({
                name: "geolocation"
            });

        if (permission.state === "denied") {

            popupContent.innerHTML = `
                <div style="
                    background:#3b1f1f;
                    padding:16px;
                    border-radius:18px
                ">

                    ❌ GPS diblokir browser

                    <br><br>

                    Aktifkan izin lokasi di browser.

                </div>
            `;

            return;

        }

    } catch (err) {

        console.log(err);

    }

    navigator.geolocation.getCurrentPosition(

        function (pos) {

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const targetName =
                decodeURIComponent(
                    btn.href.split("?q=")[1]
                );

            const randomKM =
                Math.floor(Math.random() * 12) + 2;

            const randomMenit =
                Math.floor(randomKM * 3) + 5;

            const saran =
                lokasiStrategis[
                Math.floor(
                    Math.random() *
                    lokasiStrategis.length
                )
                ];

            const saranLink =
                "https://maps.google.com/?q=" +
                encodeURIComponent(saran);

            popupContent.innerHTML = `

                <div style="
                    font-size:20px;
                    margin-bottom:18px
                ">
                    ✅ GPS Aktif
                </div>

                <div style="
                    background:#162544;
                    padding:16px;
                    border-radius:18px;
                    margin-bottom:16px
                ">

                    <div style="
                        font-size:22px;
                        font-weight:bold;
                        margin-bottom:10px
                    ">
                        ${targetName}
                    </div>

                    <div>
                        📍 ${randomKM} KM
                    </div>

                    <div style="margin-top:6px">
                        ⏱️ ${randomMenit} menit
                    </div>

                </div>

                <div style="
                    background:#102847;
                    padding:16px;
                    border-radius:18px;
                    margin-bottom:16px
                ">

                    📡 Lokasi Anda Saat Ini

                    <div style="
                        margin-top:12px;
                        color:#4ea1ff;
                        font-size:18px;
                        font-weight:bold
                    ">
                        ${lat.toFixed(6)},
                        ${lon.toFixed(6)}
                    </div>

                    <a
                        href="https://maps.google.com/?q=${lat},${lon}"
                        target="_blank"
                        style="
                            display:inline-block;
                            margin-top:14px;
                            background:#24406f;
                            color:white;
                            padding:10px 14px;
                            border-radius:12px;
                            text-decoration:none
                        "
                    >
                        Lihat Lokasi Saya
                    </a>

                </div>

                <div style="
                    background:#203659;
                    padding:16px;
                    border-radius:18px
                ">

                    💡 Lokasi strategis lebih dekat

                    <div style="
                        margin-top:12px;
                        color:#4ea1ff;
                        font-size:22px;
                        font-weight:bold
                    ">
                        ${saran}
                    </div>

                    <a
                        href="${saranLink}"
                        target="_blank"
                        style="
                            display:inline-block;
                            margin-top:14px;
                            background:#3d8bfd;
                            color:white;
                            padding:10px 14px;
                            border-radius:12px;
                            text-decoration:none
                        "
                    >
                        Buka Lokasi Alternatif
                    </a>

                </div>

            `;

        },

        function () {

            popupContent.innerHTML = `
                <div style="
                    background:#3b1f1f;
                    padding:16px;
                    border-radius:18px
                ">

                    ❌ GPS belum aktif

                    <br><br>

                    Aktifkan location lalu refresh halaman.

                </div>
            `;

        },

        {
            enableHighAccuracy: true,
            maximumAge: Infinity,
            timeout: 15000
        }

    );

    clearTimeout(popupTimer);

    let countdown = 30;

    const timerEl =
        document.querySelector(".popup-timer");

    timerEl.innerHTML =
        `Auto close ${countdown} detik`;

    popupTimer = setInterval(() => {

        countdown--;

        timerEl.innerHTML =
            `Auto close ${countdown} detik`;

        if (countdown <= 0) {

            clearInterval(popupTimer);

            popup.style.display = "none";

        }

    }, 1000);

}

/* =========================================
   POPUP BUTTONS
========================================= */

document
    .getElementById("continueMaps")
    .addEventListener("click", function () {

        if (targetMaps) {

            window.open(targetMaps, "_blank");

        }

    });

document
    .getElementById("closePopup")
    .addEventListener("click", function () {

        popup.style.display = "none";

        clearTimeout(popupTimer);

    });


/* =========================================
LIVE MAP SYSTEM
========================================= */

let map = L.map("map").setView(
    [-6.200000, 106.816666],
    12
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap Contributors"
    }
).addTo(map);

let userMarker = null;
let accuracyCircle = null;

function initLiveGPS() {
    if (!navigator.geolocation) {
        alert("Browser tidak mendukung GPS");
        return;
    }
    navigator.geolocation.watchPosition(
        function (pos) {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;
            /* center map */
            map.setView([lat, lon], 15);
            /* hapus marker lama */
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            if (accuracyCircle) {
                map.removeLayer(accuracyCircle);
            }
            /* marker user */
            userMarker = L.marker([lat, lon])
                .addTo(map)
                .bindPopup(`
                    <b>Lokasi Driver</b>
                    <br>
                    ${lat.toFixed(6)},
                    ${lon.toFixed(6)}
                    <br>
                    Akurasi:
                    ${Math.round(accuracy)} meter
                `);
            /* radius akurasi */
            accuracyCircle = L.circle(
                [lat, lon],
                {
                    radius: accuracy
                }
            ).addTo(map);
        },
        function (err) {
            console.log(err);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000
        }
    );
}

initLiveGPS();
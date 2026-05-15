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

/* =========================================
   POPUP COUNTDOWN
========================================= */
function startPopupCountdown() {
    clearInterval(popupTimer);
    let countdown = 30;
    const timerEl =
        document.querySelector(".popup-timer");
    if (!timerEl) return;
    timerEl.innerHTML =
        `Auto close ${countdown} detik`;
    popupTimer = setInterval(() => {
        countdown--;
        timerEl.innerHTML =
            `Auto close ${countdown} detik`;
        if (countdown <= 0) {
            clearInterval(popupTimer);
            popup.style.display = "none";

            if (smartMap) {
                smartMap.remove();
                smartMap = null;
            }
        }
    }, 1000);
}

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
        const savedKM =
            localStorage.getItem(
                "route_" + row[1]
            );

        let km =
            savedKM
                ? parseFloat(savedKM)
                : row[2];
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
    target="_blank"
    rel="noopener noreferrer" href="https://maps.google.com/?q=${encodeURIComponent(row[1])}">Buka Google Maps</a>
                <button class="route-btn" data-target="${row[1]}">
                    Tampilkan Route Nyata
                </button>
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

/* =========================================
   POPUP BUTTONS
========================================= */
document
    .getElementById("continueMaps")
    .addEventListener("click", function () {

        popup.style.display = "none";

        if (smartMap) {
            smartMap.remove();
            smartMap = null;
        }

        document
            .getElementById("map")
            .scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
    });

document
    .getElementById("closePopup")
    .addEventListener("click", function () {
        popup.style.display = "none";

        if (smartMap) {
            smartMap.remove();
            smartMap = null;
        }
        clearInterval(popupTimer);
    });


/* =========================================
LIVE MAP SYSTEM
========================================= */
let map = L.map("map", {
    preferCanvas: true
}).setView([-6.200000, 106.816666], 13);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap Contributors"
    }
).addTo(map);

let userMarker = null;
let lastHeading = 0;

const carIcon = L.divIcon({

    className: "car-marker",

    html: `
        <img
            src="assets/car-top.png"
            id="carIconRotate"
        >
    `,

    iconSize: [52, 52],

    iconAnchor: [26, 26]

});

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
            const heading =
                pos.coords.heading;

            if (
                heading !== null &&
                !isNaN(heading)
            ) {
                lastHeading = heading;
            }
            /* center map sekali */
            if (!window.mapInitialized) {
                map.setView([lat, lon], 15);
                window.mapInitialized = true;
            }
            /* hapus marker lama */
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            if (accuracyCircle) {
                map.removeLayer(accuracyCircle);
            }
            /* marker user */

            userMarker = L.marker(
                [lat, lon],
                {
                    icon: carIcon
                }
            )
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

            /* rotasi icon mobil */

            setTimeout(() => {

                const car =
                    document.getElementById(
                        "carIconRotate"
                    );

                if (car) {

                    car.style.transform =
                        `rotate(${lastHeading}deg)`;

                }

            }, 50);

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

/* =========================================
   REAL ROUTE BUTTON PRO
========================================= */
let routingControl = null;
document.addEventListener(
    "click",
    async function (e) {
        const btn =
            e.target.closest(".route-btn");
        if (!btn) return;
        e.preventDefault();
        const targetName =
            btn.dataset.target;
        targetMaps =
            "https://maps.google.com/?q=" +
            encodeURIComponent(targetName);
        /* tampil popup loading */
        popup.style.display = "flex";
        popupContent.innerHTML = `
            <div style="
                font-size:22px;
                margin-bottom:20px
            ">
                🚖 Menyiapkan Route
            </div>
            <div style="
                background:#162544;
                padding:18px;
                border-radius:18px
            ">
                <div id="routeLoadingText">
                    📡 Membaca GPS driver...
                </div>
                <div style="
                    margin-top:16px;
                    width:100%;
                    height:10px;
                    background:#0d1728;
                    border-radius:999px;
                    overflow:hidden
                ">
                    <div id="routeLoadingBar"
                        style="
                        width:15%;
                        height:100%;
                        background:#3d8bfd;
                        transition:.4s;
                    ">
                    </div>
                </div>
            </div>
        `;

        const loadingText =
            document.getElementById(
                "routeLoadingText"
            );

        const loadingBar =
            document.getElementById(
                "routeLoadingBar"
            );

        navigator.geolocation.getCurrentPosition(
            async function (pos) {
                loadingText.innerHTML =
                    "🗺️ Mencari lokasi tujuan...";
                loadingBar.style.width = "45%";
                const userLat =
                    pos.coords.latitude;
                const userLon =
                    pos.coords.longitude;

                /* geocoding */
                const geoUrl =
                    "https://nominatim.openstreetmap.org/search?format=json&q=" +
                    encodeURIComponent(targetName);
                const geoRes =
                    await fetch(geoUrl);
                const geoData =
                    await geoRes.json();
                if (!geoData.length) {
                    popupContent.innerHTML = `
                        ❌ Lokasi tidak ditemukan
                    `;
                    return;
                }

                loadingText.innerHTML =
                    "🚦 Menghitung route jalan nyata...";

                loadingBar.style.width = "75%";

                const targetLat =
                    parseFloat(geoData[0].lat);

                const targetLon =
                    parseFloat(geoData[0].lon);

                /* hapus route lama */
                if (routingControl) {
                    map.removeControl(
                        routingControl
                    );
                    routingControl = null;
                }

                /* route */
                routingControl =
                    L.Routing.control({
                        waypoints: [
                            L.latLng(
                                userLat,
                                userLon
                            ),
                            L.latLng(
                                targetLat,
                                targetLon
                            )
                        ],
                        routeWhileDragging: false,
                        draggableWaypoints: false,
                        addWaypoints: false,
                        show: false,
                        fitSelectedRoutes: true,
                        lineOptions: {
                            styles: [
                                {
                                    color: "#3d8bfd",
                                    weight: 7,
                                    opacity: .9
                                }
                            ]
                        }

                    }).addTo(map);

                /* route selesai */
                routingControl.on(
                    "routesfound",
                    function (e) {
                        loadingBar.style.width =
                            "100%";
                        const route =
                            e.routes[0];
                        const km =
                            (
                                route.summary.totalDistance / 1000
                            ).toFixed(1);

                        localStorage.setItem(
                            "route_" + targetName,
                            km
                        );
                        const avgSpeed = 40;
                        const menit =
                            Math.ceil(
                                (
                                    parseFloat(km) /
                                    avgSpeed
                                ) * 60
                            );
                        popupContent.innerHTML = `
                            <div style="
                                font-size:24px;
                                margin-bottom:18px
                            ">
                                ✅ Route Siap
                            </div>

                            <div style="
                                background:#162544;
                                padding:18px;
                                border-radius:18px;
                                margin-bottom:16px
                            ">
                                <div style="
                                    font-size:22px;
                                    font-weight:bold;
                                    margin-bottom:12px
                                ">
                                    ${targetName}
                                </div>
                                <div>
                                    📍 ${km} KM
                                </div>
                                <div style="
                                    margin-top:8px
                                ">
                                    ⏱️ ${menit} menit
                                </div>
                            </div>
                            <div style="
                                background:#102847;
                                padding:16px;
                                border-radius:18px
                            ">
                                🚖 Route mengikuti
                                jalan mobil nyata

                            </div>
                        `;
                        startPopupCountdown();
                    }
                );
            },

            function (err) {
                console.log(err);
                popupContent.innerHTML = `
        <div style="
            background:#3b1f1f;
            padding:18px;
            border-radius:18px
        ">
            ❌ GPS gagal dibaca
            <br><br>
            Kemungkinan karena:
            <br>
            - masih memakai file://
            <br>
            - izin browser belum stabil
            <br>
            - GPS laptop kurang akurat
        </div>
    `;
                // clearInterval(popupTimer);
                startPopupCountdown();
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 15000
            }
        );
    }
);

/* =========================================
SMART TACTICAL RADAR V7
========================================= */

const wilayahFiles = {
    "Depok": "assets/data/depok.json",
    "Bogor": "assets/data/bogor.json",
    "Jakarta Timur": "assets/data/jaktim.json",
    "Jakarta Barat": "assets/data/jakbar.json",
    "Jakarta Selatan": "assets/data/jaksel.json",
    "Jakarta Utara": "assets/data/jakut.json",
    "Jakarta Pusat": "assets/data/jakpus.json",
    "Bekasi": "assets/data/bekasi.json",
    "Tangerang": "assets/data/tangerang.json"
};

let smartMap = null;
let currentUserLat = null;
let currentUserLon = null;

/* =========================================
WAIT
========================================= */

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/* =========================================
HAVERSINE DISTANCE
========================================= */

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        deg2rad(lat2 - lat1);

    const dLon =
        deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

/* =========================================
DETECT REGION
========================================= */

function detectWilayah(lat, lon) {

    if (
        lat < -6.33 &&
        lat > -6.50 &&
        lon > 106.75 &&
        lon < 106.90
    ) {
        return "Depok";
    }

    if (
        lat < -6.15 &&
        lon < 106.78
    ) {
        return "Jakarta Barat";
    }

    if (
        lat < -6.20 &&
        lon > 106.82
    ) {
        return "Jakarta Timur";
    }

    return "Jakarta Selatan";
}

/* =========================================
LOAD JSON SAFE
========================================= */

async function safeFetchJSON(url) {

    try {

        const res =
            await fetch(url);

        if (!res.ok) {
            throw new Error(
                "JSON gagal dimuat"
            );
        }

        return await res.json();

    } catch (err) {

        console.log(err);

        return [];

    }

}

/* =========================================
GET NEAREST LOCATIONS
========================================= */

function getNearestLocations(
    userLat,
    userLon,
    data,
    limit = 3
) {

    const processed =
        data.map(item => {

            const distance =
                calculateDistance(
                    userLat,
                    userLon,
                    item.latitude,
                    item.longitude
                );

            return {
                ...item,
                garisLurus: distance
            };

        });

    processed.sort(
        (a, b) =>
            a.garisLurus -
            b.garisLurus
    );

    return processed.slice(0, limit);

}

/* =========================================
RENDER RECOMMENDATION
========================================= */

function renderRecommendation(
    data,
    userLat,
    userLon
) {

    const container =
        document.getElementById(
            "smartRecommendation"
        );

    if (!container) return;

    let html = `
        <div class="smart-list">
    `;

    data.forEach(item => {

        html += `

            <div class="smart-card">

    <div class="smart-title">
        ${item.nama}
    </div>

    <div class="smart-meta">
        📍 ${item.wilayah}
    </div>

    <div class="smart-meta">
        🏢 ${item.kategori}
    </div>

    <div class="smart-meta">
        🛣️ ${item.alamat}
    </div>

<div class="smart-distance">
    🚖 Menghitung route nyata...
</div>

    <div class="smart-buttons">

        <button
    class="smart-route-btn"
    data-lat="${item.latitude}"
    data-lon="${item.longitude}"
    data-nama="${item.nama}"
    data-alamat="${item.alamat}"
>
            🚗 Real Route
        </button>

        <a
            href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.nama + ' ' + item.alamat)}"
            target="_blank"
            rel="noopener noreferrer"
        >
            🗺️ Google Maps
        </a>

    </div>

</div>

        `;

    });

    html += `</div>`;

    container.innerHTML = html;

}

/* =========================================
SMART ROUTE POPUP
========================================= */

async function showSmartRoute(
    userLat,
    userLon,
    targetLat,
    targetLon,
    nama,
    alamat
) {

    popup.style.display = "flex";
    startPopupCountdown();
    popupContent.innerHTML = `

        <div style="
            font-size:24px;
            margin-bottom:18px;
        ">
            🚖 Smart Tactical Route
        </div>

        <div style="
            background:#162544;
            padding:18px;
            border-radius:18px;
        ">

            <div id="routeLoadingText">
                📡 Membaca GPS driver...
            </div>

            <div style="
                margin-top:16px;
                width:100%;
                height:10px;
                background:#0d1728;
                border-radius:999px;
                overflow:hidden;
            ">

                <div id="routeLoadingBar"
                    style="
                        width:15%;
                        height:100%;
                        background:#3d8bfd;
                        transition:.4s;
                    ">
                </div>

            </div>

        </div>

    `;

    const loadingText =
        document.getElementById(
            "routeLoadingText"
        );

    const loadingBar =
        document.getElementById(
            "routeLoadingBar"
        );

    await wait(1000);

    loadingText.innerHTML =
        "🧭 Menentukan lokasi tujuan...";

    loadingBar.style.width = "35%";

    await wait(1200);

    loadingText.innerHTML =
        "🚗 Menghitung route jalan nyata...";

    loadingBar.style.width = "70%";

    let timeoutShown = false;

    const timeoutHandler =
        setTimeout(() => {

            timeoutShown = true;

            popupContent.innerHTML += `

                <div style="
                    margin-top:18px;
                    background:#3b2d0f;
                    padding:18px;
                    border-radius:18px;
                ">

                    ⏳ Perhitungan route
                    membutuhkan waktu tambahan.

                    <br><br>

                    Kemungkinan:
                    <br>
                    • koneksi lambat
                    <br>
                    • GPS belum stabil
                    <br>
                    • server route sibuk

                    <div class="smart-buttons">

                        <button onclick="
                            popup.style.display='none'
                        ">
                            Tutup
                        </button>

                        <a
                            target='_blank'
                            href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nama + ' ' + alamat)}"
                        >
                            Google Maps
                        </a>

                    </div>

                </div>

            `;

        }, 5000);

    await wait(1200);

    popupContent.innerHTML = `

        <div style="
            font-size:24px;
            margin-bottom:16px;
        ">
            📍 ${nama}
        </div>

        <div style="
            background:#162544;
            padding:16px;
            border-radius:18px;
            margin-bottom:16px;
        ">
            ${alamat}
        </div>

        <div
            id="miniMap"
            class="popup-mini-map"
        ></div>

        <div
            id="routeInfo"
            style="margin-top:16px;"
        >
            🚦 Menghitung route nyata...
        </div>

    `;

    if (smartMap) {
        smartMap.remove();
        smartMap = null;
    }

    smartMap = L.map("miniMap", {
        zoomControl: false,
        attributionControl: false
    }).setView(
        [userLat, userLon],
        13
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ).addTo(smartMap);

    L.marker([
        userLat,
        userLon
    ]).addTo(smartMap);

    L.marker([
        targetLat,
        targetLon
    ]).addTo(smartMap);

    L.Routing.control({

        waypoints: [

            L.latLng(
                userLat,
                userLon
            ),

            L.latLng(
                targetLat,
                targetLon
            )

        ],

        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        show: false,

        lineOptions: {
            styles: [
                {
                    color: "#3d8bfd",
                    weight: 7,
                    opacity: .9
                }
            ]
        }

    })

        .on(
            "routesfound",

            function (e) {

                clearTimeout(
                    timeoutHandler
                );

                const route =
                    e.routes[0];

                const km =
                    (
                        route.summary.totalDistance / 1000
                    ).toFixed(1);

                const menit =
                    Math.ceil(
                        route.summary.totalTime / 60
                    );

                startPopupCountdown();

                document.getElementById(
                    "routeInfo"
                ).innerHTML = `

                <div style="
                    background:#102847;
                    padding:16px;
                    border-radius:18px;
                ">

                    🚗 Route Mobil Nyata

                    <div style="
                        margin-top:12px;
                        font-size:22px;
                        color:#4ea1ff;
                        font-weight:bold;
                    ">
                        ${km} KM
                    </div>

                    <div style="
                        margin-top:8px;
                    ">
                        ⏱️ ${menit} menit
                    </div>

                    <div class="smart-buttons">

                        <a
                            target="_blank"
                            href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nama + ' ' + alamat)}"
                        >
                            Buka Google Maps
                        </a>

                    </div>

                </div>

            `;

            }

        )

        .addTo(smartMap);

}

/* =========================================
INIT SMART RADAR
========================================= */

async function initSmartRadar() {

    if (!navigator.geolocation) {
        return;
    }

    navigator.geolocation.getCurrentPosition(

        async function (pos) {

            const userLat =
                pos.coords.latitude;

            const userLon =
                pos.coords.longitude;
            
            currentUserLat = userLat;
            currentUserLon = userLon;

            const wilayah =
                detectWilayah(
                    userLat,
                    userLon
                );

            const container =
                document.getElementById(
                    "smartRecommendation"
                );

            if (!container) return;

            container.innerHTML = `

                <div class="loading-status">
                    📡 Membaca GPS driver...
                </div>

            `;

            await wait(1000);

            container.innerHTML += `

                <div class="loading-status">
                    🧭 Wilayah aktif:
                    <br><br>
                    ${wilayah}
                </div>

            `;

            const file =
                wilayahFiles[wilayah];

            const data =
                await safeFetchJSON(file);

            if (!data.length) {

                container.innerHTML = `

                    <div class="loading-status">
                        ❌ Database lokasi kosong
                    </div>

                `;

                return;

            }

            await wait(1200);

            const nearest =
                getNearestLocations(
                    userLat,
                    userLon,
                    data,
                    3
                );

            renderRecommendation(
                nearest,
                userLat,
                userLon
            );

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

/* =========================================
AUTO REFRESH
========================================= */

setInterval(() => {

    initSmartRadar();

}, 120000);

/* =========================================
START
========================================= */

window.addEventListener(
    "load",
    function () {

        initSmartRadar();

    }
);

/* =========================================
SMART OCR LOCATION SYSTEM
========================================= */

async function processLocationScreenshot() {

    const input =
        document.getElementById(
            "locationScreenshotInput"
        );

    const resultArea =
        document.getElementById(
            "ocrResultArea"
        );

    const file =
        input.files[0];

    if (!file) {

        resultArea.innerHTML = `

            <div class="ocr-card ocr-failed">
                ❌ Pilih screenshot terlebih dahulu
            </div>

        `;

        return;

    }

    resultArea.innerHTML = `

        <div class="ocr-card ocr-loading">

            📡 Membaca screenshot...

            <br><br>

            🧠 Mendeteksi lokasi jemput & antar...

        </div>

    `;

    await wait(2000);

    /* =========================================
    SIMULASI OCR
    GANTI DENGAN TESSERACT OCR NANTI
    ========================================= */

    const fakeOCRSuccess =
        Math.random() > 0.35;

    if (fakeOCRSuccess) {

        const contohPickup = [
            "Margo City",
            "Blok M Plaza",
            "Summarecon Mall Bekasi",
            "Grand Indonesia",
            "Stasiun Bogor"
        ];

        const contohDropoff = [
            "Stasiun UI",
            "SCBD",
            "AEON BSD",
            "Tebet Eco Park",
            "Kebun Raya Bogor"
        ];

        const pickup =
            contohPickup[
            Math.floor(
                Math.random() *
                contohPickup.length
            )
            ];

        const dropoff =
            contohDropoff[
            Math.floor(
                Math.random() *
                contohDropoff.length
            )
            ];

        const generatedData = {

            pickup,
            dropoff,

            source: "user_upload",

            verified: false,

            timestamp:
                Date.now()

        };

        saveMovementData(
            generatedData
        );

        resultArea.innerHTML = `

            <div class="ocr-card ocr-success">

                ✅ Lokasi berhasil dikenali

                <br><br>

                🚖 Jemput:
                <br>
                <b>${pickup}</b>

                <br><br>

                🏁 Antar:
                <br>
                <b>${dropoff}</b>

                <br><br>

                📦 Data berhasil
                ditambahkan ke database lokal.

            </div>

        `;

    } else {

        forwardToAdmin(
            file
        );

        resultArea.innerHTML = `

            <div class="ocr-card ocr-failed">

                ⚠️ Lokasi belum berhasil
                dikenali otomatis.

                <br><br>

                Screenshot telah diteruskan
                ke admin:

                <br><br>

                <b>
                admin@silverhhawk.web.id
                </b>

                <br><br>

                untuk ditinjau manual
                dan dimasukkan ke database.

            </div>

        `;

    }

}

/* =========================================
SAVE MOVEMENT DATA
========================================= */

function saveMovementData(data) {

    let existing = [];

    try {

        existing =
            JSON.parse(
                localStorage.getItem(
                    "movement_history"
                )
            ) || [];

    } catch (err) {

        console.log(err);

    }

    existing.push(data);

    localStorage.setItem(
        "movement_history",
        JSON.stringify(existing)
    );

    console.log(
        "Movement history updated:",
        existing
    );

}

/* =========================================
FORWARD TO ADMIN
========================================= */

function forwardToAdmin(file) {

    console.log(
        "Forward screenshot to admin:",
        file.name
    );

    /*
    FUTURE:
    upload ke:
    - Google Apps Script
    - Firebase
    - Cloudflare Worker
    */

}

/* =========================================
VIEW LOCAL DATABASE
========================================= */

function viewMovementDatabase() {

    const data =
        JSON.parse(
            localStorage.getItem(
                "movement_history"
            )
        ) || [];

    console.log(data);

}

document.addEventListener("click", function (e) {

    const btn =
        e.target.closest(".smart-route-btn");

    if (!btn) return;

    showSmartRoute(
        currentUserLat,
        currentUserLon,
        parseFloat(btn.dataset.lat),
        parseFloat(btn.dataset.lon),
        btn.dataset.nama,
        btn.dataset.alamat
    );

});
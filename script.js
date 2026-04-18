const pools = {
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
        ["11:00 - 13:00", "Margo City", 8],
        ["13:00 - 15:00", "Harjamukti", 6],
        ["15:00 - 18:00", "Trans Studio Mall", 4],
        ["18:00 - 20:00", "Cibubur Junction", 3],
        ["20:00 - 21:00", "Kembali Pool Cimanggis", 8]
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
        data = [
            ["11:00 - 13:00", "Pusat Komersial Terdekat", 6],
            ["13:00 - 16:00", "Mall / Rumah Sakit", 8],
            ["16:00 - 19:00", "Area Komuter", 10],
            ["19:00 - 21:00", "Kembali ke " + custom, 8]
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
<div class="jam">${row[0]}</div>
<div class="lokasi">${row[1]}</div>
<div>${Math.round(km)} km estimasi rotasi</div>
<a target="_blank" href="https://maps.google.com/?q=${encodeURIComponent(row[1])}">
Buka Google Maps
</a>
</div>
`;

    });

    total = Math.round(total * 1.25);

    let liter = total / kmpl;
    let biaya = liter * fuel;

    document.getElementById("timeline").innerHTML = html;
    document.getElementById("kmTotal").innerText = total + " km";
    document.getElementById("fuelNeed").innerText = liter.toFixed(1) + " L";
    document.getElementById("fuelCost").innerText = rupiah(biaya);

}

/* TOP BUTTON */
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

generatePlan();
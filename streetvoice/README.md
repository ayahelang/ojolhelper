# Ojol Street Voice

Prototype fitur untuk Ojol Helper:
- Peta OpenStreetMap + Leaflet.
- GPS real-time.
- Deteksi nama jalan melalui reverse geocoding.
- Pengumuman nama jalan 3 tahap: masuk, tengah, menjelang berakhir.
- Analisis awal persimpangan: kanan, kiri, lurus.
- Text-to-Speech bahasa Indonesia.
- Pengaturan jarak pengumuman akhir jalan.

## Cara menjalankan

1. Jangan buka `index.html` lewat `file://` jika browser memblokir GPS/fetch.
2. Jalankan melalui HTTPS atau server lokal, misalnya VS Code Live Server.
3. Berikan izin lokasi dan suara pada browser.
4. Tekan **Mulai GPS**.

## Catatan penting

Ini adalah prototype. Data nama jalan menggunakan Nominatim OpenStreetMap dan data ruas/persimpangan menggunakan Overpass API. Untuk penggunaan ramai/produksi, endpoint publik tersebut perlu diganti atau diberi caching/proxy sendiri sesuai kebijakan layanan.

Akurasi kiri/kanan/lurus pada prototype masih heuristik. Untuk versi produksi, sebaiknya memakai map matching dan analisis graf jalan yang lebih kuat.

# Beyond Orbit — Game Development Prompt

## 1. Project Overview

Buat sebuah game eksplorasi antariksa 3D berbasis website bernama **Beyond Orbit** dengan tagline **"Explore the unknown. Journey beyond the stars."**

Beyond Orbit merupakan game single-player dengan genre 3D Space Exploration dan Sandbox yang memungkinkan pemain mengendalikan pesawat luar angkasa secara bebas, menjelajahi galaksi, mengunjungi planet, memindai karakteristik planet, dan melakukan perjalanan antarsistem bintang.

Game ini tidak berfokus pada pertempuran, melainkan pada kebebasan eksplorasi, keindahan visual antariksa, dan pengalaman bermain yang imersif, santai, serta menyenangkan.

Buat game yang benar-benar dapat dimainkan, bukan sekadar landing page, simulasi tata surya, atau prototype antarmuka.

## 2. Technology Stack

Gunakan teknologi berikut:

- HTML5.
- CSS3.
- Vanilla JavaScript (ES Modules).
- Three.js untuk rendering lingkungan 3D.
- WebGL untuk rendering grafis.
- LocalStorage untuk penyimpanan progres.
- Web Audio API untuk pengelolaan audio.
- JSON untuk konfigurasi sistem bintang dan planet.

Development constraints:

- Jangan menggunakan React, Vue, Angular, atau framework frontend lainnya.
- Jangan menggunakan Tailwind CSS.
- Jangan menggunakan backend maupun database.
- Jangan menggunakan API AI atau layanan berbayar.
- Jangan menggunakan Unity, Unreal Engine, atau game engine tambahan.
- Gunakan Three.js melalui CDN dengan versi yang konsisten atau dependency lokal.
- Project harus dapat dijalankan melalui static local server dan di-deploy ke Vercel tanpa proses build yang kompleks.
- Pisahkan kode berdasarkan tanggung jawab setiap modul.

## 3. Visual Design & Art Direction

Buat tampilan game dengan gaya **cinematic semi-realistic science fiction**, terinspirasi dari pengalaman eksplorasi antariksa seperti No Man's Sky, Elite Dangerous, dan Space Engine, tanpa menyalin aset maupun desain game tersebut.

Gunakan arah desain berikut:

- Lingkungan antariksa yang luas, gelap, dan imersif.
- Planet berbentuk 3D dengan tekstur permukaan yang detail.
- Pencahayaan planet yang berasal dari posisi bintang.
- Atmosfer planet dengan efek atmospheric glow.
- Nebula dengan kombinasi warna biru, ungu, dan merah.
- Ribuan bintang sebagai latar belakang antariksa.
- Model pesawat futuristik dengan bentuk yang detail dan proporsional.
- Efek cahaya mesin pesawat berwarna cyan atau biru.
- Efek partikel ketika pesawat melakukan akselerasi.
- Animasi warp drive yang sinematik.
- Efek bloom yang digunakan secara proporsional.
- Transisi kamera dan antarmuka yang halus.

Gunakan color palette:

- Deep Space: #050811
- Midnight Blue: #111D35
- Electric Cyan: #42D9F5
- Nebula Violet: #8B5CF6
- Starlight White: #E7EDF5

Desain UI harus minimalis, modern, futuristik, dan profesional. Gunakan tipografi yang mudah dibaca dengan sentuhan sci-fi.

Hindari penggunaan gradient berlebihan, glowing border pada setiap komponen, emoji sebagai ikon, elemen dekoratif yang tidak diperlukan, serta layout yang menyerupai template dashboard SaaS.

Prioritaskan visual dunia permainan dibandingkan elemen antarmuka.

## 4. Galaxy & World Building

Buat dunia permainan yang terdiri dari lima sistem bintang dengan total 24 planet.

### Solar System

Sistem bintang awal yang menggunakan tata surya asli.

Planet:

- Mercury
- Venus
- Earth
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune

Tambahkan Matahari, Bulan, beberapa satelit alami, sabuk asteroid, serta cincin Saturnus.

### Alpha Centauri System

Sistem yang berisi planet berbatu dan planet yang berpotensi memiliki lingkungan layak huni. Gunakan planet fiktif untuk kebutuhan gameplay.

Planet:

- Proxima Haven
- Aurelia
- Terra Nova
- Kepleris

### Nebula Prime System

Sistem dengan lingkungan nebula berwarna-warni, fenomena antariksa, dan planet misterius.

Planet:

- Nyx
- Lumora
- Aether
- Orionis
- Velora

### Cryon System

Sistem yang didominasi planet es, atmosfer dingin, dan bulan beku.

Planet:

- Glacius
- Borealis
- Frostara

### Vulcan System

Sistem dengan planet lava, lingkungan vulkanik, dan temperatur ekstrem.

Planet:

- Ignis
- Inferna
- Pyron
- Magmora

Setiap sistem bintang harus memiliki identitas visual, pencahayaan, warna, dan atmosfer yang berbeda.

Setiap planet memiliki konfigurasi tersendiri berupa:

- Unique ID.
- Nama planet.
- Sistem bintang.
- Jenis planet.
- Radius.
- Diameter.
- Temperatur.
- Atmosfer.
- Warna.
- Tekstur.
- Kecepatan rotasi.
- Jarak orbit.
- Kecepatan orbit.
- Jumlah bulan.
- Potensi kelayakhunian.
- Deskripsi planet.
- Jangkauan pemindaian.

Gunakan konfigurasi berbasis data agar planet baru dapat ditambahkan tanpa mengubah core game logic.

Ukuran planet, jarak antarbintang, kecepatan orbit, dan kecepatan pesawat tidak harus mengikuti skala astronomi sebenarnya. Sederhanakan seluruh skala untuk menghasilkan pengalaman eksplorasi yang nyaman dan menyenangkan.

Informasi planet asli harus dibedakan dari data planet fiktif.

## 5. Core Gameplay

Gameplay utama memiliki alur sebagai berikut:

Start Game → Free Flight → Select Destination → Space Travel → Explore Planet → Scan Planet → Record Discovery → Continue Exploration.

Pemain memulai perjalanan di Solar System dengan sebuah pesawat luar angkasa.

Pemain bebas menentukan planet yang ingin dikunjungi dan dapat berpindah ke sistem bintang lainnya menggunakan Warp Drive.

Tidak terdapat batasan waktu, kondisi kalah, musuh, maupun kewajiban menyelesaikan misi.

Tujuan utama permainan adalah menjelajahi galaksi dan melengkapi Discovery Journal dengan menemukan seluruh planet yang tersedia.

Setelah seluruh planet ditemukan, pemain tetap dapat melanjutkan eksplorasi secara bebas.

## 6. Functional Requirements

### 6.1 Main Menu

Buat halaman utama game dengan cinematic animated space background. Tampilkan judul Beyond Orbit dengan tipografi yang kuat dan elegan.

Sediakan menu:

- New Game.
- Continue.
- Discovery Journal.
- Settings.
- How to Play.

Tombol Continue hanya aktif apabila terdapat progres tersimpan.

Ketika pemain memilih New Game dan sudah memiliki progres sebelumnya, tampilkan dialog konfirmasi sebelum menghapus progres lama.

Gunakan transisi yang halus ketika berpindah dari Main Menu menuju gameplay.

### 6.2 Spaceship Flight System

Implementasikan sistem penerbangan pesawat dalam ruang tiga dimensi yang responsif dan mudah dikendalikan.

Pesawat harus mampu:

- Bergerak maju dan mundur.
- Bergerak ke kiri dan kanan.
- Bergerak ke atas dan bawah.
- Melakukan pitch, yaw, dan roll.
- Melakukan akselerasi dan deselerasi.
- Mengaktifkan speed boost.
- Melakukan pengereman.
- Mengubah arah penerbangan menggunakan mouse.

Gunakan arcade flight physics dengan acceleration, velocity, damping, dan inertia sederhana.

Hindari simulasi fisika yang terlalu kompleks. Pastikan pergerakan pesawat terasa memiliki bobot, tetapi tetap nyaman untuk pemain kasual.

Tambahkan animasi banking ketika pesawat berbelok dan efek engine thrust yang berubah sesuai kecepatan.

### 6.3 Spaceship Model

Gunakan satu pesawat utama dengan desain futuristik.

Pesawat memiliki:

- Badan pesawat.
- Sayap atau struktur samping.
- Cockpit.
- Mesin pendorong.
- Engine glow.
- Exhaust particles.
- Detail permukaan pesawat.

Gunakan model GLB atau GLTF dengan lisensi yang sesuai apabila tersedia.

Jika tidak tersedia, buat model pesawat menggunakan kombinasi custom geometry Three.js yang tetap terlihat detail dan proporsional. Jangan menggunakan kubus atau segitiga polos sebagai hasil akhir.

### 6.4 Planet Exploration

Pemain dapat mendekati dan mengelilingi planet secara bebas.

Implementasikan:

- Rotasi planet.
- Orbit planet sederhana.
- Tekstur permukaan.
- Atmospheric glow.
- Cincin planet.
- Satelit alami.
- Planet labels.
- Sabuk asteroid.
- Pencahayaan berdasarkan posisi bintang.

Gunakan collision detection berbasis sphere untuk mencegah pesawat menembus permukaan planet.

Ketika pesawat mendekati batas aman planet, kurangi kecepatan atau hentikan pergerakan yang mengarah ke permukaan secara halus.

Pemain hanya melakukan eksplorasi dari luar atmosfer dan tidak dapat mendarat di permukaan planet.

### 6.5 Planet Scanner

Buat sistem pemindaian planet yang dapat diaktifkan ketika pesawat berada dalam jangkauan planet.

Ketika planet berada dalam jangkauan:

- Tampilkan nama planet.
- Tampilkan indikator scanner ready.
- Tampilkan tombol atau keyboard hint untuk melakukan scan.

Ketika proses scan dimulai, tampilkan animasi pemindaian dengan progress indicator selama beberapa detik.

Setelah selesai, tampilkan panel informasi yang berisi:

- Planet name.
- Star system.
- Planet type.
- Diameter.
- Temperature.
- Atmosphere.
- Number of moons.
- Habitability.
- Planet description.

Tambahkan planet yang berhasil dipindai ke Discovery Journal secara otomatis.

Jangan mencatat planet yang sama lebih dari satu kali.

Apabila pesawat keluar dari jangkauan selama pemindaian berlangsung, batalkan proses scan dan tampilkan informasi yang sesuai.

### 6.6 Galaxy Map

Buat Galaxy Map interaktif yang menampilkan lima sistem bintang dalam bentuk peta galaksi futuristik.

Galaxy Map memiliki:

- Visualisasi posisi sistem bintang.
- Indikator sistem bintang aktif.
- Nama setiap sistem.
- Informasi sistem yang dipilih.
- Daftar planet dalam sistem.
- Jumlah planet yang telah ditemukan.
- Indikator progres eksplorasi.
- Tombol Set Destination.
- Tombol Activate Warp Drive.

Pemain dapat memilih planet dalam sistem bintang aktif sebagai tujuan navigasi.

Apabila memilih sistem bintang yang berbeda, pemain dapat mengaktifkan Warp Drive untuk berpindah lokasi.

Galaxy Map harus bersifat interaktif dan bukan sekadar gambar statis.

### 6.7 Warp Drive

Implementasikan mekanisme perjalanan antarsistem bintang.

Ketika Warp Drive diaktifkan:

1. Nonaktifkan sementara kontrol penerbangan.
2. Tampilkan efek akselerasi pesawat.
3. Tampilkan animasi hyperspace berupa garis-garis cahaya bintang.
4. Tampilkan nama sistem bintang tujuan.
5. Hapus lingkungan sistem bintang sebelumnya dari scene.
6. Muat lingkungan sistem bintang tujuan.
7. Tempatkan pesawat pada posisi awal yang aman.
8. Aktifkan kembali kontrol pemain.
9. Simpan progres secara otomatis.

Gunakan satu sistem bintang aktif pada satu waktu untuk menjaga performa rendering.

Pastikan geometry, material, dan texture yang tidak lagi digunakan dibersihkan dengan benar.

### 6.8 Navigation System

Implementasikan sistem navigasi yang menampilkan informasi perjalanan secara real-time.

Informasi yang ditampilkan:

- Current star system.
- Target planet.
- Distance to target.
- Spaceship velocity.
- Direction indicator.
- Nearby planet.
- Autopilot status.
- Scanner status.

Gunakan satuan jarak dan kecepatan yang konsisten dalam game.

Apabila planet tujuan berada di luar layar, tampilkan indikator arah pada tepi layar yang membantu pemain menemukan target.

### 6.9 Autopilot

Pemain dapat mengaktifkan autopilot setelah memilih planet tujuan.

Ketika autopilot aktif:

- Pesawat secara otomatis menghadap planet tujuan.
- Pesawat bergerak menuju planet.
- Kecepatan menyesuaikan jarak.
- Pesawat menghindari atau berhenti sebelum bertabrakan dengan objek.
- Pesawat memperlambat kecepatan ketika mendekati planet.
- Pesawat berhenti pada jarak pemindaian yang aman.

Autopilot dapat dibatalkan kapan saja.

Input penerbangan manual harus dapat mengambil alih kontrol dari autopilot.

### 6.10 Camera System

Sediakan dua mode kamera.

**Third-person Camera**

- Kamera berada di belakang pesawat.
- Pesawat terlihat secara jelas.
- Kamera mengikuti posisi dan rotasi pesawat.
- Gunakan smooth camera follow untuk menghindari gerakan yang kaku.
- Jarak kamera dapat disesuaikan secara wajar.

**First-person Camera**

- Kamera berada pada posisi cockpit.
- Pemain melihat antariksa dari perspektif pilot.
- Gunakan cockpit overlay atau model interior sederhana.
- HUD navigasi tetap tersedia.

Perpindahan mode kamera harus dapat dilakukan selama gameplay berlangsung.

### 6.11 Discovery Journal

Buat halaman katalog yang mencatat seluruh planet yang tersedia dalam game.

Discovery Journal memiliki:

- Total planet yang telah ditemukan.
- Total planet yang tersedia.
- Progress bar eksplorasi.
- Filter berdasarkan sistem bintang.
- Filter berdasarkan status discovery.
- Planet cards.
- Detail informasi planet.

Planet yang belum ditemukan ditampilkan sebagai Unknown Planet dengan visual silhouette atau locked state.

Planet yang telah dipindai menampilkan nama, preview visual, informasi, serta status Discovered.

Pastikan seluruh data journal terintegrasi dengan Planet Scanner dan LocalStorage.

### 6.12 Cinematic Mode

Buat mode yang memungkinkan pemain menikmati pemandangan antariksa tanpa gangguan antarmuka.

Ketika mode ini aktif:

- Sembunyikan Gameplay HUD.
- Sembunyikan planet labels.
- Sembunyikan navigation indicators.
- Sembunyikan keyboard hints.
- Pertahankan kontrol pesawat.

Pemain dapat mengaktifkan kembali HUD kapan saja menggunakan keyboard shortcut.

### 6.13 Pause Menu

Buat Pause Menu yang dapat diakses selama gameplay.

Sediakan pilihan:

- Resume Game.
- Settings.
- How to Play.
- Save & Return to Main Menu.

Ketika game dijeda, hentikan sementara simulasi pergerakan pesawat dan planet.

Pastikan kontrol penerbangan tidak aktif ketika pemain sedang berinteraksi dengan menu.

### 6.14 Settings

Buat halaman pengaturan dengan kategori berikut.

Graphics:

- Graphics quality: Low, Medium, High.
- Render distance.
- Bloom effect.
- Particle quality.
- Orbit lines.
- Planet labels.
- Fullscreen mode.

Audio:

- Master volume.
- Music volume.
- Sound effects volume.
- Mute audio.

Controls:

- Mouse sensitivity.
- Default camera mode.
- Invert Y-axis.

Game Data:

- Reset progress.
- Confirmation dialog sebelum reset.

Seluruh pengaturan harus berfungsi dan tersimpan secara otomatis.

Jangan membuat tombol atau pengaturan yang hanya bersifat dekoratif.

### 6.15 Save & Load Progress

Gunakan LocalStorage untuk menyimpan:

- Save data version.
- Current star system.
- Spaceship position.
- Spaceship rotation.
- Discovered planet IDs.
- Selected destination.
- Camera mode.
- Game settings.
- Total playtime.
- Last saved timestamp.

Lakukan autosave ketika:

- Planet berhasil dipindai.
- Pemain berpindah sistem bintang.
- Pengaturan diubah.
- Pemain kembali ke Main Menu.
- Interval tertentu selama gameplay.

Validasi save data sebelum digunakan dan tangani data yang rusak dengan aman.

Pastikan fitur Continue mengembalikan pemain ke posisi terakhir yang valid.

### 6.16 Audio System

Tambahkan audio untuk meningkatkan pengalaman bermain.

Audio mencakup:

- Ambient space background music.
- Spaceship engine sound.
- Speed boost sound.
- Warp drive sound.
- Planet scanning sound.
- Discovery notification.
- UI interaction sound.

Gunakan aset audio dengan lisensi yang sesuai atau efek suara sederhana yang dihasilkan menggunakan Web Audio API.

Audio hanya dimulai setelah interaksi pengguna sesuai kebijakan browser.

## 7. Game Controls

Implementasikan kontrol desktop sebagai berikut:

- W: bergerak maju.
- S: bergerak mundur.
- A: bergerak ke kiri.
- D: bergerak ke kanan.
- Q: roll ke kiri.
- E: roll ke kanan.
- R: bergerak ke atas.
- Ctrl: bergerak ke bawah.
- Mouse Movement: mengatur pitch dan yaw.
- Shift: speed boost.
- Space: brake.
- F: scan planet.
- M: buka Galaxy Map.
- C: mengganti mode kamera.
- J: buka Discovery Journal.
- P: aktifkan atau nonaktifkan Autopilot.
- H: aktifkan atau nonaktifkan Cinematic Mode.
- Esc: Pause Menu atau menutup panel aktif.

Gunakan Pointer Lock API untuk kontrol mouse apabila diperlukan.

Tangani perpindahan fokus browser, pointer lock, dan input keyboard agar pesawat tidak terus bergerak ketika pemain membuka menu atau berpindah tab.

Tampilkan panduan kontrol pada awal permainan dan sediakan akses melalui How to Play.

## 8. User Interface & Layout

Buat seluruh halaman berikut:

1. Main Menu.
2. Gameplay Screen.
3. Galaxy Map.
4. Planet Scan Details.
5. Discovery Journal.
6. Pause Menu.
7. Settings.
8. How to Play.
9. Loading Screen.

### Gameplay HUD

Gunakan canvas Three.js yang memenuhi seluruh viewport.

Susunan HUD:

**Top Left**

- Current star system.
- Nearby planet information.

**Top Center**

- Navigation indicator.
- Heading indicator.

**Top Right**

- Target planet.
- Distance to target.

**Center**

- Minimal crosshair.
- Contextual planet scanning indicator.

**Bottom Left**

- Current velocity.
- Speed indicator.
- Boost status.

**Bottom Right**

- Scanner status.
- Autopilot status.
- Current camera mode.

**Bottom Center**

- Keyboard shortcut hints.

Gunakan panel semi-transparan dengan kontras yang cukup agar informasi tetap terbaca tanpa mengganggu pemandangan.

HUD tidak boleh memenuhi sebagian besar layar. Fokus utama layar harus tetap berada pada pesawat, planet, dan lingkungan antariksa.

## 9. Project Architecture

Gunakan struktur project modular seperti berikut:

    beyond-orbit/
    ├── index.html
    ├── css/
    │   ├── main.css
    │   ├── menu.css
    │   └── hud.css
    ├── js/
    │   ├── main.js
    │   ├── game.js
    │   ├── spaceship.js
    │   ├── controls.js
    │   ├── camera.js
    │   ├── universe.js
    │   ├── planet.js
    │   ├── navigation.js
    │   ├── scanner.js
    │   ├── autopilot.js
    │   ├── warp.js
    │   ├── journal.js
    │   ├── audio.js
    │   ├── storage.js
    │   └── ui.js
    ├── data/
    │   ├── systems.json
    │   └── planets.json
    ├── assets/
    │   ├── models/
    │   ├── textures/
    │   ├── audio/
    │   └── images/
    └── README.md

Struktur dapat disesuaikan apabila terdapat pendekatan yang lebih efisien, tetapi tetap gunakan Vanilla JavaScript tanpa framework tambahan.

Gunakan centralized game state untuk mengelola status permainan seperti:

- Main Menu.
- Loading.
- Playing.
- Paused.
- Map Open.
- Journal Open.
- Scanning.
- Warping.

Pastikan tidak terdapat konflik antara state permainan dan input pemain.

## 10. Performance & Optimization

Game harus dapat berjalan dengan baik pada browser desktop dan laptop tanpa membutuhkan perangkat gaming kelas atas.

Implementasikan:

- RequestAnimationFrame untuk game loop.
- Delta time untuk pergerakan yang konsisten.
- Pembatasan delta time setelah browser kehilangan fokus.
- Texture caching.
- Geometry dan material reuse.
- Frustum culling.
- Level of Detail apabila diperlukan.
- InstancedMesh untuk asteroid berjumlah banyak.
- Particle count yang dapat disesuaikan.
- Pixel ratio limit.
- Adaptive graphics quality.
- Lazy loading aset sistem bintang.
- Resource disposal ketika berpindah sistem bintang.
- Pembaruan HUD dengan frekuensi yang wajar.

Gunakan hanya satu active rendering loop.

Targetkan 60 FPS pada perangkat yang memadai dan minimal 30 FPS pada pengaturan grafis rendah pada perangkat pengujian yang sesuai.

Prioritaskan performa dan stabilitas dibandingkan efek visual yang terlalu berat.

## 11. Asset Management

Gunakan aset planet, pesawat, tekstur, ikon, dan audio dengan kualitas visual yang baik serta lisensi yang mengizinkan penggunaannya.

Simpan aset secara lokal apabila memungkinkan agar tidak bergantung pada hotlink eksternal.

Apabila aset tidak tersedia:

- Buat procedural planet textures menggunakan Canvas API atau shader.
- Buat starfield menggunakan particle system.
- Buat nebula menggunakan procedural texture.
- Buat cincin planet menggunakan RingGeometry.
- Buat atmosfer menggunakan shader atau transparent sphere.
- Buat model pesawat menggunakan custom geometry.

Pastikan game tetap dapat berjalan meskipun suatu aset eksternal gagal dimuat.

Cantumkan sumber dan lisensi aset pada README.md.

## 12. Scope Limitations

Jangan menambahkan fitur berikut:

- Combat system.
- Enemy spaceships.
- Weapons.
- Multiplayer.
- Online leaderboard.
- Authentication.
- Database.
- Fuel system.
- Health system.
- Survival mechanics.
- Inventory.
- Trading system.
- Spaceship shop.
- Crafting.
- Planet landing.
- Walking on planet.
- Infinite procedural galaxy.
- Realistic gravitational physics.
- Payment system.
- AI integration.

Pertahankan fokus utama pada eksplorasi antariksa, navigasi pesawat, penemuan planet, dan pengalaman visual.

## 13. Implementation Plan

Kerjakan seluruh fitur secara bertahap dalam satu project yang terintegrasi.

Phase 1 — Core Game Environment:

- Three.js initialization.
- Scene, renderer, camera, dan lighting.
- Starfield.
- Spaceship model.
- Flight controls.
- Camera follow.

Phase 2 — Solar System:

- Matahari dan delapan planet.
- Planet textures.
- Rotation dan orbit.
- Moon dan asteroid.
- Collision detection.

Phase 3 — Exploration Features:

- Navigation system.
- Planet scanner.
- Autopilot.
- Camera modes.
- Discovery tracking.

Phase 4 — Galaxy Expansion:

- Empat sistem bintang tambahan.
- Galaxy Map.
- Warp Drive.
- Dynamic environment loading.

Phase 5 — User Interface:

- Main Menu.
- Gameplay HUD.
- Discovery Journal.
- Settings.
- Pause Menu.
- How to Play.

Phase 6 — Game Polish:

- Audio system.
- Cinematic Mode.
- Visual effects.
- Animation.
- LocalStorage.
- Performance optimization.

Phase 7 — Testing:

- Pengujian seluruh kontrol.
- Pengujian seluruh tombol dan interaksi.
- Pengujian pemindaian planet.
- Pengujian autopilot.
- Pengujian perpindahan sistem bintang.
- Pengujian save dan load.
- Pengujian performa.
- Pengujian kompatibilitas browser.
- Perbaikan bug.

Jangan berhenti setelah membuat Main Menu atau tampilan awal. Lanjutkan implementasi sampai seluruh fitur utama selesai dan terintegrasi.

## 14. Acceptance Criteria

Project dinyatakan selesai apabila:

- Game dapat dimainkan langsung melalui browser.
- Pesawat dapat dikendalikan secara bebas dalam ruang 3D.
- Terdapat lima sistem bintang dan 24 planet yang dapat dijelajahi.
- Setiap sistem bintang memiliki identitas visual yang berbeda.
- Pesawat tidak dapat menembus permukaan planet.
- Planet Scanner berfungsi sesuai jangkauan.
- Galaxy Map bersifat interaktif.
- Warp Drive dapat memindahkan pemain antarsistem bintang.
- Autopilot dapat membawa pemain menuju planet dengan aman.
- First-person dan third-person camera berfungsi.
- Discovery Journal terintegrasi dengan hasil pemindaian.
- Cinematic Mode berfungsi.
- Seluruh pengaturan dapat digunakan.
- Progres permainan tersimpan setelah browser ditutup.
- Tidak terdapat tombol dummy atau placeholder yang tidak berfungsi.
- Tidak terdapat error JavaScript yang mengganggu gameplay.
- Game dapat dijalankan tanpa backend maupun database.
- Project memiliki README.md yang menjelaskan cara menjalankan game, kontrol, fitur, aset, dan deployment.

## 15. Final Development Instructions

Bangun Beyond Orbit sebagai game yang benar-benar playable, bukan hanya visualisasi tata surya interaktif.

Prioritaskan kualitas gameplay, kenyamanan kontrol pesawat, keindahan lingkungan antariksa, desain HUD, serta performa rendering.

Gunakan pendekatan pengembangan yang sederhana dan efisien. Hindari overengineering, dependency yang tidak diperlukan, serta fitur di luar cakupan.

Jangan menggunakan placeholder visual sebagai hasil akhir. Pastikan setiap komponen terlihat konsisten, profesional, dan memiliki fungsi yang jelas.

Lakukan pengujian setelah setiap tahapan implementasi. Periksa kembali integrasi antarfitur sebelum menyatakan project selesai. Laporkan secara jujur setiap fitur yang belum berhasil diimplementasikan atau diuji.

Hasil akhir harus memberikan pengalaman seolah-olah pemain sedang menerbangkan pesawat luar angkasa sungguhan, mengembara di antara planet dan menjelajahi keindahan galaksi melalui browser.

**Beyond Orbit — The universe is yours to explore.**
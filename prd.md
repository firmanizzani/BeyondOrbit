# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# BEYOND ORBIT

**Tagline:** Explore the unknown. Journey beyond the stars.

## 1. Product Information

- Nama produk: Beyond Orbit
- Genre: 3D Space Exploration / Sandbox
- Platform: Web Browser
- Mode permainan: Single-player
- Target pengguna: Casual gamers dan penggemar antariksa
- Technology stack: HTML, CSS, JavaScript, Three.js
- Penyimpanan data: LocalStorage
- Versi: 1.0

## 2. Product Overview

Beyond Orbit merupakan game eksplorasi antariksa berbasis website yang memungkinkan pemain mengendalikan pesawat luar angkasa secara bebas untuk menjelajahi berbagai planet, sistem bintang, dan fenomena antariksa dalam lingkungan tiga dimensi.

Pemain dapat melakukan perjalanan antarplanet, memindai karakteristik planet, berpindah antarsistem bintang, serta mencatat berbagai penemuan selama perjalanan.

Beyond Orbit mengutamakan kebebasan eksplorasi, visual yang imersif, dan pengalaman bermain yang santai tanpa pertempuran, batasan waktu, maupun mekanisme survival yang kompleks.

## 3. Product Objectives

- Menghadirkan pengalaman eksplorasi antariksa yang menarik melalui browser.
- Memberikan kebebasan kepada pemain untuk menjelajahi berbagai sistem bintang.
- Menghadirkan lingkungan antariksa dengan visual 3D yang imersif.
- Memberikan pengalaman eksplorasi yang informatif melalui informasi planet.
- Menghadirkan kontrol pesawat yang responsif dan mudah dipahami.
- Mengembangkan game yang ringan tanpa membutuhkan backend, database, maupun instalasi aplikasi.

## 4. Target Users

### 4.1 Casual Gamers

Pemain yang ingin menikmati permainan santai tanpa mekanisme gameplay yang kompleks, kompetisi, maupun tekanan untuk menyelesaikan misi.

### 4.2 Space Enthusiasts

Pengguna yang memiliki ketertarikan terhadap astronomi, planet, tata surya, galaksi, dan eksplorasi antariksa.

### 4.3 Exploration Game Players

Pemain yang menyukai kebebasan menjelajahi lingkungan virtual, menemukan lokasi baru, dan menikmati pemandangan dalam game.

## 5. Design Direction

Beyond Orbit menggunakan pendekatan visual cinematic semi-realistic science fiction dengan antarmuka futuristik yang minimalis.

### 5.1 Visual Style

- Lingkungan antariksa yang luas dan imersif.
- Planet dengan tekstur permukaan yang detail.
- Model pesawat luar angkasa futuristik.
- Pencahayaan dinamis berdasarkan posisi bintang.
- Efek atmosfer pada planet.
- Nebula dengan variasi warna.
- Starfield sebagai latar belakang antariksa.
- Efek cahaya mesin pesawat.
- Animasi warp drive yang sinematik.
- Transisi kamera dan antarmuka yang halus.

### 5.2 Color Palette

| Warna | Hex Code |
|---|---|
| Deep Space | #050811 |
| Midnight Blue | #111D35 |
| Electric Cyan | #42D9F5 |
| Nebula Violet | #8B5CF6 |
| Starlight White | #E7EDF5 |

### 5.3 User Interface Style

- Minimalis, modern, dan futuristik.
- Menggunakan tipografi yang mudah dibaca.
- Menggunakan HUD dengan tampilan semi-transparan.
- Tidak menggunakan elemen dekoratif secara berlebihan.
- Mengutamakan pemandangan antariksa sebagai fokus utama layar.
- Menggunakan animasi antarmuka yang halus dan konsisten.

### 5.4 Audio Direction

- Musik ambient antariksa.
- Efek suara mesin pesawat.
- Efek suara akselerasi.
- Efek suara warp drive.
- Efek suara pemindaian planet.
- Efek suara interaksi antarmuka.

## 6. World Building

### 6.1 Galaxy System

Dunia Beyond Orbit terdiri dari lima sistem bintang dengan total 24 planet yang dapat dijelajahi oleh pemain.

| Sistem Bintang | Karakteristik | Jumlah Planet |
|---|---|---:|
| Solar System | Tata surya asli | 8 |
| Alpha Centauri | Planet berbatu dan mirip Bumi | 4 |
| Nebula Prime | Nebula dan planet misterius | 5 |
| Cryon System | Planet es dan lingkungan beku | 3 |
| Vulcan System | Planet lava dan vulkanik | 4 |
| **Total** | | **24** |

Solar System menggunakan nama planet asli, sedangkan sistem bintang lainnya menggunakan planet fiktif untuk memberikan fleksibilitas dalam pengembangan dunia permainan.

### 6.2 Solar System

Sistem bintang awal yang menggunakan tata surya asli sebagai referensi.

Daftar planet:

- Mercury
- Venus
- Earth
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune

Objek tambahan:

- Matahari.
- Bulan.
- Beberapa satelit alami.
- Sabuk asteroid.
- Cincin Saturnus.

### 6.3 Alpha Centauri System

Sistem bintang dengan planet berbatu dan planet fiktif yang berpotensi memiliki lingkungan layak huni.

Daftar planet:

- Proxima Haven
- Aurelia
- Terra Nova
- Kepleris

### 6.4 Nebula Prime System

Sistem bintang fiktif dengan lingkungan nebula berwarna-warni dan planet misterius.

Daftar planet:

- Nyx
- Lumora
- Aether
- Orionis
- Velora

### 6.5 Cryon System

Sistem bintang fiktif yang didominasi planet es, atmosfer dingin, dan bulan beku.

Daftar planet:

- Glacius
- Borealis
- Frostara

### 6.6 Vulcan System

Sistem bintang fiktif dengan planet lava, aktivitas vulkanik, dan temperatur ekstrem.

Daftar planet:

- Ignis
- Inferna
- Pyron
- Magmora

### 6.7 Planet Types

| Jenis Planet | Deskripsi |
|---|---|
| Terrestrial Planet | Planet berbatu seperti Bumi. |
| Gas Giant | Planet gas berukuran besar. |
| Ice Giant | Planet raksasa dengan komposisi yang kaya senyawa volatil. |
| Ice Planet | Planet dengan permukaan yang didominasi es. |
| Lava Planet | Planet dengan aktivitas vulkanik ekstrem. |
| Desert Planet | Planet dengan lingkungan kering dan berpasir. |
| Ringed Planet | Planet dengan sistem cincin. |
| Ocean Planet | Planet yang didominasi lautan. |

### 6.8 Planet Attributes

Setiap planet memiliki atribut berikut:

- Planet ID.
- Nama planet.
- Sistem bintang.
- Jenis planet.
- Radius.
- Diameter.
- Temperatur.
- Atmosfer.
- Tekstur permukaan.
- Warna.
- Kecepatan rotasi.
- Jarak orbit.
- Kecepatan orbit.
- Jumlah bulan.
- Potensi kelayakhunian.
- Jangkauan pemindaian.
- Deskripsi planet.

Informasi planet asli dan planet fiktif harus dibedakan secara jelas.

### 6.9 Space Environment

Lingkungan antariksa terdiri dari:

- Bintang.
- Planet.
- Bulan.
- Asteroid.
- Sabuk asteroid.
- Nebula.
- Partikel antariksa.
- Atmosfer planet.
- Cincin planet.
- Garis orbit.

Setiap sistem bintang memiliki karakteristik visual dan lingkungan yang berbeda.

## 7. Core Gameplay Loop

Alur utama permainan:

1. Pemain memulai permainan.
2. Pemain mengendalikan pesawat secara bebas.
3. Pemain memilih planet atau sistem bintang tujuan.
4. Pemain melakukan perjalanan menuju tujuan.
5. Pemain mendekati dan mengelilingi planet.
6. Pemain melakukan pemindaian planet.
7. Hasil pemindaian disimpan ke Discovery Journal.
8. Pemain melanjutkan perjalanan menuju planet berikutnya.

Pemain dapat mengulangi proses eksplorasi tanpa batas waktu.

Tidak terdapat kondisi menang maupun kalah. Setelah seluruh planet ditemukan, pemain tetap dapat melanjutkan eksplorasi secara bebas.

## 8. Functional Requirements

### FR-01 — Main Menu

Main Menu merupakan halaman pertama yang ditampilkan ketika pemain membuka game.

Fitur yang tersedia:

- New Game: memulai permainan baru.
- Continue: melanjutkan progres terakhir.
- Discovery Journal: melihat katalog penemuan.
- Settings: mengatur permainan.
- How to Play: melihat panduan kontrol.

Tombol Continue hanya dapat digunakan apabila terdapat progres permainan yang tersimpan.

Apabila pemain memilih New Game ketika sudah memiliki progres sebelumnya, sistem menampilkan dialog konfirmasi.

### FR-02 — Spaceship Flight System

Sistem penerbangan memungkinkan pemain mengendalikan pesawat secara bebas dalam lingkungan tiga dimensi.

Kemampuan pesawat meliputi:

- Bergerak maju dan mundur.
- Bergerak ke kiri dan kanan.
- Bergerak ke atas dan bawah.
- Melakukan pitch, yaw, dan roll.
- Melakukan akselerasi dan deselerasi.
- Melakukan pengereman.
- Mengaktifkan speed boost.
- Mengatur arah penerbangan menggunakan mouse.

Sistem penerbangan menggunakan arcade flight physics dengan acceleration, velocity, damping, dan inertia sederhana.

Kontrol pesawat harus terasa halus, responsif, dan mudah digunakan.

### FR-03 — Spaceship Model

Game menyediakan satu pesawat utama dengan desain futuristik.

Komponen visual pesawat:

- Badan pesawat.
- Sayap atau struktur samping.
- Cockpit.
- Mesin pendorong.
- Engine glow.
- Exhaust particles.
- Detail permukaan.

Model pesawat dapat menggunakan format GLB atau GLTF dengan lisensi yang sesuai, atau dibuat menggunakan custom geometry Three.js.

Efek mesin pesawat menyesuaikan kecepatan dan akselerasi pemain.

### FR-04 — Planet Exploration

Pemain dapat mendekati dan mengelilingi planet secara bebas.

Fitur eksplorasi meliputi:

- Mengamati planet dari berbagai sudut.
- Mengelilingi planet.
- Mengamati tekstur permukaan.
- Melihat rotasi planet.
- Menjelajahi bulan dan asteroid di sekitar planet.
- Mengamati atmosfer dan cincin planet.

Sistem menggunakan collision detection sederhana untuk mencegah pesawat menembus permukaan planet.

Pemain hanya melakukan eksplorasi dari luar atmosfer tanpa fitur pendaratan di permukaan planet.

### FR-05 — Planet Scanner

Planet Scanner memungkinkan pemain memperoleh informasi mengenai planet yang ditemukan.

Ketika pesawat berada dalam jangkauan pemindaian, sistem menampilkan indikator Scanner Ready.

Pemain dapat mengaktifkan pemindaian menggunakan tombol F.

Proses pemindaian menampilkan animasi dan progress indicator.

Informasi hasil pemindaian mencakup:

- Nama planet.
- Sistem bintang.
- Jenis planet.
- Diameter.
- Temperatur.
- Atmosfer.
- Jumlah bulan.
- Potensi kelayakhunian.
- Deskripsi planet.

Planet yang berhasil dipindai secara otomatis ditambahkan ke Discovery Journal.

Sistem tidak mencatat planet yang sama lebih dari satu kali.

Pemindaian dibatalkan apabila pemain keluar dari jangkauan sebelum proses selesai.

### FR-06 — Galaxy Map

Galaxy Map merupakan peta navigasi interaktif untuk memilih planet dan sistem bintang tujuan.

Informasi yang ditampilkan:

- Seluruh sistem bintang yang tersedia.
- Posisi sistem bintang aktif.
- Nama sistem bintang.
- Daftar planet dalam setiap sistem.
- Informasi sistem bintang.
- Jumlah planet yang telah ditemukan.
- Progres eksplorasi.

Pemain dapat memilih planet dalam sistem aktif sebagai tujuan navigasi.

Apabila pemain memilih sistem bintang lain, pemain dapat mengaktifkan Warp Drive untuk melakukan perjalanan.

### FR-07 — Warp Drive

Warp Drive memungkinkan pemain berpindah antarsistem bintang tanpa harus menempuh jarak antarbintang secara langsung.

Alur Warp Drive:

1. Pemain membuka Galaxy Map.
2. Pemain memilih sistem bintang tujuan.
3. Pemain mengaktifkan Warp Drive.
4. Kontrol penerbangan dinonaktifkan sementara.
5. Sistem menampilkan animasi hyperspace.
6. Sistem menampilkan nama tujuan.
7. Lingkungan sistem sebelumnya dilepas.
8. Lingkungan sistem tujuan dimuat.
9. Pesawat ditempatkan pada posisi yang aman.
10. Kontrol penerbangan diaktifkan kembali.
11. Progres permainan disimpan.

Hanya satu sistem bintang yang dirender pada satu waktu untuk menjaga performa permainan.

### FR-08 — Navigation System

Sistem navigasi menampilkan informasi perjalanan melalui Gameplay HUD.

| Informasi | Deskripsi |
|---|---|
| Current System | Sistem bintang saat ini. |
| Target Planet | Planet tujuan pemain. |
| Distance | Jarak menuju planet tujuan. |
| Velocity | Kecepatan pesawat. |
| Direction Indicator | Indikator arah menuju tujuan. |
| Nearby Objects | Informasi objek terdekat. |
| Scanner Status | Status pemindaian planet. |
| Autopilot Status | Status navigasi otomatis. |

Apabila planet tujuan berada di luar layar, sistem menampilkan indikator arah pada tepi layar.

### FR-09 — Autopilot

Autopilot memungkinkan pesawat bergerak secara otomatis menuju planet yang telah dipilih.

Ketika autopilot aktif:

- Pesawat menghadap planet tujuan.
- Pesawat bergerak menuju tujuan.
- Kecepatan menyesuaikan jarak.
- Pesawat menghindari atau berhenti sebelum bertabrakan dengan objek.
- Pesawat memperlambat kecepatan ketika mendekati planet.
- Pesawat berhenti pada jarak pemindaian yang aman.

Pemain dapat menonaktifkan autopilot kapan saja.

Kontrol manual dapat mengambil alih sistem autopilot.

### FR-10 — Camera System

Game menyediakan dua mode kamera.

**Third-person Camera**

- Kamera berada di belakang pesawat.
- Model pesawat terlihat selama penerbangan.
- Kamera mengikuti posisi dan rotasi pesawat.
- Pergerakan kamera menggunakan smooth camera follow.

**First-person Camera**

- Kamera berada pada posisi cockpit.
- Pemain melihat antariksa dari perspektif pilot.
- Menggunakan cockpit overlay atau interior sederhana.
- Informasi navigasi tetap ditampilkan.

Pemain dapat berpindah mode kamera selama permainan berlangsung.

### FR-11 — Discovery Journal

Discovery Journal merupakan katalog seluruh planet yang tersedia dan planet yang telah ditemukan oleh pemain.

Fitur Discovery Journal:

- Total planet yang ditemukan.
- Total planet yang tersedia.
- Persentase progres eksplorasi.
- Progress bar.
- Filter berdasarkan sistem bintang.
- Filter berdasarkan status penemuan.
- Planet cards.
- Detail informasi planet.

Planet yang belum ditemukan ditampilkan sebagai Unknown Planet dengan tampilan silhouette atau locked state.

Planet yang berhasil dipindai menampilkan nama, preview visual, informasi lengkap, dan status Discovered.

### FR-12 — Cinematic Mode

Cinematic Mode memungkinkan pemain menikmati pemandangan antariksa tanpa gangguan antarmuka.

Ketika Cinematic Mode aktif:

- Gameplay HUD disembunyikan.
- Planet labels disembunyikan.
- Navigation indicators disembunyikan.
- Keyboard hints disembunyikan.

Kontrol pesawat tetap dapat digunakan.

Pemain dapat mengaktifkan kembali HUD menggunakan keyboard shortcut.

### FR-13 — Pause Menu

Pause Menu memungkinkan pemain menjeda permainan sementara.

Pilihan menu:

- Resume Game.
- Settings.
- How to Play.
- Save & Return to Main Menu.

Ketika permainan dijeda, simulasi pergerakan pesawat dan planet dihentikan sementara.

Kontrol penerbangan dinonaktifkan selama pemain berinteraksi dengan menu.

### FR-14 — Settings

Pemain dapat mengatur pengalaman bermain melalui halaman Settings.

**Graphics Settings**

- Graphics quality: Low, Medium, High.
- Render distance.
- Bloom effect.
- Particle quality.
- Orbit lines.
- Planet labels.
- Fullscreen mode.

**Audio Settings**

- Master volume.
- Music volume.
- Sound effects volume.
- Mute audio.

**Control Settings**

- Mouse sensitivity.
- Default camera mode.
- Invert Y-axis.

**Game Data Settings**

- Reset progress.
- Confirmation dialog sebelum reset.

Seluruh pengaturan harus berfungsi dan tersimpan secara otomatis.

### FR-15 — Save & Load Progress

Progres permainan disimpan menggunakan LocalStorage pada browser.

Data yang disimpan:

- Save data version.
- Sistem bintang aktif.
- Posisi pesawat.
- Rotasi pesawat.
- Planet yang ditemukan.
- Planet tujuan.
- Mode kamera.
- Pengaturan permainan.
- Total durasi bermain.
- Waktu penyimpanan terakhir.

Penyimpanan otomatis dilakukan ketika:

- Planet berhasil dipindai.
- Pemain berpindah sistem bintang.
- Pengaturan permainan diubah.
- Pemain kembali ke Main Menu.
- Interval tertentu selama permainan.

Sistem harus melakukan validasi terhadap data penyimpanan sebelum memuat progres.

### FR-16 — Audio System

Sistem audio menyediakan musik latar dan efek suara untuk meningkatkan pengalaman eksplorasi.

Audio yang tersedia:

- Ambient space music.
- Spaceship engine sound.
- Speed boost sound.
- Warp drive sound.
- Planet scanning sound.
- Discovery notification sound.
- UI interaction sound.

Audio dapat diatur atau dinonaktifkan melalui Settings.

Audio hanya dimulai setelah pengguna melakukan interaksi dengan halaman sesuai kebijakan browser.

## 9. Game Controls

| Kontrol | Fungsi |
|---|---|
| W | Bergerak maju |
| S | Bergerak mundur |
| A | Bergerak ke kiri |
| D | Bergerak ke kanan |
| Q | Roll ke kiri |
| E | Roll ke kanan |
| R | Bergerak ke atas |
| Ctrl | Bergerak ke bawah |
| Mouse | Mengatur arah pesawat |
| Shift | Speed boost |
| Space | Rem pesawat |
| F | Scan planet |
| M | Membuka Galaxy Map |
| C | Mengganti mode kamera |
| J | Membuka Discovery Journal |
| P | Mengaktifkan atau menonaktifkan Autopilot |
| H | Mengaktifkan atau menonaktifkan Cinematic Mode |
| Esc | Pause Menu atau menutup panel aktif |

Sistem harus menangani input keyboard dan mouse dengan baik ketika pemain berpindah tab, membuka menu, atau kehilangan fokus browser.

## 10. User Interface Requirements

### 10.1 Daftar Halaman

| ID | Halaman | Fungsi |
|---|---|---|
| UI-01 | Main Menu | Halaman awal permainan. |
| UI-02 | Gameplay Screen | Lingkungan eksplorasi antariksa. |
| UI-03 | Galaxy Map | Navigasi planet dan sistem bintang. |
| UI-04 | Planet Scan Details | Informasi hasil pemindaian planet. |
| UI-05 | Discovery Journal | Katalog penemuan pemain. |
| UI-06 | Pause Menu | Menjeda permainan. |
| UI-07 | Settings | Pengaturan permainan. |
| UI-08 | How to Play | Panduan kontrol permainan. |
| UI-09 | Loading Screen | Transisi pemuatan lingkungan. |

### 10.2 Main Menu Design

Main Menu menggunakan cinematic animated space background dengan judul Beyond Orbit sebagai fokus utama.

Komponen:

- Game title.
- Tagline.
- Navigation menu.
- Animated space background.
- Background music.
- Game version.

Desain Main Menu harus terlihat seperti menu game, bukan landing page website biasa.

### 10.3 Gameplay HUD

Gameplay menggunakan canvas Three.js yang memenuhi seluruh viewport.

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
- Contextual scanning indicator.

**Bottom Left**

- Current velocity.
- Speed indicator.
- Boost status.

**Bottom Right**

- Scanner status.
- Autopilot status.
- Camera mode.

**Bottom Center**

- Keyboard shortcut hints.

HUD harus memiliki kontras yang memadai tanpa mengganggu pemandangan antariksa.

### 10.4 Galaxy Map Design

Galaxy Map menggunakan tampilan peta antarbintang dengan node yang merepresentasikan setiap sistem bintang.

Komponen:

- Interactive star system nodes.
- Current location indicator.
- Selected system information.
- Planet list.
- Discovery progress.
- Set Destination button.
- Activate Warp Drive button.

### 10.5 Discovery Journal Design

Discovery Journal menggunakan layout katalog planet berbentuk grid.

Komponen:

- Exploration progress.
- Total discovered planets.
- Star system filter.
- Discovery status filter.
- Planet cards.
- Planet details.

### 10.6 Loading Screen Design

Loading Screen ditampilkan ketika game pertama kali dimuat atau ketika pemain berpindah sistem bintang.

Komponen:

- Beyond Orbit logo atau judul.
- Loading indicator.
- Nama sistem bintang tujuan.
- Transisi visual antariksa.

## 11. User Flow

### 11.1 New Game Flow

Main Menu → New Game → Loading Screen → Solar System → Gameplay → Free Flight.

### 11.2 Continue Game Flow

Main Menu → Continue → Load Saved Progress → Loading Screen → Gameplay.

### 11.3 Planet Exploration Flow

Gameplay → Select Planet → Navigate to Planet → Enter Scanning Range → Scan Planet → View Planet Details → Save Discovery → Continue Exploration.

### 11.4 Warp Drive Flow

Gameplay → Galaxy Map → Select Star System → Activate Warp Drive → Warp Animation → Load Destination System → Gameplay.

### 11.5 Autopilot Flow

Gameplay → Select Destination → Activate Autopilot → Automatic Navigation → Arrive at Safe Distance → Deactivate Autopilot → Scan Planet.

### 11.6 Discovery Journal Flow

Gameplay → Open Discovery Journal → Select Planet → View Planet Details → Close Journal → Gameplay.

### 11.7 Save Game Flow

Gameplay → Autosave or Pause Menu → Save Progress → Return to Main Menu → Continue Game.

## 12. Non-Functional Requirements

| ID | Aspek | Requirement |
|---|---|---|
| NFR-01 | Performance | Target 60 FPS pada perangkat yang memadai dan minimal 30 FPS pada pengaturan grafis rendah pada perangkat pengujian yang sesuai. |
| NFR-02 | Compatibility | Mendukung browser desktop Chrome, Edge, dan Firefox yang kompatibel dengan WebGL 2. |
| NFR-03 | Loading | Pemuatan awal dan transisi sistem bintang harus dioptimalkan. |
| NFR-04 | Usability | Kontrol permainan mudah dipahami dan tersedia panduan bermain. |
| NFR-05 | Reliability | Progres permainan tersimpan secara konsisten. |
| NFR-06 | Optimization | Hanya sistem bintang aktif yang dirender. |
| NFR-07 | Maintainability | Kode JavaScript menggunakan struktur modular. |
| NFR-08 | Accessibility | Teks memiliki ukuran dan kontras yang memadai. |
| NFR-09 | Responsiveness | Mendukung berbagai resolusi layar desktop dan laptop. |
| NFR-10 | Deployment | Dapat dijalankan sebagai static website. |
| NFR-11 | Stability | Tidak terdapat error JavaScript yang mengganggu gameplay. |
| NFR-12 | Asset Management | Menggunakan aset dengan lisensi yang sesuai. |

## 13. Technology Stack

| Teknologi | Kegunaan |
|---|---|
| HTML5 | Struktur halaman dan canvas permainan. |
| CSS3 | Desain menu, HUD, layout, dan animasi antarmuka. |
| Vanilla JavaScript | Logika permainan dan interaksi. |
| Three.js | Rendering lingkungan tiga dimensi. |
| WebGL | Rendering grafis berbasis GPU. |
| LocalStorage | Penyimpanan progres pemain. |
| Web Audio API | Pengelolaan audio permainan. |
| JSON | Konfigurasi planet dan sistem bintang. |
| Vercel | Deployment static website. |

Beyond Orbit tidak membutuhkan React, Vue, backend, database, API eksternal berbayar, maupun game engine seperti Unity dan Unreal Engine.

## 14. System Architecture

Beyond Orbit menggunakan client-side architecture. Seluruh proses permainan berlangsung pada browser pemain.

Komponen utama sistem:

### 14.1 Presentation Layer

- HTML5.
- CSS3.
- Gameplay HUD.
- Main Menu.
- Galaxy Map.
- Discovery Journal.
- Settings.

### 14.2 Game Logic Layer

- Game controller.
- Flight system.
- Input controller.
- Navigation system.
- Planet scanner.
- Autopilot.
- Warp drive.
- Game state management.

### 14.3 Rendering Layer

- Three.js scene.
- WebGL renderer.
- Camera system.
- Planet models.
- Spaceship model.
- Lighting system.
- Particle system.
- Visual effects.

### 14.4 Data Layer

- JSON configuration.
- Planet data.
- Star system data.
- LocalStorage.
- Player progress.
- Game settings.

### 14.5 Audio Layer

- Background music.
- Sound effects.
- Volume management.
- Audio state management.

## 15. Project Structure

    beyond-orbit/
    |
    |-- index.html
    |-- README.md
    |
    |-- css/
    |   |-- main.css
    |   |-- menu.css
    |   |-- hud.css
    |
    |-- js/
    |   |-- main.js
    |   |-- game.js
    |   |-- spaceship.js
    |   |-- controls.js
    |   |-- camera.js
    |   |-- universe.js
    |   |-- planet.js
    |   |-- navigation.js
    |   |-- scanner.js
    |   |-- autopilot.js
    |   |-- warp.js
    |   |-- journal.js
    |   |-- audio.js
    |   |-- storage.js
    |   |-- ui.js
    |
    |-- data/
    |   |-- systems.json
    |   |-- planets.json
    |
    |-- assets/
        |-- models/
        |   |-- spaceship.glb
        |
        |-- textures/
        |   |-- planets/
        |   |-- environment/
        |
        |-- audio/
        |   |-- music/
        |   |-- effects/
        |
        |-- images/

Struktur project dapat disesuaikan selama tetap menggunakan pendekatan modular dan tidak menambahkan framework yang tidak diperlukan.

## 16. Performance Optimization

Untuk menjaga performa permainan, implementasikan:

- RequestAnimationFrame untuk game loop.
- Delta time untuk menjaga konsistensi pergerakan.
- Pembatasan delta time ketika browser kehilangan fokus.
- Texture caching.
- Geometry dan material reuse.
- Frustum culling.
- Level of Detail apabila diperlukan.
- InstancedMesh untuk asteroid.
- Particle quality adjustment.
- Pixel ratio limit.
- Lazy loading aset.
- Resource disposal ketika berpindah sistem bintang.
- Pembaruan HUD dengan frekuensi yang wajar.
- Pengaturan kualitas grafis.

Hanya satu rendering loop dan satu sistem bintang yang aktif dalam satu waktu.

## 17. Asset Requirements

### 17.1 Spaceship Assets

- Spaceship 3D model.
- Spaceship textures.
- Cockpit overlay.
- Engine glow.
- Exhaust particles.

### 17.2 Planet Assets

- Planet surface textures.
- Atmospheric effects.
- Planet ring textures.
- Moon textures.
- Cloud textures apabila diperlukan.

### 17.3 Environment Assets

- Starfield.
- Nebula textures.
- Asteroid models.
- Space particles.
- Warp drive effects.

### 17.4 Audio Assets

- Ambient space music.
- Engine sounds.
- Boost sounds.
- Warp sounds.
- Scanner sounds.
- UI sounds.

Seluruh aset harus menggunakan lisensi yang mengizinkan penggunaannya. Sumber dan lisensi aset dicantumkan dalam README.md.

Apabila aset tidak tersedia, gunakan procedural textures atau custom geometry sebagai alternatif.

## 18. Development Roadmap

### Phase 1 — Core Environment

- Inisialisasi Three.js.
- Implementasi scene, renderer, dan kamera.
- Implementasi starfield dan pencahayaan.
- Implementasi model pesawat.
- Implementasi kontrol penerbangan.
- Implementasi camera follow.

### Phase 2 — Solar System

- Implementasi Matahari.
- Implementasi delapan planet.
- Implementasi tekstur dan atmosfer planet.
- Implementasi rotasi dan orbit.
- Implementasi bulan dan asteroid.
- Implementasi collision detection.

### Phase 3 — Exploration System

- Implementasi Planet Scanner.
- Implementasi Navigation System.
- Implementasi Autopilot.
- Implementasi Camera System.
- Implementasi discovery tracking.

### Phase 4 — Galaxy Expansion

- Implementasi Alpha Centauri System.
- Implementasi Nebula Prime System.
- Implementasi Cryon System.
- Implementasi Vulcan System.
- Implementasi Galaxy Map.
- Implementasi Warp Drive.

### Phase 5 — User Interface

- Implementasi Main Menu.
- Implementasi Gameplay HUD.
- Implementasi Discovery Journal.
- Implementasi Planet Details.
- Implementasi Pause Menu.
- Implementasi Settings.
- Implementasi How to Play.
- Implementasi Loading Screen.

### Phase 6 — Game Polish

- Implementasi Audio System.
- Implementasi Cinematic Mode.
- Implementasi visual effects.
- Implementasi animasi.
- Implementasi LocalStorage.
- Optimasi performa permainan.

### Phase 7 — Testing & Deployment

- Pengujian kontrol penerbangan.
- Pengujian collision detection.
- Pengujian Planet Scanner.
- Pengujian Navigation System.
- Pengujian Autopilot.
- Pengujian Warp Drive.
- Pengujian Camera System.
- Pengujian Discovery Journal.
- Pengujian Settings.
- Pengujian Save & Load Progress.
- Pengujian kompatibilitas browser.
- Pengujian performa.
- Perbaikan bug.
- Deployment ke Vercel.

Seluruh tahapan merupakan bagian dari Beyond Orbit versi 1.0, bukan pemisahan antara fitur utama dan fitur opsional.

## 19. Acceptance Criteria

Game dinyatakan berhasil dikembangkan apabila memenuhi kriteria berikut:

- Game dapat dimainkan langsung melalui browser.
- Pesawat dapat dikendalikan secara bebas dalam lingkungan tiga dimensi.
- Kontrol penerbangan berjalan secara halus dan responsif.
- Terdapat lima sistem bintang.
- Terdapat 24 planet yang dapat dijelajahi.
- Setiap sistem bintang memiliki identitas visual yang berbeda.
- Planet memiliki tekstur, rotasi, dan orbit.
- Pesawat tidak dapat menembus permukaan planet.
- Planet Scanner berfungsi sesuai jangkauan pemindaian.
- Galaxy Map dapat digunakan secara interaktif.
- Warp Drive dapat memindahkan pemain antarsistem bintang.
- Navigation System menampilkan informasi secara konsisten.
- Autopilot dapat membawa pemain menuju planet dengan aman.
- First-person dan third-person camera berfungsi.
- Discovery Journal mencatat seluruh hasil pemindaian.
- Cinematic Mode dapat digunakan.
- Pause Menu berfungsi.
- Seluruh pengaturan permainan dapat digunakan.
- Audio System berfungsi.
- Progres permainan dapat disimpan dan dimuat kembali.
- Tidak terdapat tombol dummy atau fitur dekoratif yang tidak berfungsi.
- Tidak terdapat error JavaScript yang mengganggu gameplay.
- Game memenuhi target performa pada perangkat pengujian.
- Game dapat berjalan tanpa backend maupun database.
- Game dapat di-deploy sebagai static website.

## 20. Scope Limitations

Untuk menjaga pengembangan tetap sederhana dan sesuai dengan tujuan produk, Beyond Orbit tidak mencakup fitur berikut:

| Di Luar Cakupan | Alasan |
|---|---|
| Multiplayer | Membutuhkan infrastruktur server. |
| Combat System | Tidak sesuai dengan fokus eksplorasi. |
| Enemy Spaceships | Game tidak berfokus pada pertempuran. |
| Weapons System | Tidak diperlukan dalam gameplay. |
| Planet Landing | Membutuhkan sistem terrain tambahan. |
| Walking on Planet | Membutuhkan karakter dan lingkungan permukaan. |
| Fuel System | Menambah kompleksitas eksplorasi. |
| Survival System | Tidak sesuai dengan pengalaman bermain santai. |
| Health System | Tidak terdapat mekanisme pertarungan. |
| Inventory System | Tidak diperlukan dalam gameplay utama. |
| Trading System | Tidak terdapat sistem ekonomi. |
| Crafting System | Menambah kompleksitas yang tidak diperlukan. |
| Spaceship Shop | Game hanya menggunakan satu pesawat utama. |
| Authentication | Tidak diperlukan untuk single-player. |
| Database | Progres menggunakan LocalStorage. |
| Online Leaderboard | Tidak terdapat kompetisi antar pemain. |
| Realistic Orbital Physics | Membutuhkan simulasi fisika yang kompleks. |
| Infinite Procedural Galaxy | Menambah kompleksitas dan beban rendering. |
| AI Integration | Tidak diperlukan dalam fitur utama. |

Ukuran planet, jarak antarplanet, kecepatan perjalanan, dan orbit disederhanakan untuk menghasilkan pengalaman eksplorasi yang menyenangkan.

## 21. Product Success Metrics

Keberhasilan Beyond Orbit dapat dievaluasi berdasarkan:

- Seluruh fitur utama berhasil diimplementasikan.
- Seluruh sistem bintang dapat dikunjungi.
- Seluruh planet dapat ditemukan dan dipindai.
- Tidak terdapat bug kritis selama eksplorasi.
- Kontrol pesawat nyaman digunakan.
- Performa permainan stabil pada perangkat pengujian.
- Pengguna dapat memahami mekanisme permainan melalui panduan yang tersedia.
- Pengguna dapat menyimpan dan melanjutkan progres permainan.
- Visual dan audio mendukung pengalaman eksplorasi yang imersif.

## 22. Product Vision

Beyond Orbit dirancang sebagai game eksplorasi antariksa yang sederhana secara mekanisme, tetapi mengesankan secara visual dan pengalaman bermain.

Pemain tidak dituntut untuk menyelesaikan misi, mengalahkan musuh, atau bertahan hidup. Pemain diberikan kebebasan untuk mengendalikan pesawat, menjelajahi berbagai sistem bintang, menemukan planet, dan menikmati keindahan alam semesta dengan caranya sendiri.

Dengan menggunakan teknologi web yang sederhana, Beyond Orbit diharapkan dapat menghadirkan pengalaman eksplorasi antariksa yang menarik, mudah diakses, dan dapat dimainkan langsung melalui browser.

**Beyond Orbit — The universe is yours to explore.**
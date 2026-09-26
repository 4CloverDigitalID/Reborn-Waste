# Recycling Process Prototype — Vanilla HTML, CSS, JavaScript

## 1. Tujuan

Membuat ulang prototype proses daur ulang pada video menggunakan **vanilla HTML, CSS, dan JavaScript** tanpa React, Vue, Bootstrap, jQuery, atau framework/library UI lain.

Tampilan utama terdiri dari:

- background hijau dengan efek radial/ray,
- judul proses di bagian atas,
- kartu/deskripsi tahap,
- conveyor belt hitam dengan garis diagonal dan border kuning,
- ilustrasi tahap di atas conveyor,
- tombol **Selanjutnya**,
- menu pemilihan kategori:
  - Organik
  - Plastik
  - Kertas

Hal paling penting adalah animasi perpindahan tahap. **Organik, Plastik, dan Kertas harus memakai sistem animasi yang sama.**

---

# 2. Flow Prototype yang Terlihat di Video

## A. Halaman Pilihan Kategori

State awal/akhir menampilkan tiga tombol:

```text
[ Organik ] [ Plastik ] [ Kertas ]

Sampah Mana yang mau kamu lihat proses pengolahannya
```

Ketika user memilih kategori:

1. menu kategori disembunyikan,
2. judul proses muncul,
3. deskripsi tahap pertama muncul,
4. gambar tahap pertama muncul di tengah conveyor,
5. tombol **Selanjutnya** muncul.

---

# 3. Flow Organik

Urutan secara konsep:

```text
Menu
  ↓
Organik — Tahap 1
Pengumpulan sampah organik
  ↓ Selanjutnya
Tahap 2
Pemilahan
  ↓ Selanjutnya
Tahap 3
Pencacahan
  ↓ Selanjutnya
Tahap 4
Hasil pengolahan / kompos
  ↓ Selanjutnya
Kembali ke Menu
```

Pada video, transisi Organik menjadi referensi utama untuk seluruh kategori.

---

# 4. Flow Plastik

Gunakan **animasi yang identik dengan Organik** setiap kali tombol **Selanjutnya** ditekan.

Urutan:

```text
Menu
  ↓
Plastik — Tahap 1
Pengumpulan sampah plastik
  ↓
Tahap 2
Pemilahan plastik yang dapat dan tidak dapat didaur ulang
  ↓
Tahap 3
Pencucian
  ↓
Tahap 4
Pencacahan
  ↓
Tahap 5
Pelelehan / pengolahan hasil cacahan
  ↓
Tahap 6
Hasil cetakan / produk baru
  ↓
Kembali ke Menu
```

---

# 5. Flow Kertas

Gunakan **animasi yang identik dengan Organik** setiap kali tombol **Selanjutnya** ditekan.

Urutan:

```text
Menu
  ↓
Kertas — Tahap 1
Pengumpulan sampah kertas
  ↓
Tahap 2
Pemilahan kertas
  ↓
Tahap 3
Pencacahan / pemotongan
  ↓
Tahap 4
Pembuatan pulp dengan campuran kertas dan air
  ↓
Tahap 5
Pencetakan dan pengeringan pulp menjadi kertas baru
  ↓
Kembali ke Menu
```

---

# 6. Perbaikan dari Prototype Video

Pada video, setelah memilih **Plastik** dan **Kertas**, heading masih terlihat sebagai:

```text
Proses Daur Ulang Sampah Organik
```

Implementasi final harus membuat judul dinamis:

```text
Organik → Proses Daur Ulang Sampah Organik
Plastik → Proses Daur Ulang Sampah Plastik
Kertas  → Proses Daur Ulang Sampah Kertas
```

Jangan hard-code judul Organik pada halaman proses.

---

# 7. Animasi Tombol "Selanjutnya"

Ini adalah behavior terpenting.

Ketika tombol **Selanjutnya** diklik:

```text
CURRENT OBJECT
center
  ↓
bergerak menuju kanan
  ↓
keluar dari conveyor

NEXT OBJECT
mulai dari luar sisi kiri
  ↓
bergerak masuk dari kiri
  ↓
berhenti tepat di tengah conveyor
```

Deskripsi juga berganti pada transisi yang sama.

Visual flow:

```text
BEFORE CLICK

               [ current-object ]
---------------------------------------------------->


DURING TRANSITION

                           [ current-object ] ----->

<----- [ next-object ]


AFTER TRANSITION

               [ next-object ]
---------------------------------------------------->
```

### Timing yang direkomendasikan

```text
0 ms
User klik "Selanjutnya"

0–350 ms
- current image slide ke kanan
- current description fade out

120–500 ms
- next image mulai masuk dari kiri
- next description fade in

500 ms
- next image berhenti di tengah
- button aktif kembali
```

Gunakan sekitar:

```css
transition-duration: 450ms;
transition-timing-function: cubic-bezier(.22, .8, .25, 1);
```

Jangan langsung mengganti `src` gambar saat berada di posisi tengah karena akan terlihat seperti image swap biasa.

---

# 8. State Animation

Gunakan class CSS berikut:

```text
.step-image
.step-image.enter-from-left
.step-image.center
.step-image.exit-to-right

.step-description
.step-description.fade-out
.step-description.fade-in
```

Contoh konsep CSS:

```css
.step-image {
  position: absolute;
  left: 50%;
  top: 50%;
  width: clamp(70px, 10vw, 140px);
  transform: translate(-50%, -50%);
  transition:
    transform 450ms cubic-bezier(.22, .8, .25, 1),
    opacity 250ms ease;
}

.step-image.enter-from-left {
  transform: translate(-350%, -50%);
  opacity: 0;
}

.step-image.center {
  transform: translate(-50%, -50%);
  opacity: 1;
}

.step-image.exit-to-right {
  transform: translate(250%, -50%);
  opacity: 0;
}

.step-description {
  transition:
    opacity 250ms ease,
    transform 300ms ease;
}

.step-description.fade-out {
  opacity: 0;
  transform: translateY(-5px);
}

.step-description.fade-in {
  opacity: 1;
  transform: translateY(0);
}
```

---

# 9. Struktur Folder

Gunakan struktur sederhana:

```text
recycling-prototype/
│
├── index.html
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
└── assets/
    ├── bg/
    │   └── recycling-bg.webp
    │
    ├── organic/
    │   ├── step-1.png
    │   ├── step-2.png
    │   ├── step-3.png
    │   └── step-4.png
    │
    ├── plastic/
    │   ├── step-1.png
    │   ├── step-2.png
    │   ├── step-3.png
    │   ├── step-4.png
    │   ├── step-5.png
    │   └── step-6.png
    │
    └── paper/
        ├── step-1.png
        ├── step-2.png
        ├── step-3.png
        ├── step-4.png
        └── step-5.png
```

---

# 10. HTML Structure

Satu halaman saja.

Tidak perlu membuat halaman HTML terpisah untuk setiap kategori.

Struktur yang direkomendasikan:

```html
<main class="recycling-app">

  <section id="category-screen">
    <div class="category-buttons">
      <button data-category="organic">Organik</button>
      <button data-category="plastic">Plastik</button>
      <button data-category="paper">Kertas</button>
    </div>

    <p>
      Sampah Mana yang mau kamu lihat proses pengolahannya
    </p>
  </section>

  <section id="process-screen" hidden>

    <h1 id="process-title"></h1>

    <div class="description-box">
      <p id="step-description"></p>
    </div>

    <div class="conveyor">
      <div id="step-stage"></div>
    </div>

    <button id="next-button">
      Selanjutnya
    </button>

  </section>

</main>
```

---

# 11. Conveyor Belt

Conveyor di video terlihat:

- background hitam,
- pola diagonal,
- garis kuning atas dan bawah,
- ilustrasi berada tepat di tengah.

Contoh:

```css
.conveyor {
  position: relative;
  height: 110px;
  overflow: hidden;

  border-top: 3px solid #d7b900;
  border-bottom: 3px solid #d7b900;

  background:
    repeating-linear-gradient(
      -55deg,
      #111 0,
      #111 7px,
      #242424 7px,
      #242424 9px
    );
}
```

`overflow: hidden` wajib supaya image yang slide keluar kanan/kiri tidak terlihat di luar conveyor.

---

# 12. Data Harus Disimpan di JavaScript

Jangan membuat logic berbeda untuk Organik, Plastik, dan Kertas.

Semua kategori menggunakan **renderer + transition function yang sama**.

Contoh data:

```js
const processes = {
  organic: {
    title: "Proses Daur Ulang Sampah Organik",
    steps: [
      {
        text: "Sampah organik dikumpulkan dari sisa makanan, tanaman, dan daun.",
        image: "assets/organic/step-1.png"
      },
      {
        text: "Sampah kemudian dipilah sesuai jenisnya.",
        image: "assets/organic/step-2.png"
      },
      {
        text: "Sampah dicacah menjadi bagian yang lebih kecil.",
        image: "assets/organic/step-3.png"
      },
      {
        text: "Sampah diolah hingga menjadi kompos yang dapat digunakan kembali.",
        image: "assets/organic/step-4.png"
      }
    ]
  },

  plastic: {
    title: "Proses Daur Ulang Sampah Plastik",
    steps: [
      {
        text: "Sampah plastik dikumpulkan.",
        image: "assets/plastic/step-1.png"
      },
      {
        text: "Plastik dipilah berdasarkan jenis yang dapat didaur ulang.",
        image: "assets/plastic/step-2.png"
      },
      {
        text: "Plastik dicuci sampai bersih.",
        image: "assets/plastic/step-3.png"
      },
      {
        text: "Plastik dicacah menjadi ukuran yang lebih kecil.",
        image: "assets/plastic/step-4.png"
      },
      {
        text: "Hasil cacahan dilelehkan untuk proses pencetakan.",
        image: "assets/plastic/step-5.png"
      },
      {
        text: "Plastik dibentuk menjadi produk baru.",
        image: "assets/plastic/step-6.png"
      }
    ]
  },

  paper: {
    title: "Proses Daur Ulang Sampah Kertas",
    steps: [
      {
        text: "Sampah kertas dikumpulkan.",
        image: "assets/paper/step-1.png"
      },
      {
        text: "Kertas dipilah sebelum diproses.",
        image: "assets/paper/step-2.png"
      },
      {
        text: "Kertas dicacah menjadi potongan kecil.",
        image: "assets/paper/step-3.png"
      },
      {
        text: "Potongan kertas dicampur dengan air hingga menjadi pulp.",
        image: "assets/paper/step-4.png"
      },
      {
        text: "Pulp dicetak dan dikeringkan menjadi lembaran kertas baru.",
        image: "assets/paper/step-5.png"
      }
    ]
  }
};
```

Teks final boleh disesuaikan dengan copy di desain asli.

---

# 13. Global Application State

Cukup simpan:

```js
let activeCategory = null;
let currentStep = 0;
let isAnimating = false;
```

Fungsi utama:

```js
showCategoryMenu()
startProcess(category)
renderInitialStep()
goToNextStep()
animateStepChange()
finishProcess()
```

---

# 14. Behavior `startProcess()`

Saat tombol kategori diklik:

```js
function startProcess(category) {
  activeCategory = category;
  currentStep = 0;

  // hide menu
  // show process screen
  // update process title
  // show first description
  // create first image in center
}
```

Judul diambil dari:

```js
processes[activeCategory].title
```

bukan dari string hard-coded.

---

# 15. Logic Tombol Selanjutnya

Pseudo flow:

```js
async function goToNextStep() {
  if (isAnimating) return;

  const process = processes[activeCategory];

  if (currentStep === process.steps.length - 1) {
    finishProcess();
    return;
  }

  isAnimating = true;

  await animateStepChange(
    process.steps[currentStep],
    process.steps[currentStep + 1]
  );

  currentStep++;

  isAnimating = false;
}
```

Ini membuat ketiga kategori otomatis memakai behavior yang sama.

---

# 16. Cara Membuat Transisi Dua Gambar

Agar sama seperti video, lebih bagus memakai dua `<img>` selama transisi:

```text
currentImage = gambar yang sekarang
nextImage    = gambar tahap berikutnya
```

Urutan:

```js
1. Ambil current image.
2. Buat next image.
3. next image diberi class `enter-from-left`.
4. Append next image ke conveyor.
5. Trigger animation frame.
6. current image → `exit-to-right`.
7. next image → `center`.
8. Fade-out description lama.
9. Ganti text.
10. Fade-in description baru.
11. Tunggu animation selesai.
12. Remove current image.
```

Contoh pattern:

```js
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateStepChange(current, next) {
  const stage = document.querySelector("#step-stage");
  const description = document.querySelector("#step-description");

  const oldImage = stage.querySelector(".step-image");

  const newImage = document.createElement("img");
  newImage.src = next.image;
  newImage.alt = "";
  newImage.className = "step-image enter-from-left";

  stage.appendChild(newImage);

  description.classList.add("fade-out");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      oldImage.classList.remove("center");
      oldImage.classList.add("exit-to-right");

      newImage.classList.remove("enter-from-left");
      newImage.classList.add("center");
    });
  });

  await wait(180);

  description.textContent = next.text;
  description.classList.remove("fade-out");
  description.classList.add("fade-in");

  await wait(320);

  oldImage.remove();
  description.classList.remove("fade-in");
}
```

---

# 17. Prevent Double Click

Saat animasi berjalan user tidak boleh dapat memicu step lain.

Gunakan:

```js
if (isAnimating) return;
```

dan optionally:

```js
nextButton.disabled = true;
```

setelah selesai:

```js
nextButton.disabled = false;
```

Ini mencegah:

- gambar bertumpuk,
- index meloncat,
- animasi rusak,
- user melewati dua step sekaligus.

---

# 18. Step Terakhir

Pada step terakhir, tombol masih boleh bertuliskan:

```text
Selanjutnya
```

Sesuai prototype.

Ketika diklik:

```text
step terakhir
  ↓
fade / exit
  ↓
process screen hidden
  ↓
category menu visible
```

Reset state:

```js
activeCategory = null;
currentStep = 0;
isAnimating = false;
```

---

# 19. Category Menu Transition

Ketika kembali ke menu:

```text
process title
description
image
next button
       ↓ fade out
category buttons
       ↓ fade in
```

Durasi sekitar:

```text
250–400 ms
```

Tidak perlu reload browser.

---

# 20. Background dan Layout

Halaman prototype mempunyai look seperti panel game/interactive education.

Gunakan full container:

```css
.recycling-app {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}
```

Background dapat menggunakan asset sendiri:

```css
.recycling-app {
  background:
    linear-gradient(
      rgba(0, 130, 100, .72),
      rgba(0, 210, 155, .72)
    ),
    url("../assets/bg/recycling-bg.webp");

  background-size: cover;
  background-position: center;
}
```

Jika tidak mempunyai gambar background, efek radial bisa dibuat dengan CSS gradient.

---

# 21. Description Card

Card teks harus semi transparan seperti prototype:

```css
.description-box {
  width: min(520px, 80vw);
  margin-inline: auto;

  padding: 12px 24px;

  border: 2px solid rgba(90, 255, 215, .8);
  border-radius: 14px;

  background: rgba(0, 100, 80, .15);
  backdrop-filter: blur(3px);
}
```

---

# 22. Tombol Selanjutnya

Style:

```css
#next-button {
  padding: 12px 32px;

  border: 2px solid rgba(100, 255, 210, .9);
  border-radius: 12px;

  color: white;
  background: rgba(0, 210, 150, .25);

  cursor: pointer;

  box-shadow:
    0 0 8px rgba(80, 255, 210, .6),
    inset 0 0 8px rgba(80, 255, 210, .2);

  transition:
    transform 150ms ease,
    background 150ms ease,
    box-shadow 150ms ease;
}

#next-button:hover {
  transform: scale(1.03);
}

#next-button:active {
  transform: scale(.97);
}
```

---

# 23. Responsive

Prototype harus tetap usable pada desktop, tablet, dan mobile.

Gunakan:

```css
width: min(...);
clamp(...);
```

Hindari position menggunakan pixel absolut untuk layout utama.

Yang boleh absolute:

- image object di conveyor,
- decorative layer,
- effect background.

Yang sebaiknya memakai flex/grid:

- title,
- description,
- category controls,
- next button,
- vertical layout keseluruhan.

---

# 24. Accessibility

Tambahkan:

```html
<button type="button">
```

Semua tombol harus bisa dipakai dengan keyboard.

Ilustrasi dekoratif bisa menggunakan:

```html
alt=""
```

Jika ilustrasi membawa informasi penting, gunakan alt sesuai tahap.

Untuk user dengan reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

---

# 25. Acceptance Criteria

Implementasi dianggap selesai jika:

- [ ] Hanya menggunakan HTML, CSS, dan JavaScript vanilla.
- [ ] Terdapat pilihan Organik, Plastik, dan Kertas.
- [ ] Memilih kategori membuka proses kategori tersebut.
- [ ] Judul berubah sesuai kategori aktif.
- [ ] Setiap kategori mempunyai data step sendiri.
- [ ] Tombol Selanjutnya mengubah satu step setiap klik.
- [ ] Objek lama slide keluar ke kanan.
- [ ] Objek berikutnya masuk dari kiri.
- [ ] Deskripsi ikut berubah menggunakan fade transition.
- [ ] Animasi Plastik sama dengan Organik.
- [ ] Animasi Kertas sama dengan Organik.
- [ ] Double-click tidak membuat step loncat.
- [ ] Setelah step terakhir, user kembali ke menu kategori.
- [ ] Tidak terjadi reload page saat berpindah kategori/step.
- [ ] Layout responsive.
- [ ] Conveyor menggunakan `overflow: hidden`.
- [ ] Tidak ada framework atau library eksternal yang diperlukan.

---

# 26. Prinsip Implementasi

Jangan menulis seperti ini:

```js
if (category === "organic") {
  // animation A
}

if (category === "plastic") {
  // animation B
}

if (category === "paper") {
  // animation C
}
```

Gunakan:

```text
ONE DATA STRUCTURE
        +
ONE RENDERER
        +
ONE TRANSITION ENGINE
        ↓
ORGANIC / PLASTIC / PAPER
```

Dengan cara ini animasi ketiganya dijamin konsisten.

---

# 27. Final Interaction Map

```text
                    ┌──────────────┐
                    │ CATEGORY MENU│
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          ORGANIC       PLASTIC        PAPER
             │             │             │
             ▼             ▼             ▼
          STEP 1          STEP 1        STEP 1
             │             │             │
         NEXT + ANIM   NEXT + ANIM   NEXT + ANIM
             │             │             │
             ▼             ▼             ▼
          STEP N          STEP N        STEP N
             │             │             │
             └─────── NEXT / END ───────┘
                           │
                           ▼
                    CATEGORY MENU
```

The core rule is:

> **Every click of "Selanjutnya" in Organik, Plastik, and Kertas must call the exact same animation function. Only the step data and image assets are different.**

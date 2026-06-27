# 💰 Kalkulator Nilai Sampah Daur Ulang

## Deskripsi
Fitur interaktif untuk menghitung estimasi nilai ekonomis sampah yang dapat didaur ulang berdasarkan jenis dan berat sampah. Tool ini dirancang sederhana, tanpa butuh backend, hanya menggunakan HTML, CSS, dan vanilla JavaScript.

---

## 📋 Konsep Dasar

### Input User
- **Dropdown Jenis Sampah**: Pilih dari 7 kategori sampah dengan harga per kg yang sudah ditentukan
- **Input Berat**: User memasukkan berat sampah dalam kg
- **Tombol Hitung**: Trigger untuk kalkulasi

### Output Hasil
- **Jenis Sampah**: Nama sampah yang dipilih
- **Berat**: Jumlah kg yang diinput
- **Harga/kg**: Harga per kilogram sesuai jenis
- **Estimasi Nilai**: Hasil perkalian (Berat × Harga/kg)
- **Kategori**: Penggolongan sampah (Anorganik, dll)
- **Manfaat Daur Ulang**: Penjelasan singkat tentang kegunaan sampah tersebut setelah didaur ulang

---

## 🗂️ Struktur Data

### Tabel Data Sampah
```javascript
const dataSampah = [
  {
    id: 1,
    nama: "Plastik Campuran",
    hargaPerKg: 2000,
    kategori: "Anorganik",
    manfaat: "Dapat dibuat tas, wadah, atau dipellet plastik baru"
  },
  {
    id: 2,
    nama: "Botol Plastik PET",
    hargaPerKg: 4000,
    kategori: "Anorganik",
    manfaat: "Dapat didaur ulang menjadi serat tekstil, pot tanaman, atau produk plastik baru"
  },
  {
    id: 3,
    nama: "Kardus",
    hargaPerKg: 1500,
    kategori: "Anorganik",
    manfaat: "Dapat dibuat kertas daur ulang, papan, atau bahan kemasan baru"
  },
  {
    id: 4,
    nama: "Kertas",
    hargaPerKg: 1000,
    kategori: "Anorganik",
    manfaat: "Dapat diproses menjadi kertas baru atau produk pulp"
  },
  {
    id: 5,
    nama: "Kaleng Aluminium",
    hargaPerKg: 8000,
    kategori: "Anorganik",
    manfaat: "Dapat dimelt ulang menjadi kaleng baru, komponen otomotif, atau peralatan rumah tangga"
  },
  {
    id: 6,
    nama: "Besi Bekas",
    hargaPerKg: 3000,
    kategori: "Anorganik",
    manfaat: "Dapat dipeletin atau dijual ke industri konstruksi dan manufaktur"
  },
  {
    id: 7,
    nama: "Kaca",
    hargaPerKg: 500,
    kategori: "Anorganik",
    manfaat: "Dapat dilebur ulang menjadi botol, kontainer, atau material dekoratif"
  }
];
```

---

## ⚙️ Logic Kalkulasi

### Fungsi Utama: `hitungNilaiSampah()`

```javascript
function hitungNilaiSampah() {
  // 1. Ambil nilai dari dropdown dan input
  const jenisSampahId = document.getElementById("jenisSampah").value;
  const beratKg = parseFloat(document.getElementById("beratSampah").value);
  
  // 2. Validasi input
  if (!jenisSampahId || !beratKg || beratKg <= 0) {
    alert("Silakan pilih jenis sampah dan masukkan berat yang valid!");
    return;
  }
  
  // 3. Cari data sampah dari array
  const sampah = dataSampah.find(s => s.id == jenisSampahId);
  
  // 4. Hitung nilai
  const nilaiTotal = beratKg * sampah.hargaPerKg;
  
  // 5. Format currency ke Rupiah
  const nilaiFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(nilaiTotal);
  
  // 6. Tampilkan hasil
  tampilkanHasil(sampah, beratKg, nilaiFormatted);
}
```

### Fungsi Tampil Hasil: `tampilkanHasil()`

```javascript
function tampilkanHasil(sampah, berat, nilai) {
  const hasilDiv = document.getElementById("hasil");
  
  hasilDiv.innerHTML = `
    <div class="hasil-card">
      <h3>📊 Hasil Kalkulasi</h3>
      <div class="hasil-grid">
        <div class="hasil-item">
          <label>Jenis Sampah</label>
          <p>${sampah.nama}</p>
        </div>
        <div class="hasil-item">
          <label>Berat</label>
          <p>${berat} kg</p>
        </div>
        <div class="hasil-item">
          <label>Harga/kg</label>
          <p>Rp${sampah.hargaPerKg.toLocaleString('id-ID')}</p>
        </div>
        <div class="hasil-item hasil-nilai">
          <label>Estimasi Nilai</label>
          <p class="nilai-besar">${nilai}</p>
        </div>
        <div class="hasil-item">
          <label>Kategori</label>
          <p>${sampah.kategori}</p>
        </div>
      </div>
      
      <div class="manfaat-section">
        <h4>♻️ Manfaat Daur Ulang</h4>
        <p>${sampah.manfaat}</p>
      </div>
    </div>
  `;
  
  hasilDiv.style.display = "block";
}
```

---

## 🎨 Struktur HTML

```html
<section class="kalkulator-sampah">
  <h2>💰 Kalkulator Nilai Sampah Daur Ulang</h2>
  <p class="deskripsi">
    Hitung estimasi nilai ekonomis sampah yang dapat didaur ulang berdasarkan jenis dan berat sampah.
  </p>
  
  <div class="form-container">
    <div class="form-group">
      <label for="jenisSampah">Jenis Sampah:</label>
      <select id="jenisSampah">
        <option value="">-- Pilih Jenis Sampah --</option>
        <option value="1">Plastik Campuran</option>
        <option value="2">Botol Plastik PET</option>
        <option value="3">Kardus</option>
        <option value="4">Kertas</option>
        <option value="5">Kaleng Aluminium</option>
        <option value="6">Besi Bekas</option>
        <option value="7">Kaca</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="beratSampah">Berat (kg):</label>
      <input 
        type="number" 
        id="beratSampah" 
        placeholder="Masukkan berat sampah" 
        min="0.1" 
        step="0.1"
      >
    </div>
    
    <button class="btn-hitung" onclick="hitungNilaiSampah()">
      🧮 Hitung
    </button>
  </div>
  
  <div id="hasil" class="hasil-container" style="display: none;"></div>
</section>
```

---

## 🎯 Styling CSS (Flexbox-based)

```css
.kalkulator-sampah {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  color: #fff;
}

.kalkulator-sampah h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.deskripsi {
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  opacity: 0.95;
  line-height: 1.5;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group select,
.form-group input {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  background: #fff;
  color: #333;
  font-family: inherit;
}

.form-group select:focus,
.form-group input:focus {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

.btn-hitung {
  padding: 0.85rem 1.5rem;
  background: #ffd700;
  color: #333;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-hitung:hover {
  background: #ffed4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.btn-hitung:active {
  transform: translateY(0);
}

.hasil-container {
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hasil-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hasil-card h3 {
  margin: 0 0 1.2rem 0;
  font-size: 1.3rem;
  text-align: center;
}

.hasil-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.hasil-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.hasil-item label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.hasil-item p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.hasil-nilai p.nilai-besar {
  font-size: 1.5rem;
  color: #ffd700;
  font-weight: 700;
}

.manfaat-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #ffd700;
}

.manfaat-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.manfaat-section p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.95;
}

/* Responsive */
@media (max-width: 768px) {
  .kalkulator-sampah {
    padding: 1.5rem;
  }
  
  .form-container {
    padding: 1rem;
  }
  
  .hasil-grid {
    grid-template-columns: 1fr;
  }
  
  .hasil-item p {
    font-size: 1rem;
  }
}
```

---

## 📱 Implementasi Checklist

- [ ] **Data Structure**: Copy `dataSampah` array ke file JavaScript
- [ ] **HTML**: Implementasikan form input dan hasil container
- [ ] **JavaScript**:
  - [ ] Copy `hitungNilaiSampah()` function
  - [ ] Copy `tampilkanHasil()` function
  - [ ] Setup event listener untuk tombol (atau inline onclick)
- [ ] **CSS**: Styling sesuai desain di atas atau custom sesui brand
- [ ] **Testing**: Test dengan berbagai input (edge cases, nilai besar, dll)
- [ ] **Mobile**: Cek responsive di mobile viewport

---

## 💡 Tips Implementasi

### 1. **Integrasi ke Carousel Existing**
Tambahkan sebagai slide baru atau section terpisah di halaman waste data:

```html
<div class="slide">
  <!-- Content carousel lama -->
</div>

<div class="slide" id="kalkulator-slide">
  <!-- Kalkulator Sampah -->
</div>
```

### 2. **Enhanced Features (Opsional)**
- Tambah history kalkulasi dengan localStorage
- Tombol reset untuk clear form dan hasil
- Breakdown biaya sampah (harga per kategori)
- Estimasi pendapatan tahunan berdasarkan input bulanan

### 3. **Validasi Input Tambahan**
```javascript
// Cek berat maksimal (misalnya 1000 kg)
if (beratKg > 1000) {
  alert("Berat sampah terlalu besar, maksimal 1000 kg");
  return;
}

// Cek desimal (maksimal 2 desimal)
if (beratKg % 0.01 !== 0) {
  alert("Gunakan maksimal 2 desimal untuk berat");
  return;
}
```

### 4. **Styling Override**
Kalau warna gradient tidak sesuai tema, ubah di `background` property:
```css
/* Contoh warna lain */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); /* Green */
background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); /* Warm */
```

---

## 📊 Contoh Kasus Penggunaan

**User Input:**
- Jenis: Botol Plastik PET
- Berat: 5 kg

**Output:**
- Jenis Sampah: Botol Plastik PET
- Berat: 5 kg
- Harga/kg: Rp4.000
- **Estimasi Nilai: Rp20.000**
- Kategori: Anorganik
- Manfaat: Dapat didaur ulang menjadi serat tekstil, pot tanaman, atau produk plastik baru

---

## 🚀 Kesimpulan

Fitur ini **sangat cocok** untuk website sampah kamu karena:
✅ Interaktif dan engaging  
✅ No backend needed  
✅ Simple, clean UI  
✅ Educational value (manfaat daur ulang)  
✅ Responsive dan mobile-friendly  
✅ Mudah di-customize sesuai kebutuhan  

Selamat coding! 🎉
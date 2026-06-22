# 📄 Weather Cow — รายงานเทคนิคฉบับสมบูรณ์

> เอกสารอธิบายรายละเอียดเทคนิคทั้งหมดของ **Weather Cow Web Interface** — ครอบคลุมเทคโนโลยี, ระบบค้นหา, แอนิเมชัน, และทุก Package/Library ที่ใช้

---

## 📌 สรุปโปรเจกต์

**Weather Cow** เดิมเป็น CLI Application ที่ดึงข้อมูลสภาพอากาศจาก API แสดงผลใน Terminal ผ่านตัววัว (cowsay) ตอนนี้เพิ่ม **Web Interface** ให้ค้นหาสภาพอากาศได้ผ่าน Browser

---

## 📦 Package & Library ที่ใช้ทั้งหมด

### Dependencies ใน package.json

| Package | เวอร์ชัน | ใช้ที่ไหน | หน้าที่ | เหตุผลที่เลือก |
|---|---|---|---|---|
| **express** | ^5.2.1 | `server.js` | Web server + API endpoint | เบา ง่าย ใช้กับ Node.js ได้เลย ไม่ต้อง setup ซับซ้อน มี community ใหญ่ |
| **node-fetch** | ^3.3.2 | `server.js` | HTTP client ดึงข้อมูลจาก wttr.in API | มีอยู่เดิมแล้ว ใช้เหมือน browser fetch API |
| **chalk** | ^5.6.2 | `index.js` (CLI) | ใส่สีข้อความใน terminal | ใช้กับ CLI เดิม ไม่ได้ใช้ในเว็บ |
| **cowsay** | ^1.6.0 | `index.js` (CLI) | สร้าง ASCII วัวพูดใน terminal | ใช้กับ CLI เดิม — ในเว็บเขียน function เองแทน |

### External Resources (ไม่ต้อง install)

| Resource | ใช้ที่ไหน | หน้าที่ | เหตุผลที่เลือก |
|---|---|---|---|
| **Google Fonts (Inter)** | `index.html` | font สำหรับ UI ทั้งหน้า | Inter อ่านง่าย modern มี weight หลายระดับ |
| **wttr.in API** | `server.js` | ข้อมูลสภาพอากาศ | ฟรี ไม่ต้อง API Key รองรับทั่วโลก |
| **Fetch API (Browser)** | `app.js` | เรียก API จาก client | built-in ใน browser ไม่ต้องติดตั้ง |

### Built-in Node.js Modules

| Module | ใช้ที่ไหน | หน้าที่ |
|---|---|---|
| `url` (fileURLToPath) | `server.js` | แปลง import.meta.url เป็น file path |
| `path` (dirname, join) | `server.js` | สร้าง path ไปยังโฟลเดอร์ public/ |

---

## 🔍 ระบบค้นหา (Search System) — อธิบายละเอียด

### ภาพรวมการทำงาน

```
ผู้ใช้พิมพ์ชื่อเมือง → กดปุ่ม/Enter → app.js ส่ง request → server.js → wttr.in API
                                                                    ↓
                         แสดงผลบนหน้าเว็บ ← app.js render ← JSON response
```

### ขั้นตอนที่ 1: UI ช่องค้นหา (HTML)

```html
<div class="search-box">
    <div class="search-icon">🔍</div>
    <input type="text" id="city-input" placeholder="ພິມຊື່ເມືອງ...">
    <button id="search-btn" onclick="searchWeather()">ຄົ້ນຫາ</button>
</div>
```

- **search-box**: กล่องค้นหาใช้ Flexbox จัดเรียง icon + input + button ในแนวนอน
- **city-input**: ช่อง input ไม่มี border/background เพื่อให้กลมกลืนกับ search-box
- **search-btn**: ปุ่มมี gradient สีสวย `linear-gradient(135deg, #00d4ff, #a855f7, #ec4899)`

### ขั้นตอนที่ 2: CSS เอฟเฟกต์ของ Search Box

```css
/* ปกติ: กล่องมี glassmorphism effect */
.search-box {
    background: rgba(255, 255, 255, 0.04);     /* พื้นหลังโปร่งแสง */
    border: 1px solid rgba(255, 255, 255, 0.08); /* ขอบบางๆ */
    border-radius: 28px;                        /* มุมมน pill shape */
    backdrop-filter: blur(20px);                /* เบลอพื้นหลัง = glassmorphism */
}

/* เวลา focus: เปลี่ยนสีขอบ + เพิ่มเงา glow */
.search-box:focus-within {
    border-color: #00d4ff;                      /* ขอบเป็นสี cyan */
    box-shadow: 0 0 0 3px rgba(0,212,255,0.15); /* เงา glow รอบกล่อง */
}
```

- `:focus-within` = CSS pseudo-class ที่ทำงานเมื่อ **element ลูก** (input) ถูก focus → ทำให้กล่องทั้งอันเรืองแสง

### ขั้นตอนที่ 3: JavaScript — เมื่อกดค้นหา

```javascript
// 1. ผู้ใช้กดปุ่ม → เรียก searchWeather()
async function searchWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return;           // ถ้าว่างเปล่า ไม่ทำอะไร
    await fetchAndDisplay(city);  // ส่งต่อไป fetch ข้อมูล
}

// 2. ส่ง request ไป server
async function fetchAndDisplay(city) {
    // แสดง loading animation (วัวหมุน)
    loading.classList.add('active');
    
    // เรียก API: GET /api/weather/Bangkok
    const res = await fetch(`/api/weather/${encodeURIComponent(city)}`);
    const data = await res.json();
    
    // ซ่อน loading → แสดงผลลัพธ์
    renderWeather(data);
}
```

- `encodeURIComponent(city)` = เข้ารหัสชื่อเมืองที่มีช่องว่าง/อักขระพิเศษ เช่น "New York" → "New%20York"
- ใช้ `async/await` = รอข้อมูลแบบ non-blocking ไม่ทำให้หน้าเว็บค้าง

### ขั้นตอนที่ 4: Backend API (server.js)

```javascript
app.get('/api/weather/:city', async (req, res) => {
    const { city } = req.params;                    // รับชื่อเมือง
    const url = `https://wttr.in/${city}?format=j1`; // สร้าง URL ไป wttr.in
    const response = await fetch(url);               // ดึงข้อมูล
    const data = await response.json();              // แปลงเป็น JSON
    
    // ส่งเฉพาะข้อมูลที่ต้องการกลับไป
    res.json({
        city, current: { temp, desc, humidity, ... },
        forecast: [ ... 3 วัน ... ]
    });
});
```

- **ทำไมไม่เรียก wttr.in ตรงจาก browser?** → เพราะ wttr.in ไม่รองรับ CORS บางกรณี ผ่าน server กลางช่วยแก้ปัญหานี้ + กรองข้อมูลก่อนส่ง

### ขั้นตอนที่ 5: Quick Search Buttons

```html
<span class="quick-city" onclick="quickSearch('Vientiane')">🇱🇦 Vientiane</span>
<span class="quick-city" onclick="quickSearch('Bangkok')">🇹🇭 Bangkok</span>
```

```javascript
async function quickSearch(city) {
    document.getElementById('city-input').value = city; // ใส่ชื่อเมืองใน input
    await fetchAndDisplay(city);                        // ค้นหาเลย
}
```

- **ทำไมมี Quick Search?** → ให้ผู้ใช้กดค้นหาเมืองยอดนิยมได้ทันทีโดยไม่ต้องพิมพ์

### รองรับ Enter Key

```javascript
document.getElementById('city-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchWeather();
});
```

- ผูก event listener กับ input → เมื่อกด Enter ก็ค้นหาเลย ไม่ต้องคลิกปุ่ม

---

## 🐄 โลโก้วัว — Animation ยกขึ้นโยกลง (อธิบายละเอียด)

### HTML ของโลโก้

```html
<div class="logo">
    <span class="logo-emoji">🐄</span>  <!-- ตัว emoji วัว -->
    <div>
        <h1>Weather Cow</h1>
        <p class="subtitle">ກວດສອບສະພາບອາກາດງ່າຍໆ ກັບໝູ່ງົວ</p>
    </div>
</div>
```

### CSS Animation — cowBounce

```css
.logo-emoji {
    font-size: 52px;
    animation: cowBounce 3s ease-in-out infinite;
    filter: drop-shadow(0 4px 20px rgba(0,212,255,0.3));
}

@keyframes cowBounce {
    0%, 100% { transform: translateY(0); }    /* ตำแหน่งเดิม */
    50%      { transform: translateY(-8px); }  /* ยกขึ้น 8px */
}
```

### อธิบายทีละบรรทัด

| Property | ค่า | ความหมาย |
|---|---|---|
| `animation` | `cowBounce` | ชื่อ animation ที่กำหนดใน @keyframes |
| | `3s` | 1 รอบใช้เวลา 3 วินาที (ช้าพอดี ไม่เร็วเกิน) |
| | `ease-in-out` | เริ่มช้า → เร็วตรงกลาง → ช้าตอนจบ = เคลื่อนไหวนุ่มนวล |
| | `infinite` | เล่นซ้ำไม่มีที่สิ้นสุด |
| `filter: drop-shadow(...)` | สี cyan + blur 20px | เงาสี cyan ใต้วัว ให้ดู "ลอย" ได้สมจริง |

### การทำงานของ @keyframes cowBounce

```
เวลา:  0%          25%         50%         75%         100%
ตำแหน่ง: [ปกติ 0px]   [↑ กำลังขึ้น]  [สูงสุด -8px]  [↓ กำลังลง]  [กลับ 0px]
         🐄            🐄             🐄            🐄           🐄
         ___          ___           ___          ___          ___
```

- `translateY(0)` = ตำแหน่งปกติ (0% และ 100%)
- `translateY(-8px)` = เลื่อนขึ้น 8 pixels (50% = ครึ่งทาง)
- `ease-in-out` = ทำให้การเคลื่อนไหวค่อยๆ ช้าลงตอนสุดปลาย ดูเป็นธรรมชาติ
- ใช้ `transform` แทน `top/margin` เพราะ transform ใช้ GPU render = **ลื่นกว่ามาก**

---

## 🌊 Animation อื่นๆ ในเว็บ

### 1. Background Orbs (ลูกบอลเรืองแสงลอยอยู่พื้นหลัง)

```css
.bg-orb {
    border-radius: 50%;          /* ทำเป็นวงกลม */
    filter: blur(100px);         /* เบลอ 100px = เป็นแสงเรืองรอง */
    opacity: 0.3;                /* โปร่งใส 70% */
    animation: orbFloat 20s ease-in-out infinite;
}

@keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25%      { transform: translate(40px, -30px) scale(1.05); }
    50%      { transform: translate(-20px, 40px) scale(0.95); }
    75%      { transform: translate(30px, 20px) scale(1.02); }
}
```

- มี 3 ลูก: สี **cyan**, **purple**, **pink**
- แต่ละลูกมี `animation-delay` ต่างกัน → เคลื่อนไหวไม่พร้อมกัน ดูเป็นธรรมชาติ
- `pointer-events: none` = กดทะลุได้ ไม่บังการคลิก

### 2. Loading Pulse (วัวหมุนตอนโหลด)

```css
@keyframes loadingPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.15) rotate(5deg); opacity: 0.7; }
}
```

- วัว emoji ขยายใหญ่ขึ้น 15% + หมุนเอียง 5° + จางลงเล็กน้อย → วนซ้ำ

### 3. Weather Icon Float

```css
@keyframes iconFloat {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
}
```

- emoji สภาพอากาศ (☀️/🌧️/⛈️) ลอยขึ้นลงเบาๆ เหมือน cow logo

### 4. Fade Slide Animations (ตอนแสดงผลลัพธ์)

```css
@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
}
```

- ทุก section ของผลลัพธ์ "ลอยขึ้นมา" ทีละอัน ด้วย `animation-delay` ต่างกัน:
  - Cow section: 0.1s
  - Main card: 0.2s
  - Details grid: 0.3s
  - Forecast: 0.4s

### 5. Hover Effects (Detail Cards)

```css
.detail-card:hover {
    transform: translateY(-4px);                    /* ยกขึ้น 4px */
    border-color: rgba(0,212,255,0.2);              /* ขอบเรือง cyan */
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);        /* เงาเข้มขึ้น */
}
```

---

## 🐄 ASCII Cow บนเว็บ — ทำยังไง?

ในเว็บ **ไม่ได้ใช้** package `cowsay` เพราะมันทำงานฝั่ง server เท่านั้น แต่เขียน function ขึ้นมาเองใน `app.js`:

```javascript
function makeCowSay(text) {
    // 1. แบ่งข้อความเป็นบรรทัด
    const lines = text.split('\n');
    
    // 2. หาบรรทัดที่ยาวที่สุด แล้ว pad ให้เท่ากัน
    const maxLen = Math.max(...lines.map(l => l.length));
    const padded = lines.map(l => l.padEnd(maxLen));
    
    // 3. สร้าง speech bubble
    //  ____________________
    // / ເມືອງ: Bangkok     \
    // | ອຸນຫະພູມ: 33°C     |
    // \ ຄວາມຊຸ່ມຊື່ນ: 54%  /
    //  --------------------
    
    // 4. ต่อท้ายด้วย ASCII วัว
    //         \   ^__^
    //          \  (oO)\_______
    //             (__)\       )\/\
    //              U  ||----w |
    //                 ||     ||
}
```

- ใช้ `<pre>` tag แสดง → รักษา spacing ของ ASCII art
- สีเขียว `#22c55e` บน background เข้ม → ดูเหมือน terminal

---

## 🎨 Design System (CSS Variables)

ใช้ CSS Variables (Custom Properties) เก็บค่าทั้งหมดไว้ที่ `:root` เพื่อให้แก้ไขสีทั้งเว็บได้จากจุดเดียว:

```css
:root {
    --bg-primary: #0a0a1a;          /* พื้นหลังหลัก สีกรมท่าเข้ม */
    --bg-card: rgba(255,255,255,0.04); /* พื้น card โปร่งแสง 4% */
    --accent-cyan: #00d4ff;          /* สีเน้นหลัก */
    --accent-purple: #a855f7;        /* สีเน้นรอง */
    --gradient-main: linear-gradient(135deg, #00d4ff, #a855f7, #ec4899);
}
```

**Glassmorphism** คืออะไร? → เทคนิค UI ที่ทำให้ card ดูเหมือนกระจกฝ้า:
- `background: rgba(255,255,255,0.04)` → พื้นโปร่งแสงเล็กน้อย
- `backdrop-filter: blur(20px)` → เบลอสิ่งที่อยู่ด้านหลัง
- `border: 1px solid rgba(255,255,255,0.08)` → ขอบบางๆ

---

## 📁 โครงสร้างไฟล์

```
weather-cow/
├── index.js              ← CLI app เดิม (ไม่ได้แก้ไข)
├── server.js             ← [ใหม่] Express server + API endpoint
├── package.json          ← อัปเดต: เพิ่ม express + script "dev"
├── REPORT.md             ← [ใหม่] เอกสารฉบับนี้
├── public/               ← [ใหม่] ไฟล์หน้าเว็บ
│   ├── index.html        ← โครงสร้าง HTML
│   ├── style.css         ← CSS design (dark mode, glassmorphism)
│   └── app.js            ← JavaScript logic ฝั่ง client
├── weather_report.txt    ← ตัวอย่างผลลัพธ์ CLI เดิม
└── weather_report2.txt   ← ตัวอย่างผลลัพธ์ CLI เดิม
```

---

## 🚀 วิธีรันโปรเจกต์

```bash
# CLI เดิม
node index.js Bangkok

# Web Interface ใหม่
npm run dev
# เปิด http://localhost:3000
```

---

## 📊 สรุป

| หมวด | รายละเอียด |
|---|---|
| **ไฟล์ใหม่** | server.js, public/index.html, public/style.css, public/app.js, REPORT.md |
| **ไฟล์แก้ไข** | package.json (เพิ่ม express + dev script) |
| **Dependencies ทั้งหมด** | express, node-fetch, chalk, cowsay (4 ตัว) |
| **External** | Google Fonts (Inter), wttr.in API |
| **Animations** | 5 ชนิด: cowBounce, orbFloat, loadingPulse, iconFloat, fadeSlideUp |
| **Design** | Dark mode + Glassmorphism + Gradient + Responsive |

---

*อัปเดต: 4 มิถุนายน 2026 — Weather Cow v2.0 with Web Interface*

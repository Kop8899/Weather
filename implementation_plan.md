# Weather Cow Web Interface — Implementation Plan

## Background

โปรเจกต์ **Weather Cow** ปัจจุบันเป็น CLI app (Node.js) ที่ดึงข้อมูลสภาพอากาศจาก `wttr.in` API แล้วแสดงผลใน terminal ผ่าน `cowsay` + `chalk` โดยข้อความเป็นภาษาลาว

**เป้าหมาย**: เพิ่มหน้าเว็บ (Web Interface) ให้ผู้ใช้สามารถค้นหาสภาพอากาศได้ง่ายขึ้นผ่าน Browser พร้อมจัดทำเอกสารรายงาน (Report) อธิบายเทคโนโลยีที่ใช้และเหตุผล

---

## Proposed Changes

### 1. Backend — Express.js API Server

#### [NEW] [server.js](file:///c:/python%20for%20beginner-advance/python%20project/weather-cow/server.js)

สร้าง Express.js server ที่:
- เสิร์ฟไฟล์ static (HTML/CSS/JS) จากโฟลเดอร์ `public/`
- มี API endpoint `GET /api/weather/:city` ที่ดึงข้อมูลจาก `wttr.in` แล้วส่ง JSON กลับ
- รองรับ 3-day forecast data
- มี error handling ที่ดี

**เหตุผลที่เลือก Express.js**:
- เป็น library ที่เบา ติดตั้งง่าย ไม่ต้อง setup ซับซ้อน
- โปรเจกต์เดิมเป็น Node.js อยู่แล้ว ใช้ร่วมกันได้เลย
- เหมาะกับ project ขนาดเล็ก-กลาง

---

### 2. Frontend — Single Page Application

#### [NEW] [public/index.html](file:///c:/python%20for%20beginner-advance/python%20project/weather-cow/public/index.html)

หน้าเว็บหลักที่ประกอบด้วย:
- Search bar สำหรับพิมพ์ชื่อเมือง
- การ์ดแสดงสภาพอากาศปัจจุบัน (อุณหภูมิ, สภาพอากาศ, ความชื้น, ลม, UV index ฯลฯ)
- ตัววัวพูด (cowsay-style) แสดงใน browser
- Forecast 3 วัน
- Responsive design รองรับ mobile

#### [NEW] [public/style.css](file:///c:/python%20for%20beginner-advance/python%20project/weather-cow/public/style.css)

Premium CSS design:
- Dark mode เป็นหลักพร้อม gradient สีสวย
- Glassmorphism effect สำหรับ cards
- Micro-animations (hover, fade-in, loading spinner)
- Weather icon animations
- Typography: Google Fonts (Inter)
- Responsive layout ด้วย CSS Grid/Flexbox

#### [NEW] [public/app.js](file:///c:/python%20for%20beginner-advance/python%20project/weather-cow/public/app.js)

Client-side JavaScript:
- Fetch weather data จาก backend API
- Dynamic DOM rendering
- ASCII cow art สร้างใน browser
- Loading state + error handling
- Weather emoji mapping ตามสภาพอากาศ

---

### 3. Package Updates

#### [MODIFY] [package.json](file:///c:/python%20for%20beginner-advance/python%20project/weather-cow/package.json)

- เพิ่ม dependency: `express`
- เพิ่ม script: `"dev": "node server.js"` สำหรับ start server

---

### 4. Documentation Report

#### [NEW] [REPORT.md](file:///c:/python%20for%20beginner-advance/python%20project/weather-cow/REPORT.md)

เอกสารรายงานภาษาไทย ประกอบด้วย:
- สรุปโปรเจกต์
- เทคโนโลยีที่ใช้ทั้งหมดพร้อมเหตุผล
- โครงสร้างไฟล์
- วิธีรันโปรเจกต์
- สรุปการเปลี่ยนแปลง

---

## Design Preview

| องค์ประกอบ | รายละเอียด |
|---|---|
| **Color Scheme** | Dark background (#0f0f1a) + gradient accents (cyan/purple/blue) |
| **Cards** | Glassmorphism — semi-transparent, backdrop-blur, rounded corners |
| **Typography** | Inter (Google Fonts) — modern, clean |
| **Animations** | Fade-in on load, hover glow, loading pulse, weather icon bounce |
| **Cow Character** | ASCII art cow ที่ "พูด" สภาพอากาศ style เหมือน cowsay แต่แสดงบนเว็บ |
| **Layout** | Centered, max-width 900px, responsive |

---

## Open Questions

> [!IMPORTANT]
> **ภาษาของ UI**: โปรเจกต์เดิมใช้ภาษาลาวในการแสดงผล ต้องการให้หน้าเว็บแสดงเป็นภาษาลาวเหมือนเดิม หรือจะใช้ภาษาอื่น (ไทย/อังกฤษ)? — **ผมจะทำเป็นภาษาลาวตามเดิม**

---

## Verification Plan

### Automated Tests
1. `npm install` — ติดตั้ง dependencies ใหม่ (express)
2. `npm run dev` — start server
3. เปิด browser ไปที่ `http://localhost:3000`
4. ทดสอบค้นหาเมือง เช่น "Bangkok", "Tokyo", "Vientiane"
5. ตรวจสอบ responsive design + animations

### Manual Verification
- เปิดหน้าเว็บผ่าน browser subagent เพื่อ screenshot ผลลัพธ์
- ตรวจสอบว่า API response ถูกต้อง

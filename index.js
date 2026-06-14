#!/usr/bin/env node

import fetch from 'node-fetch';
import cowsay from 'cowsay';
import chalk from 'chalk';

/**
 * ฟังก์ชันดึงข้อมูลสภาพอากาศจาก API (งาน I/O)
 * @param {string} city - ชื่อเมืองที่ต้องการค้นหา
 */
async function fetchWeather(city) {
    // ใช้ wttr.in เป็น API เพราะใช้งานง่ายและไม่ต้องใช้ API Key
    const url = `https://wttr.in/${city}?format=j1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('ไม่สามารถติดต่อเซิร์ฟเวอร์สภาพอากาศได้');
    }

    const data = await response.json();
    return data;
}

/**
 * ฟังก์ชันหลักในการรันโปรแกรม
 */
async function main() {
    // รับชื่อเมืองจาก Argument เช่น: node index.js Tokyo
    const city = process.argv[2] || 'Vientiane';

    console.log(chalk.cyan(`\n🔍 ກໍາລັງຄົ້ນຫາສະພາບອາກາດໃນ ${city}... ກະລຸນາລໍຖ້າຈັກບຶດ`));

    try {
        // --- ส่วนของ Async/Await (Non-blocking) ---
        const weatherData = await fetchWeather(city);
        
        // ดึงข้อมูลที่จำเป็นออกมา
        const current = weatherData.current_condition[0];
        const temp = current.temp_C;
        const desc = current.weatherDesc[0].value;
        const humidity = current.humidity;

        // เตรียมข้อความให้วัวพูด
        const speech = `ເມືອງ: ${city}\nອຸນຫະພູມ: ${temp}°C\nສະພາບອາກາດ: ${desc}\nຄວາມຊຸ່ມຊື່ນ: ${humidity}%`;

        // --- ส่วนของการตกแต่ง (Decorations) ---
        console.log(chalk.greenBright(
            cowsay.say({
                text: speech,
                e: "oO", // ดวงตาของวัว
                T: "U "  // ลิ้นของวัว
            })
        ));

        console.log(chalk.grey(`ບັນທຶກ: ດຶງຂໍ້ມູນເມື່ອ ${new Date().toLocaleTimeString()}`));

    } catch (error) {
        // จัดการกรณีเกิด Error (เช่น พิมพ์ชื่อเมืองผิด หรือเน็ตหลุด)
        console.log(chalk.red(
            cowsay.say({
                text: `ເກີດຂໍ້ຜິດພາດ: ${error.message}\nລອງກວດເບິ່ງຊື່ເມືອງຄືນໃໝ່ເດີ້!`,
                e: "xx"
            })
        ));
    }
}

// เรียกใช้งานฟังก์ชันหลัก
main();
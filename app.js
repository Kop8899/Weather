// ============================================
// Weather Cow — Client-side JavaScript
// ============================================

/**
 * ແຜນທີ່ weather code -> emoji
 */
function getWeatherEmoji(code) {
    const c = parseInt(code);
    const map = {
        113: '☀️', 116: '⛅', 119: '☁️', 122: '☁️',
        143: '🌫️', 176: '🌦️', 179: '🌨️', 182: '🌧️',
        185: '🌧️', 200: '⛈️', 227: '❄️', 230: '🌨️',
        248: '🌫️', 260: '🌫️', 263: '🌦️', 266: '🌧️',
        281: '🌧️', 284: '🌧️', 293: '🌦️', 296: '🌧️',
        299: '🌧️', 302: '🌧️', 305: '🌧️', 308: '🌧️',
        311: '🌧️', 314: '🌧️', 317: '🌨️', 320: '🌨️',
        323: '🌨️', 326: '🌨️', 329: '❄️', 332: '❄️',
        335: '❄️', 338: '❄️', 350: '🌧️', 353: '🌦️',
        356: '🌧️', 359: '🌧️', 362: '🌨️', 365: '🌨️',
        368: '🌨️', 371: '❄️', 374: '🌧️', 377: '🌧️',
        386: '⛈️', 389: '⛈️', 392: '⛈️', 395: '❄️',
    };
    return map[c] || '🌤️';
}

/**
 * ສ້າງ ASCII cow art
 */
function makeCowSay(text) {
    const lines = text.split('\n');
    const maxLen = Math.max(...lines.map(l => l.length));
    const padded = lines.map(l => l.padEnd(maxLen));
    const border = '_'.repeat(maxLen + 2);
    const bottom = '-'.repeat(maxLen + 2);

    let bubble = ` ${border}\n`;
    if (padded.length === 1) {
        bubble += `< ${padded[0]} >\n`;
    } else {
        padded.forEach((line, i) => {
            if (i === 0) bubble += `/ ${line} \\\n`;
            else if (i === padded.length - 1) bubble += `\\ ${line} /\n`;
            else bubble += `| ${line} |\n`;
        });
    }
    bubble += ` ${bottom}\n`;

    const cow = `        \\   ^__^\n         \\  (oO)\\_______\n            (__)\\       )\\/\\\n             U  ||----w |\n                ||     ||`;

    return bubble + cow;
}

/**
 * ຈັດຮູບແບບວັນທີ
 */
function formatDate(dateStr) {
    const d = new Date(dateStr);
    const days = ['ວັນອາທິດ', 'ວັນຈັນ', 'ວັນອັງຄານ', 'ວັນພຸດ', 'ວັນພະຫັດ', 'ວັນສຸກ', 'ວັນເສົາ'];
    const day = days[d.getDay()];
    return `${day} ${d.getDate()}/${d.getMonth() + 1}`;
}

/**
 * ຄົ້ນຫາສະພາບອາກາດ
 */
async function searchWeather() {
    const input = document.getElementById('city-input');
    const city = input.value.trim();
    if (!city) {
        input.focus();
        return;
    }
    await fetchAndDisplay(city);
}

/**
 * ຄົ້ນຫາດ່ວນ
 */
async function quickSearch(city) {
    document.getElementById('city-input').value = city;
    await fetchAndDisplay(city);
}

/**
 * ດຶງຂໍ້ມູນ ແລະ ສະແດງຜົນ
 */
async function fetchAndDisplay(city) {
    const loading = document.getElementById('loading');
    const result = document.getElementById('weather-result');
    const errorBox = document.getElementById('error-box');

    // ສະແດງ loading, ເຊື່ອງ result/error
    loading.classList.add('active');
    result.classList.remove('active');
    errorBox.classList.remove('active');

    try {
        const res = await fetch(`/api/weather/${encodeURIComponent(city)}`);
        const data = await res.json();

        if (data.error) {
            throw new Error(data.message);
        }

        renderWeather(data);
        loading.classList.remove('active');
        result.classList.add('active');

    } catch (err) {
        loading.classList.remove('active');
        showError(err.message || 'ເກີດຂໍ້ຜິດພາດ ລອງໃໝ່ອີກຄັ້ງ');
    }
}

/**
 * ສະແດງ error
 */
function showError(message) {
    const errorBox = document.getElementById('error-box');
    const errorMsg = document.getElementById('error-message');
    const errorCowArt = document.getElementById('error-cow-art');

    const cowText = makeCowSay('ໂອ້ຍ! ມີບັນຫາແລ້ວ...');
    errorCowArt.textContent = cowText;
    errorMsg.textContent = message;
    errorBox.classList.add('active');
}

/**
 * ສະແດງຜົນສະພາບອາກາດ
 */
function renderWeather(data) {
    const { city, current, forecast, fetchedAt } = data;
    const emoji = getWeatherEmoji(current.weatherCode);

    // Cow speech
    const speech = `ເມືອງ: ${city}\nອຸນຫະພູມ: ${current.temp}°C\nສະພາບອາກາດ: ${current.desc}\nຄວາມຊຸ່ມຊື່ນ: ${current.humidity}%`;
    document.getElementById('cow-speech').textContent = makeCowSay(speech);

    // Main card
    document.getElementById('result-city').textContent = `📍 ${city}`;
    document.getElementById('fetch-time').textContent = `ອັບເດດ: ${fetchedAt}`;
    document.getElementById('weather-icon').textContent = emoji;
    document.getElementById('temp-value').textContent = current.temp;
    document.getElementById('weather-desc').textContent = current.desc;
    document.getElementById('feels-like').textContent = `ຮູ້ສຶກເໝືອນ ${current.feelsLike}°C`;

    // Details
    document.getElementById('val-humidity').textContent = `${current.humidity}%`;
    document.getElementById('val-wind').textContent = `${current.windSpeed} km/h ${current.windDir}`;
    document.getElementById('val-uv').textContent = current.uvIndex;
    document.getElementById('val-visibility').textContent = `${current.visibility} km`;
    document.getElementById('val-pressure').textContent = `${current.pressure} mb`;
    document.getElementById('val-cloud').textContent = `${current.cloudCover}%`;

    // Forecast
    const grid = document.getElementById('forecast-grid');
    grid.innerHTML = '';
    forecast.forEach(day => {
        const dayEmoji = getWeatherEmoji(day.weatherCode);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${formatDate(day.date)}</div>
            <div class="forecast-icon">${dayEmoji}</div>
            <div class="forecast-temp">${day.maxTemp}° <span class="temp-min">/ ${day.minTemp}°</span></div>
            <div class="forecast-desc">${day.desc}</div>
            <div class="forecast-rain">🌧️ ${day.chanceOfRain}%</div>
        `;
        grid.appendChild(card);
    });
}

// Enter key support
document.getElementById('city-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchWeather();
});

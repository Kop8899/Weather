// Vercel Serverless Function for weather API
// Route: /api/weather/:city

export default async function handler(req, res) {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({
            error: true,
            message: 'ກະລຸນາລະບຸຊື່ເມືອງ'
        });
    }

    try {
        const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({
                error: true,
                message: 'ບໍ່ສາມາດຕິດຕໍ່ເຊີບເວີສະພາບອາກາດໄດ້'
            });
        }

        const data = await response.json();

        // ດຶງຂໍ້ມູນສະພາບອາກາດປັດຈຸບັນ
        const current = data.current_condition[0];

        // ດຶງ forecast 3 ມື້
        const forecast = data.weather.map(day => ({
            date: day.date,
            maxTemp: day.maxtempC,
            minTemp: day.mintempC,
            avgTemp: day.avgtempC,
            desc: day.hourly[4]?.weatherDesc[0]?.value || 'N/A',
            weatherCode: day.hourly[4]?.weatherCode || '113',
            humidity: day.hourly[4]?.humidity || 'N/A',
            chanceOfRain: day.hourly[4]?.chanceofrain || '0',
            windSpeed: day.hourly[4]?.windspeedKmph || 'N/A',
        }));

        // ສົ່ງຂໍ້ມູນກັບ
        res.json({
            success: true,
            city: city,
            current: {
                temp: current.temp_C,
                feelsLike: current.FeelsLikeC,
                desc: current.weatherDesc[0].value,
                weatherCode: current.weatherCode,
                humidity: current.humidity,
                windSpeed: current.windspeedKmph,
                windDir: current.winddir16Point,
                visibility: current.visibility,
                uvIndex: current.uvIndex,
                pressure: current.pressure,
                cloudCover: current.cloudcover,
                precipitation: current.precipMM,
            },
            forecast: forecast,
            fetchedAt: new Date().toLocaleTimeString('lo-LA'),
        });

    } catch (error) {
        res.status(500).json({
            error: true,
            message: `ເກີດຂໍ້ຜິດພາດ: ${error.message}`
        });
    }
}

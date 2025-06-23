function getWeatherEmoji(type) {
    switch (type.toLowerCase()) {
      case "clear": return "☀️";
      case "clouds": return "⛅";
      case "rain": return "🌧";
      case "drizzle": return "🌦";
      case "thunderstorm": return "🌩";
      case "snow": return "❄️";
      case "mist":
      case "haze":
      case "fog": return "🌫";
      default: return "🌈";
    }
  }
  
  function getBackgroundByWeather(weather) {
    switch (weather.toLowerCase()) {
      case "clear": return "linear-gradient(to right, #fceabb, #f8b500)";
      case "clouds": return "linear-gradient(to right, #bdc3c7, #2c3e50)";
      case "rain": return "linear-gradient(to right, #00c6ff, #0072ff)";
      case "snow": return "linear-gradient(to right, #e0eafc, #cfdef3)";
      case "thunderstorm": return "linear-gradient(to right, #4e54c8, #8f94fb)";
      default: return "linear-gradient(to right, #4facfe, #00f2fe)";
    }
  }
  
  async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const resultBox = document.getElementById("weatherResult");
    const apiKey = "8e9bac134ff8497e8121fc716252201f";
  
    if (!city) {
      resultBox.innerHTML = `<p>Please enter a city name.</p>`;
      resultBox.classList.add("show");
      return;
    }
  
    resultBox.innerHTML = `<p>🌦️ Fetching weather data...</p>`;
    resultBox.classList.add("show");
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message || "City not found");
  
      const weatherType = data.weather[0].main;
      const icon = data.weather[0].icon;
      const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      const emoji = getWeatherEmoji(weatherType);
      const localTime = new Date(Date.now() + data.timezone * 1000 - new Date().getTimezoneOffset() * 60000);
      const currentTime = localTime.toLocaleString();

  
      document.body.style.background = getBackgroundByWeather(weatherType);
  
      resultBox.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><small>${currentTime}</small></p>
        <p style="font-size: 40px;">${emoji}</p>
        <p>Weather: ${emoji} <strong>${weatherType}</strong></p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} km/h</p>
      `;
    } catch (error) {
      resultBox.innerHTML = `<p style="color: #ffdddd;">${error.message}</p>`;
    }
  }
  
  async function getWeatherByLocation() {
    const apiKey = "8e9bac134ff8497e8121fc716252201f";
    const resultBox = document.getElementById("weatherResult");
  
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
  
    resultBox.innerHTML = `<p>📍 Getting your location...</p>`;
    resultBox.classList.add("show");
  
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
      try {
        const response = await fetch(url);
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.message);
  
        const weatherType = data.weather[0].main;
        const icon = data.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const emoji = getWeatherEmoji(weatherType);
        const currentTime = new Date().toLocaleString();
  
        document.body.style.background = getBackgroundByWeather(weatherType);
  
        resultBox.innerHTML = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <p><small>${currentTime}</small></p>
          <p style="font-size: 40px;">${emoji}</p>
          <p>Weather: ${emoji} <strong>${weatherType}</strong></p>
          <p>Temperature: ${data.main.temp}°C</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind: ${data.wind.speed} km/h</p>
        `;
      } catch (error) {
        resultBox.innerHTML = `<p style="color: #ffdddd;">${error.message}</p>`;
      }
    }, () => {
      resultBox.innerHTML = `<p style="color: #ffdddd;">Unable to retrieve your location.</p>`;
    });
  }
  
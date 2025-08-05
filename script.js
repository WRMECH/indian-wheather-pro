// Enhanced Weather App with Advanced 3D Animations
const API_KEY = "79e671270479fb520a536b11ae5416f0" // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
// const ONECALL_URL = "https://api.openweathermap.org/data/3.0/onecall" // For more detailed data (requires different API call)

// Indian cities data with Dehradun added
const indianCities = [
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lon: 72.8777 },
  { name: "Delhi", state: "Delhi", lat: 28.7041, lon: 77.1025 },
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lon: 78.4867 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lon: 72.8311 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
  { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lon: 80.3319 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lon: 79.0882 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376 },
  { name: "Vadodara", state: "Gujarat", lat: 22.3072, lon: 73.1812 },
  { name: "Ghaziabad", state: "Uttar Pradesh", lat: 28.6692, lon: 77.4538 },
  { name: "Ludhiana", state: "Punjab", lat: 30.901, lon: 75.8573 },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lon: 78.0322 }, // Added Dehradun
]

// Declare THREE variable
const THREE = window.THREE || {}

class EnhancedWeatherApp {
  constructor() {
    this.citiesGrid = document.getElementById("citiesGrid")
    this.searchInput = document.getElementById("citySearch")
    this.searchBtn = document.getElementById("searchBtn")
    this.voiceBtn = document.getElementById("voiceBtn")
    this.voiceStatus = document.getElementById("voiceStatus")
    this.voiceStatusText = document.getElementById("voiceStatusText")
    this.weatherDetails = document.getElementById("weatherDetails")
    this.closeBtn = document.getElementById("closeBtn")
    this.loading = document.getElementById("loading")
    this.weather3D = null

    // Voice recognition properties
    this.recognition = null
    this.isListening = false
    this.voiceSupported = false
    this.microphonePermission = false

    this.init()
  }

  init() {
    console.log("Initializing enhanced weather app with advanced 3D...")

    // Check if API key is set
    if (API_KEY === "YOUR_API_KEY_HERE") {
      this.hideLoading()
      this.showError("⚠️ Please set your OpenWeatherMap API key in script.js file")
      return
    }

    this.setupEventListeners()
    this.loadCitiesWeather()
    this.updateStats()
  }

  setupEventListeners() {
    if (this.searchBtn) {
      this.searchBtn.addEventListener("click", () => this.searchCity())
    }

    if (this.searchInput) {
      this.searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.searchCity()
      })
    }

    if (this.voiceBtn) {
      this.voiceBtn.addEventListener("click", () => this.toggleVoiceSearch())
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeDetails())
    }

    if (this.weatherDetails) {
      this.weatherDetails.addEventListener("click", (e) => {
        if (e.target === this.weatherDetails) this.closeDetails()
      })
    }

    // Handle window resize for 3D scene
    window.addEventListener("resize", () => {
      if (this.weather3D) {
        this.weather3D.resize()
      }
    })

    // Initialize voice recognition
    this.initVoiceRecognition()
  }

  async checkMicrophonePermission() {
    try {
      console.log("Checking microphone permission...")

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia not supported")
        return false
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("Microphone permission granted")

      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach((track) => track.stop())

      this.microphonePermission = true
      return true
    } catch (error) {
      console.error("Microphone permission error:", error)
      this.microphonePermission = false

      let errorMessage = "Microphone access required for voice search. "
      if (error.name === "NotAllowedError") {
        errorMessage += "Please allow microphone access and try again."
      } else if (error.name === "NotFoundError") {
        errorMessage += "No microphone found. Please connect a microphone."
      } else {
        errorMessage += "Please check your microphone settings."
      }

      this.showVoiceMessage(errorMessage, "error")
      return false
    }
  }

  initVoiceRecognition() {
    // Check if browser supports speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()

      // Configure speech recognition with more permissive settings
      this.recognition.continuous = false
      this.recognition.interimResults = true // Enable interim results
      this.recognition.lang = "en-US" // Try US English first, then fallback
      this.recognition.maxAlternatives = 5

      // Add timeout settings
      if (this.recognition.serviceURI !== undefined) {
        // For Chrome/Edge
        this.recognition.serviceURI = "wss://www.google.com/speech-api/full-duplex/v1/up"
      }

      this.voiceSupported = true
      console.log("Voice recognition initialized successfully")

      // Set up event listeners
      this.recognition.onstart = () => this.onVoiceStart()
      this.recognition.onresult = (event) => this.onVoiceResult(event)
      this.recognition.onerror = (event) => this.onVoiceError(event)
      this.recognition.onend = () => this.onVoiceEnd()
      this.recognition.onspeechstart = () => this.onSpeechStart()
      this.recognition.onspeechend = () => this.onSpeechEnd()
      this.recognition.onsoundstart = () => this.onSoundStart()
      this.recognition.onsoundend = () => this.onSoundEnd()
      this.recognition.onaudiostart = () => this.onAudioStart()
      this.recognition.onaudioend = () => this.onAudioEnd()
    } else {
      console.warn("Speech recognition not supported in this browser")
      this.voiceSupported = false
      if (this.voiceBtn) {
        this.voiceBtn.disabled = true
        this.voiceBtn.innerHTML = "🚫"
        this.voiceBtn.title = "Voice search not supported in this browser"
      }
    }
  }

  async toggleVoiceSearch() {
    if (!this.voiceSupported) {
      this.showVoiceMessage(
        "Voice search is not supported in your browser. Please try Chrome, Edge, or Safari.",
        "error",
      )
      return
    }

    // Check microphone permission first
    if (!this.microphonePermission) {
      const hasPermission = await this.checkMicrophonePermission()
      if (!hasPermission) {
        return
      }
    }

    if (this.isListening) {
      this.stopVoiceSearch()
    } else {
      this.startVoiceSearch()
    }
  }

  startVoiceSearch() {
    if (!this.recognition || this.isListening) return

    try {
      // Reset recognition settings
      this.recognition.lang = "en-US" // Start with US English
      this.isListening = true
      this.recognition.start()
      console.log("Voice recognition started")
    } catch (error) {
      console.error("Error starting voice recognition:", error)
      this.showVoiceMessage("Failed to start voice recognition. Please try again.", "error")
      this.isListening = false

      // Try with different language setting
      setTimeout(() => {
        if (this.recognition && !this.isListening) {
          try {
            this.recognition.lang = "en-IN"
            this.isListening = true
            this.recognition.start()
            console.log("Retrying with en-IN language setting")
          } catch (retryError) {
            console.error("Retry failed:", retryError)
          }
        }
      }, 1000)
    }
  }

  stopVoiceSearch() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  onVoiceStart() {
    console.log("🎤 Voice recognition started listening")
    this.isListening = true

    if (this.voiceBtn) {
      this.voiceBtn.classList.add("listening")
      this.voiceBtn.innerHTML = "🔴"
      this.voiceBtn.title = "Click to stop listening"
    }

    this.showVoiceStatus("🎤 Listening... Speak clearly", "listening")
  }

  onSpeechStart() {
    console.log("🗣️ Speech detected - user started speaking")
    this.showVoiceStatus("🗣️ Speech detected - keep talking...", "listening")
  }

  onSpeechEnd() {
    console.log("🤐 Speech ended - user stopped speaking")
    this.showVoiceStatus("🤐 Processing speech...", "processing")
  }

  onSoundStart() {
    console.log("🔊 Sound detected")
  }

  onSoundEnd() {
    console.log("🔇 Sound ended")
  }

  onAudioStart() {
    console.log("🎵 Audio input started")
  }

  onAudioEnd() {
    console.log("🎵 Audio input ended")
  }

  onVoiceResult(event) {
    console.log("📝 Voice result event:", event)
    const results = event.results
    let transcript = ""
    let confidence = 0
    let isFinal = false

    // Process all results
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      console.log(`Result ${i} (final: ${result.isFinal}):`, result)

      for (let j = 0; j < result.length; j++) {
        const alternative = result[j]
        console.log(`  Alternative ${j}: "${alternative.transcript}" (confidence: ${alternative.confidence})`)

        // Use the best confidence result
        if (alternative.confidence > confidence || (confidence === 0 && alternative.transcript)) {
          transcript = alternative.transcript
          confidence = alternative.confidence || 0.5 // Default confidence if not provided
          isFinal = result.isFinal
        }
      }
    }

    console.log(`📋 Best transcript: "${transcript}" (confidence: ${confidence}, final: ${isFinal})`)

    if (transcript) {
      // Show interim results
      if (!isFinal) {
        this.showVoiceStatus(`🎯 Hearing: "${transcript}"...`, "listening")
      } else {
        // Process final result
        const cityName = this.cleanCityName(transcript)
        console.log("🏙️ Cleaned city name:", cityName)

        if (cityName) {
          // Set the input value
          if (this.searchInput) {
            this.searchInput.value = cityName
            console.log("✅ Set search input to:", cityName)
          }

          this.showVoiceStatus(`✅ Found: "${cityName}" - Searching...`, "processing")

          // Update voice button to processing state
          if (this.voiceBtn) {
            this.voiceBtn.classList.remove("listening")
            this.voiceBtn.classList.add("processing")
            this.voiceBtn.innerHTML = "🔍"
          }

          // Auto-search immediately
          console.log("🔍 Triggering search for:", cityName)
          this.searchCity()
        } else {
          console.log("❌ Could not clean city name from:", transcript)
          this.showVoiceMessage(`❌ Heard "${transcript}" but couldn't find a matching city. Try again.`, "error")
        }
      }
    }
  }

  cleanCityName(transcript) {
    console.log("🧹 Cleaning transcript:", transcript)

    // Convert to lowercase and trim
    let cityName = transcript.toLowerCase().trim()

    // Remove common voice recognition artifacts
    cityName = cityName.replace(/[.,!?]/g, "")
    cityName = cityName.replace(/\s+/g, " ") // Multiple spaces to single space

    console.log("🧹 After cleanup:", cityName)

    // Handle common mispronunciations and variations
    const cityMappings = {
      mumbai: "Mumbai",
      bombay: "Mumbai",
      "mom by": "Mumbai",
      "mom bye": "Mumbai",
      delhi: "Delhi",
      "new delhi": "Delhi",
      "delhi new": "Delhi",
      bangalore: "Bangalore",
      bengaluru: "Bangalore",
      bangalore: "Bangalore",
      "bang a lore": "Bangalore",
      hyderabad: "Hyderabad",
      hyderabad: "Hyderabad",
      "haider abad": "Hyderabad",
      chennai: "Chennai",
      madras: "Chennai",
      "chen nai": "Chennai",
      kolkata: "Kolkata",
      calcutta: "Kolkata",
      "cal cutta": "Kolkata",
      "kol kata": "Kolkata",
      pune: "Pune",
      "poo nay": "Pune",
      ahmedabad: "Ahmedabad",
      "ahmed abad": "Ahmedabad",
      jaipur: "Jaipur",
      "jai pur": "Jaipur",
      surat: "Surat",
      "su rat": "Surat",
      lucknow: "Lucknow",
      "luck now": "Lucknow",
      kanpur: "Kanpur",
      "kan pur": "Kanpur",
      nagpur: "Nagpur",
      "nag pur": "Nagpur",
      indore: "Indore",
      "in door": "Indore",
      "in dore": "Indore",
      bhopal: "Bhopal",
      "bho pal": "Bhopal",
      visakhapatnam: "Visakhapatnam",
      vizag: "Visakhapatnam",
      "visa kha patnam": "Visakhapatnam",
      patna: "Patna",
      "pat na": "Patna",
      vadodara: "Vadodara",
      baroda: "Vadodara",
      "vado dara": "Vadodara",
      ghaziabad: "Ghaziabad",
      "ghazi abad": "Ghaziabad",
      ludhiana: "Ludhiana",
      "ludhi ana": "Ludhiana",
      dehradun: "Dehradun", // Added Dehradun
      "dehra dun": "Dehradun",
      "deh ra dun": "Dehradun",
    }

    // Check for exact matches first
    if (cityMappings[cityName]) {
      console.log("✅ Found exact match:", cityMappings[cityName])
      return cityMappings[cityName]
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(cityMappings)) {
      if (cityName.includes(key) || key.includes(cityName)) {
        console.log("✅ Found partial match:", value)
        return value
      }
    }

    // Check for fuzzy matches (remove spaces and compare)
    const noSpaceCityName = cityName.replace(/\s/g, "")
    for (const [key, value] of Object.entries(cityMappings)) {
      const noSpaceKey = key.replace(/\s/g, "")
      if (noSpaceCityName.includes(noSpaceKey) || noSpaceKey.includes(noSpaceCityName)) {
        console.log("✅ Found fuzzy match:", value)
        return value
      }
    }

    // If no mapping found, capitalize first letter of each word
    const capitalizedName = cityName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    console.log("🔤 No mapping found, using capitalized:", capitalizedName)
    return capitalizedName
  }

  onVoiceError(event) {
    console.error("❌ Voice recognition error:", event.error, event)

    let errorMessage = "Voice recognition error: "

    switch (event.error) {
      case "no-speech":
        errorMessage = "🤐 No speech detected. Please speak louder and clearer. Make sure your microphone is working."
        // Try to restart recognition automatically
        setTimeout(() => {
          if (!this.isListening) {
            console.log("🔄 Auto-restarting voice recognition...")
            this.startVoiceSearch()
          }
        }, 2000)
        break
      case "audio-capture":
        errorMessage = "🎤 Microphone not accessible. Please check your microphone connection and permissions."
        break
      case "not-allowed":
        errorMessage = "🚫 Microphone access denied. Please allow microphone access in your browser settings."
        break
      case "network":
        errorMessage = "🌐 Network error. Please check your internet connection."
        break
      case "service-not-allowed":
        errorMessage = "🔒 Speech service not allowed. Please try refreshing the page."
        break
      case "bad-grammar":
        errorMessage = "📝 Speech not recognized. Please try speaking a city name clearly."
        break
      case "language-not-supported":
        errorMessage = "🗣️ Language not supported. Trying alternative settings..."
        // Try with different language
        setTimeout(() => {
          if (this.recognition) {
            this.recognition.lang = "en-IN"
            this.startVoiceSearch()
          }
        }, 1000)
        break
      default:
        errorMessage += `${event.error}. Please try again.`
    }

    this.showVoiceMessage(errorMessage, "error")
  }

  onVoiceEnd() {
    console.log("🏁 Voice recognition ended")
    this.isListening = false

    // Reset button state after a short delay to show processing
    setTimeout(() => {
      if (this.voiceBtn) {
        this.voiceBtn.classList.remove("listening", "processing")
        this.voiceBtn.innerHTML = "🎤"
        this.voiceBtn.title = "Voice Search"
      }
    }, 2000)

    // Hide voice status after a delay if no error
    setTimeout(() => {
      if (this.voiceStatus && !this.voiceStatus.classList.contains("voice-error")) {
        this.hideVoiceStatus()
      }
    }, 5000)
  }

  showVoiceStatus(message, type = "listening") {
    if (!this.voiceStatus || !this.voiceStatusText) return

    this.voiceStatusText.textContent = message
    this.voiceStatus.className = `voice-status voice-${type}`
    this.voiceStatus.style.display = "block"

    console.log("📢 Voice status:", message)
  }

  showVoiceMessage(message, type = "info") {
    this.showVoiceStatus(message, type)

    // Auto-hide after 7 seconds for errors
    if (type === "error") {
      setTimeout(() => {
        this.hideVoiceStatus()
      }, 7000)
    }
  }

  hideVoiceStatus() {
    if (this.voiceStatus) {
      this.voiceStatus.style.display = "none"
    }
  }

  async loadCitiesWeather() {
    console.log("Loading cities weather...")
    this.showLoading()

    try {
      // Load first 12 cities for better variety
      const citiesToLoad = indianCities.slice(0, 12)
      const weatherPromises = citiesToLoad.map((city) => this.getWeatherData(city.lat, city.lon, city))
      const weatherData = await Promise.all(weatherPromises)

      const validWeatherData = weatherData.filter((data) => data !== null)
      console.log("Loaded weather data for", validWeatherData.length, "cities")

      this.renderCities(validWeatherData)
      this.updateStats(validWeatherData.length)
    } catch (error) {
      console.error("Error loading cities weather:", error)
      this.showError("Failed to load weather data. Please check your API key and internet connection.")
    } finally {
      this.hideLoading()
    }
  }

  async getWeatherData(lat, lon, cityData = null) {
    try {
      const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      console.log("Fetching weather for", cityData?.name || "Unknown city")

      const response = await fetch(url)

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`)
        return null
      }

      const data = await response.json()

      // Enhanced weather condition detection and precipitation information
      const enhancedData = this.enhanceWeatherData(data)

      return {
        ...enhancedData,
        customName: cityData?.name || data.name,
        state: cityData?.state || "",
      }
    } catch (error) {
      console.error(`Error fetching weather for ${cityData?.name}:`, error)
      return null
    }
  }

  enhanceWeatherData(data) {
    const weatherCode = data.weather[0].id
    const description = data.weather[0].description.toLowerCase()
    const humidity = data.main.humidity
    const clouds = data.clouds.all

    let enhancedCondition = data.weather[0].main
    let displayPrecipitation = "N/A" // This will hold the string for display

    // --- Prioritize actual precipitation data if available ---
    if (data.rain && (data.rain["1h"] > 0 || data.rain["3h"] > 0)) {
      const rainAmount = data.rain["1h"] || (data.rain["3h"] / 3).toFixed(1)
      displayPrecipitation = `Rain: ${rainAmount} mm/hr`
      enhancedCondition = "Rain"
    } else if (data.snow && (data.snow["1h"] > 0 || data.snow["3h"] > 0)) {
      const snowAmount = data.snow["1h"] || (data.snow["3h"] / 3).toFixed(1)
      displayPrecipitation = `Snow: ${snowAmount} mm/hr`
      enhancedCondition = "Snow"
    } else {
      // --- If no direct precipitation, determine condition from description and calculate probability ---
      if (description.includes("rain") || description.includes("drizzle")) {
        enhancedCondition = description.includes("drizzle") ? "Drizzle" : "Rain"
        displayPrecipitation = `Rain Probability: ${this.estimateRainProbability(weatherCode, humidity, clouds)}%`
      } else if (description.includes("snow")) {
        enhancedCondition = "Snow"
        displayPrecipitation = `Snow Probability: ${this.estimateRainProbability(weatherCode, humidity, clouds)}%` // Re-using rain probability for snow
      } else {
        // Fallback to general weather codes and calculate probability
        if (weatherCode >= 200 && weatherCode < 300) {
          enhancedCondition = "Thunderstorm"
        } else if (weatherCode >= 700 && weatherCode < 800) {
          enhancedCondition = "Mist"
        } else if (weatherCode === 800) {
          enhancedCondition = "Clear"
        } else if (weatherCode > 800) {
          enhancedCondition = "Clouds"
        }
        displayPrecipitation = `Rain Probability: ${this.estimateRainProbability(weatherCode, humidity, clouds)}%`
      }
    }

    return {
      ...data,
      weather: [
        {
          ...data.weather[0],
          main: enhancedCondition,
        },
      ],
      displayPrecipitation: displayPrecipitation, // Use the new field for display
      enhanced: true,
    }
  }

  /**
   * Estimates rain probability based on weather conditions, humidity, and cloudiness.
   * Note: This is an estimation as OpenWeatherMap's current weather API (2.5) does not provide direct PoP.
   * For precise PoP, the One Call API (3.0) or forecast APIs would be needed.
   */
  estimateRainProbability(weatherCode, humidity, clouds) {
    let probability = 0

    // 1. Weather condition codes as base
    if (weatherCode >= 200 && weatherCode < 300) {
      // Thunderstorm
      probability = 80 + (weatherCode - 200) / 10 // 80-89%
    } else if (weatherCode >= 300 && weatherCode < 400) {
      // Drizzle
      probability = 60 + (weatherCode - 300) / 10 // 60-69%
    } else if (weatherCode >= 500 && weatherCode < 600) {
      // Rain
      probability = 70 + (weatherCode - 500) / 10 // 70-79%
    } else if (weatherCode >= 600 && weatherCode < 700) {
      // Snow
      probability = 65 + (weatherCode - 600) / 10 // 65-74%
    } else if (weatherCode >= 700 && weatherCode < 800) {
      // Atmosphere (Mist, Smoke, Haze, Fog, Sand, Dust, Ash, Squall, Tornado)
      // Probability depends heavily on humidity and clouds here
      probability = 20 + (humidity / 100) * 30 + (clouds / 100) * 20 // 20-70%
    } else if (weatherCode === 800) {
      // Clear sky
      probability = 0 + (humidity / 100) * 5 // 0-5%
    } else if (weatherCode > 800) {
      // Clouds
      probability = (clouds / 100) * 50 + (humidity / 100) * 20 // 0-70%
    }

    // 2. Adjust based on humidity and cloud cover
    probability += (humidity / 100) * 15 // Up to +15% for humidity
    probability += (clouds / 100) * 10 // Up to +10% for clouds

    // Ensure probability is within 0-100 range
    probability = Math.max(0, Math.min(100, probability))

    // Round to nearest integer
    return Math.round(probability)
  }

  renderCities(weatherData) {
    if (!this.citiesGrid) {
      console.error("Cities grid element not found")
      return
    }

    this.citiesGrid.innerHTML = ""

    weatherData.forEach((data) => {
      const cityCard = this.createCityCard(data)
      this.citiesGrid.appendChild(cityCard)
    })
  }

  createCityCard(data) {
    const card = document.createElement("div")
    card.className = "weather-card"
    card.onclick = () => this.showWeatherDetails(data)

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

    // Use displayPrecipitation for the card
    const precipitationHtml =
      data.displayPrecipitation && data.displayPrecipitation !== "N/A"
        ? `<div class="precipitation-info">💧 ${data.displayPrecipitation}</div>`
        : ""

    card.innerHTML = `
      <h3 class="city-name">${data.customName || data.name}</h3>
      <p class="city-state">${data.state}</p>
      <div class="weather-info">
        <div class="temperature">${Math.round(data.main.temp)}<span class="unit">°C</span></div>
        <div class="weather-icon">
          <img src="${iconUrl}" alt="${data.weather[0].description}">
        </div>
      </div>
      <p class="description">${data.weather[0].description}</p>
      ${precipitationHtml}
      <div class="weather-stats">
        <div class="stat">
          <span class="label">Feels like</span>
          <span class="value">${Math.round(data.main.feels_like)}°C</span>
        </div>
        <div class="stat">
          <span class="label">Humidity</span>
          <span class="value">${data.main.humidity}%</span>
        </div>
      </div>
    `

    return card
  }

  async searchCity() {
    const cityName = this.searchInput?.value?.trim()
    if (!cityName) return

    this.showLoading()

    try {
      const url = `${BASE_URL}?q=${cityName},IN&appid=${API_KEY}&units=metric`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("City not found")
      }

      const data = await response.json()
      const enhancedData = this.enhanceWeatherData(data)
      this.showWeatherDetails(enhancedData)
    } catch (error) {
      console.error("Error searching city:", error)
      this.showError("City not found. Please try another city name.")
    } finally {
      this.hideLoading()
    }
  }

  showWeatherDetails(data) {
    if (!this.weatherDetails) return

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
    const dateTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    })

    // Update weather details
    const elements = {
      detailCityName: data.customName || data.name,
      detailDateTime: dateTime,
      detailLocation: `${data.state || data.sys.country}, India`,
      detailTemp: Math.round(data.main.temp),
      detailDescription: data.weather[0].description,
      detailFeelsLike: `${Math.round(data.main.feels_like)}°C`,
      detailHumidity: `${data.main.humidity}%`,
      detailWindSpeed: `${data.wind.speed} m/s`,
      detailPressure: `${data.main.pressure} hPa`,
      detailVisibility: `${(data.visibility / 1000).toFixed(1)} km`,
      detailUvIndex: data.displayPrecipitation || "N/A", // Use the new field for display
    }

    Object.keys(elements).forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        element.textContent = elements[id]
      }
    })

    // Update the UV Index label to show Precipitation
    const uvLabel = document.querySelector("#detailUvIndex").previousElementSibling
    if (uvLabel) {
      uvLabel.textContent = "Precipitation" // General label for both mm/hr and probability
    }

    // Set weather icon
    const iconElement = document.getElementById("detailIcon")
    if (iconElement) {
      iconElement.src = iconUrl
    }

    // Initialize advanced 3D weather animation with enhanced condition
    this.initAdvanced3DWeather(data)

    this.weatherDetails.style.display = "flex"
  }

  initAdvanced3DWeather(data) {
    console.log("Initializing advanced 3D weather:", data.weather[0].main, data.weather[0].description)

    // Clean up previous 3D scene
    if (this.weather3D) {
      this.weather3D.destroy()
    }

    // Check if THREE.js is loaded
    if (typeof THREE === "undefined") {
      console.error("THREE.js not loaded!")
      return
    }

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      try {
        if (window.AdvancedWeather3D) {
          console.log("Creating AdvancedWeather3D instance...")
          this.weather3D = new window.AdvancedWeather3D("weather3DCanvas")

          if (this.weather3D && this.weather3D.scene) {
            console.log("3D scene created successfully, updating weather...")
            // Small delay to ensure scene is fully initialized
            setTimeout(() => {
              this.weather3D.updateWeather(
                data.weather[0].main,
                data.weather[0].description,
                data.main.temp,
                data.main.humidity,
                data.wind.speed,
              )
            }, 500)
          } else {
            console.error("Failed to create 3D scene")
          }
        } else {
          console.error("AdvancedWeather3D class not found")
        }
      } catch (error) {
        console.error("Error initializing advanced 3D weather:", error)
      }
    }, 300)
  }

  closeDetails() {
    if (this.weatherDetails) {
      this.weatherDetails.style.display = "none"
    }
    if (this.weather3D) {
      this.weather3D.destroy()
      this.weather3D = null
    }
  }

  updateStats(cityCount = indianCities.length) {
    const totalCitiesElement = document.getElementById("totalCities")
    const lastUpdatedElement = document.getElementById("lastUpdated")

    if (totalCitiesElement) {
      totalCitiesElement.textContent = cityCount
    }

    if (lastUpdatedElement) {
      lastUpdatedElement.textContent = "Live"
    }
  }

  showLoading() {
    if (this.loading) {
      this.loading.style.display = "flex"
    }
  }

  hideLoading() {
    if (this.loading) {
      this.loading.style.display = "none"
    }
  }

  showError(message) {
    console.error("Error:", message)

    const existingError = document.querySelector(".error-message")
    if (existingError) existingError.remove()

    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.textContent = message

    const container = document.querySelector(".main .container")
    const featuredCities = document.querySelector(".featured-cities")

    if (container && featuredCities) {
      container.insertBefore(errorDiv, featuredCities)
    } else {
      document.body.appendChild(errorDiv)
    }

    setTimeout(() => errorDiv.remove(), 10000)
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing enhanced weather app with advanced 3D...")
  new EnhancedWeatherApp()
})

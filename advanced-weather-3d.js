// Advanced 3D Weather System with Multiple Effects
class AdvancedWeather3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.scene = null
    this.camera = null
    this.renderer = null
    this.particles = []
    this.animationId = null
    this.weatherType = "clear"
    this.isAnimating = true
    this.currentView = 0
    this.soundEnabled = false

    // Performance tracking
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fps = 60

    // Weather intensity
    this.intensity = 1.0
    this.timeOfDay = "day"

    if (!this.canvas) {
      console.error("Canvas element not found:", canvasId)
      return
    }

    // Check if THREE.js is loaded
    const THREE = window.THREE // Declare the THREE variable
    if (typeof THREE === "undefined") {
      console.error("THREE.js not loaded! Make sure to include Three.js before this script.")
      return
    }

    console.log("THREE.js version:", THREE.REVISION)
    this.init()
  }

  init() {
    try {
      // Create scene
      this.scene = new window.THREE.Scene() // Use window.THREE

      // Create camera with better positioning
      this.camera = new window.THREE.PerspectiveCamera(
        75,
        this.canvas.offsetWidth / this.canvas.offsetHeight,
        0.1,
        1000,
      )
      this.camera.position.set(0, 2, 8)
      this.camera.lookAt(0, 0, 0)

      // Create renderer with enhanced settings
      this.renderer = new window.THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
      })
      this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Enhanced lighting system
      this.setupLighting()

      console.log("Advanced 3D Weather scene initialized successfully")

      // Start with a default sunny effect to test
      this.updateWeather("clear") // Initialize with a default weather state

      this.animate()
      this.setupControls()
    } catch (error) {
      console.error("Error initializing advanced 3D scene:", error)
    }
  }

  setupLighting() {
    // Ambient light
    this.ambientLight = new window.THREE.AmbientLight(0x404040, 0.4)
    this.scene.add(this.ambientLight)

    // Main directional light (sun)
    this.sunLight = new window.THREE.DirectionalLight(0xffffff, 1)
    this.sunLight.position.set(10, 10, 5)
    this.scene.add(this.sunLight)

    // Point lights for atmosphere (can be adjusted based on weather)
    this.atmosphereLight = new window.THREE.PointLight(0x87ceeb, 0.5, 50)
    this.atmosphereLight.position.set(0, 5, 0)
    this.scene.add(this.atmosphereLight)
  }

  setupControls() {
    // Animation controls
    const toggleBtn = document.getElementById("toggleAnimation")
    const changeViewBtn = document.getElementById("changeView")
    const resetViewBtn = document.getElementById("resetView")

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        console.log("Toggle animation clicked")
        this.toggleAnimation()
      })
    }

    if (changeViewBtn) {
      changeViewBtn.addEventListener("click", () => {
        console.log("Change view clicked")
        this.changeView()
      })
    }

    if (resetViewBtn) {
      resetViewBtn.addEventListener("click", () => {
        console.log("Reset view clicked")
        this.resetView()
      })
    }
  }

  resetView() {
    this.currentView = 0
    this.camera.position.set(0, 2, 8)
    this.camera.lookAt(0, 0, 0)

    const btn = document.getElementById("resetView")
    if (btn) {
      btn.innerHTML = "✅ Reset Complete"
      btn.style.backgroundColor = "rgba(76, 175, 80, 0.9)"
      btn.style.color = "white"

      // Reset button appearance after 1.5 seconds
      setTimeout(() => {
        if (btn) {
          btn.innerHTML = "🏠 Reset View"
          btn.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
          btn.style.color = "#333"
        }
      }, 1500)
    }
    console.log("View reset to front position")
  }

  toggleAnimation() {
    this.isAnimating = !this.isAnimating
    const btn = document.getElementById("toggleAnimation")
    if (btn) {
      btn.innerHTML = this.isAnimating ? "⏸️ Pause Animation" : "▶️ Play Animation"
      btn.style.backgroundColor = this.isAnimating ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 107, 107, 0.9)"
    }
    console.log("Animation", this.isAnimating ? "resumed" : "paused")
  }

  changeView() {
    this.currentView = (this.currentView + 1) % 4
    const positions = [
      { x: 0, y: 2, z: 8, name: "Front View" },
      { x: 8, y: 2, z: 0, name: "Side View" },
      { x: 0, y: 8, z: 0, name: "Top View" },
      { x: -5, y: 5, z: 5, name: "Angled View" },
    ]

    const pos = positions[this.currentView]
    this.camera.position.set(pos.x, pos.y, pos.z)
    this.camera.lookAt(0, 0, 0)

    const btn = document.getElementById("changeView")
    if (btn) {
      btn.innerHTML = `🔄 ${pos.name}`
      // Reset button text after 2 seconds
      setTimeout(() => {
        if (btn) btn.innerHTML = "🔄 Change View"
      }, 2000)
    }
    console.log("Changed to", pos.name)
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    const btn = document.getElementById("toggleSound")
    if (btn) {
      btn.innerHTML = this.soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"
      btn.style.backgroundColor = this.soundEnabled ? "rgba(76, 175, 80, 0.9)" : "rgba(255, 255, 255, 0.9)"
    }

    // Show a message since sound is not implemented yet
    if (this.soundEnabled) {
      console.log("Sound enabled (feature coming soon!)")
      // You could add actual sound implementation here later
    } else {
      console.log("Sound disabled")
    }
  }

  // Advanced Rain Effect
  createAdvancedRainEffect() {
    this.clearParticles()
    this.weatherType = "rain"

    // Create rain drops
    const rainGeometry = new window.THREE.BufferGeometry()
    const rainCount = 800
    const positions = new Float32Array(rainCount * 3)

    for (let i = 0; i < rainCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = Math.random() * 20 + 5
      positions[i + 2] = (Math.random() - 0.5) * 20
    }

    rainGeometry.setAttribute("position", new window.THREE.BufferAttribute(positions, 3))

    const rainMaterial = new window.THREE.PointsMaterial({
      color: 0x87ceeb,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
    })

    const rain = new window.THREE.Points(rainGeometry, rainMaterial)
    this.scene.add(rain)
    this.particles.push({ mesh: rain, type: "rain", speed: 0.3 })

    // Add storm clouds
    this.createClouds(0x555555, 4)
    this.updateWeatherInfo("🌧️ Heavy Rain", "High", this.timeOfDay)
  }

  // Advanced Snow Effect
  createAdvancedSnowEffect() {
    this.clearParticles()
    this.weatherType = "snow"

    const snowGeometry = new window.THREE.BufferGeometry()
    const snowCount = 400
    const positions = new Float32Array(snowCount * 3)

    for (let i = 0; i < snowCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = Math.random() * 20 + 5
      positions[i + 2] = (Math.random() - 0.5) * 20
    }

    snowGeometry.setAttribute("position", new window.THREE.BufferAttribute(positions, 3))

    const snowMaterial = new window.THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      transparent: true,
      opacity: 0.9,
    })

    const snow = new window.THREE.Points(snowGeometry, snowMaterial)
    this.scene.add(snow)
    this.particles.push({ mesh: snow, type: "snow", speed: 0.08 })

    this.createClouds(0xcccccc, 4)
    this.updateWeatherInfo("❄️ Heavy Snow", "High", this.timeOfDay)
  }

  // Advanced Sunny Effect
  createAdvancedSunnyEffect() {
    this.clearParticles()
    this.weatherType = "sunny"

    // Create animated sun
    const sunGeometry = new window.THREE.SphereGeometry(1.2, 32, 32)
    const sunMaterial = new window.THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9,
    })
    const sun = new window.THREE.Mesh(sunGeometry, sunMaterial)
    sun.position.set(4, 6, -2)
    this.scene.add(sun)
    this.particles.push({ mesh: sun, type: "sun", rotationSpeed: 0.01 })

    // Create sun rays
    for (let i = 0; i < 12; i++) {
      const rayGeometry = new window.THREE.PlaneGeometry(0.1, 4)
      const rayMaterial = new window.THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.4,
      })
      const ray = new window.THREE.Mesh(rayGeometry, rayMaterial)
      ray.position.copy(sun.position)
      ray.rotation.z = (i * Math.PI) / 6
      this.scene.add(ray)
      this.particles.push({ mesh: ray, type: "ray", rotationSpeed: 0.008 })
    }

    // Add floating particles
    this.createFloatingParticles(0xffd700, 150, 0.05)
    this.updateWeatherInfo("☀️ Bright Sunny", "High", this.timeOfDay)
  }

  // Advanced Cloudy Effect
  createAdvancedCloudyEffect() {
    this.clearParticles()
    this.weatherType = "cloudy"
    this.renderer.setClearColor(0x87ceeb, 1)
    this.scene.fog = new window.THREE.Fog(0x87ceeb, 15, 60) // Add fog for cloudy

    this.createClouds(0xb0c4de, 6)
    this.createFloatingParticles(0xb0c4de, 200, 0.03)
    this.updateWeatherInfo("☁️ Overcast", "Medium", this.timeOfDay)
  }

  // Advanced Thunderstorm
  createAdvancedThunderstormEffect() {
    this.clearParticles()
    this.weatherType = "thunderstorm"
    this.renderer.setClearColor(0x1a1a1a, 1)
    this.scene.fog = new window.THREE.Fog(0x1a1a1a, 5, 40) // Add dense fog for thunderstorm

    // Heavy rain
    this.createAdvancedRainEffect() // This will also set fog

    // Lightning effect
    const lightningGeometry = new window.THREE.PlaneGeometry(0.3, 8)
    const lightningMaterial = new window.THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    })
    const lightning = new window.THREE.Mesh(lightningGeometry, lightningMaterial)
    lightning.position.set(2, 4, -1)
    this.scene.add(lightning)
    this.particles.push({ mesh: lightning, type: "lightning" })

    this.updateWeatherInfo("⛈️ Thunderstorm", "Extreme", this.timeOfDay)
  }

  // Advanced Mist Effect
  createAdvancedMistEffect() {
    this.clearParticles()
    this.weatherType = "mist"
    this.renderer.setClearColor(0xd3d3d3, 1)
    this.scene.fog = new window.THREE.Fog(0xd3d3d3, 5, 30) // Add dense fog for mist

    const mistGeometry = new window.THREE.BufferGeometry()
    const mistCount = 300
    const positions = new Float32Array(mistCount * 3)

    for (let i = 0; i < mistCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 25
      positions[i + 1] = Math.random() * 8
      positions[i + 2] = (Math.random() - 0.5) * 25
    }

    mistGeometry.setAttribute("position", new window.THREE.BufferAttribute(positions, 3))

    const mistMaterial = new window.THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.4,
    })

    const mist = new window.THREE.Points(mistGeometry, mistMaterial)
    this.scene.add(mist)
    this.particles.push({ mesh: mist, type: "mist", speed: 0.02 })

    this.createClouds(0xa9a9a9, 4)
    this.updateWeatherInfo("🌫️ Dense Fog", "High", this.timeOfDay)
  }

  createClouds(color = 0xffffff, count = 3) {
    // Clear existing clouds if any
    this.particles = this.particles.filter((p) => p.type !== "cloud")

    for (let i = 0; i < count; i++) {
      const cloudGroup = new window.THREE.Group()
      const numSubSpheres = Math.floor(Math.random() * 5) + 3 // 3 to 7 sub-spheres per cloud

      for (let j = 0; j < numSubSpheres; j++) {
        const subSphereRadius = 0.8 + Math.random() * 0.7 // Vary size
        const cloudGeometry = new window.THREE.SphereGeometry(subSphereRadius, 16, 16)
        const cloudMaterial = new window.THREE.MeshLambertMaterial({
          color: color,
          transparent: true,
          opacity: 0.7 + Math.random() * 0.2, // Vary opacity
        })
        const subCloud = new window.THREE.Mesh(cloudGeometry, cloudMaterial)

        // Position sub-spheres relative to the group center
        subCloud.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1, (Math.random() - 0.5) * 2)
        cloudGroup.add(subCloud)
      }

      // Scale the entire cloud group
      const scaleFactor = 1.5 + Math.random() * 1.0
      cloudGroup.scale.set(scaleFactor, scaleFactor * (0.5 + Math.random() * 0.5), scaleFactor)

      // Position the entire cloud group in the scene
      cloudGroup.position.set(
        (Math.random() - 0.5) * 15, // Wider spread
        Math.random() * 4 + 3, // Higher up
        (Math.random() - 0.5) * 15,
      )
      this.scene.add(cloudGroup)
      this.particles.push({
        mesh: cloudGroup,
        type: "cloud",
        driftSpeed: 0.005 + Math.random() * 0.01, // Slower, more subtle drift
      })
    }
  }

  createFloatingParticles(color, count, speed) {
    const particleGeometry = new window.THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18
      positions[i + 1] = (Math.random() - 0.5) * 12
      positions[i + 2] = (Math.random() - 0.5) * 18
    }

    particleGeometry.setAttribute("position", new window.THREE.BufferAttribute(positions, 3))

    const particleMaterial = new window.THREE.PointsMaterial({
      color: color,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
    })

    const particles = new window.THREE.Points(particleGeometry, particleMaterial)
    this.scene.add(particles)
    this.particles.push({ mesh: particles, type: "floating", speed: speed })
  }

  updateWeather(weatherCondition, description = "", temperature = 25, humidity = 50, windSpeed = 5) {
    if (!this.scene) return

    const condition = weatherCondition.toLowerCase()
    console.log("Updating advanced 3D weather to:", condition, description)

    // Determine time of day
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) this.timeOfDay = "morning"
    else if (hour >= 12 && hour < 18) this.timeOfDay = "afternoon"
    else if (hour >= 18 && hour < 21) this.timeOfDay = "evening"
    else this.timeOfDay = "night"

    // Create appropriate weather effect
    if (condition.includes("rain") || condition.includes("drizzle")) {
      this.createAdvancedRainEffect()
    } else if (condition.includes("snow")) {
      this.createAdvancedSnowEffect()
    } else if (condition.includes("clear") || condition.includes("sunny")) {
      this.createAdvancedSunnyEffect()
    } else if (condition.includes("cloud")) {
      this.createAdvancedCloudyEffect()
    } else if (condition.includes("thunder") || condition.includes("storm")) {
      this.createAdvancedThunderstormEffect()
    } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
      this.createAdvancedMistEffect()
    } else {
      this.createAdvancedSunnyEffect() // Default to sunny
    }
  }

  updateWeatherInfo(type, intensity, timeOfDay) {
    const typeIndicator = document.getElementById("weatherTypeIndicator")
    const intensityIndicator = document.getElementById("weatherIntensity")
    const timeIndicator = document.getElementById("weatherTime")

    if (typeIndicator) typeIndicator.textContent = type
    if (intensityIndicator) intensityIndicator.textContent = `Intensity: ${intensity}`
    if (timeIndicator) timeIndicator.textContent = `Time: ${timeOfDay}`
  }

  updateStats() {
    // Update particle count
    const particleCount = this.particles.reduce((count, particle) => {
      if (particle.mesh.geometry && particle.mesh.geometry.attributes.position) {
        return count + particle.mesh.geometry.attributes.position.count
      }
      return count + 1
    }, 0)

    const particleElement = document.getElementById("particleCount")
    if (particleElement) {
      particleElement.textContent = particleCount.toLocaleString()
    }

    // Update FPS
    this.frameCount++
    const currentTime = performance.now()
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
      this.frameCount = 0
      this.lastTime = currentTime

      const fpsElement = document.getElementById("fpsCounter")
      if (fpsElement) {
        fpsElement.textContent = this.fps
      }
    }
  }

  clearParticles() {
    this.particles.forEach((particle) => {
      this.scene.remove(particle.mesh)
      if (particle.mesh.geometry) particle.mesh.geometry.dispose()
      if (particle.mesh.material) {
        // Dispose of materials if they are not shared
        if (Array.isArray(particle.mesh.material)) {
          particle.mesh.material.forEach((m) => m.dispose())
        } else {
          particle.mesh.material.dispose()
        }
      }
    })
    this.particles = []
  }

  animate() {
    if (!this.renderer || !this.scene || !this.camera) return

    this.animationId = requestAnimationFrame(() => this.animate())

    if (!this.isAnimating) return

    // Update all particles
    this.particles.forEach((particle) => {
      this.updateParticle(particle)
    })

    // Update performance stats
    this.updateStats()

    this.renderer.render(this.scene, this.camera)
  }

  updateParticle(particle) {
    const time = Date.now() * 0.001

    switch (particle.type) {
      case "rain":
        this.updateRainParticle(particle)
        break
      case "snow":
        this.updateSnowParticle(particle)
        break
      case "sun":
        particle.mesh.rotation.y += particle.rotationSpeed
        particle.mesh.rotation.z += particle.rotationSpeed * 0.5
        break
      case "ray":
        particle.mesh.rotation.z += particle.rotationSpeed
        break
      case "lightning":
        if (Math.random() < 0.008) {
          particle.mesh.material.opacity = 1
          setTimeout(() => {
            if (particle.mesh.material) {
              particle.mesh.material.opacity = 0
            }
          }, 150)
        }
        break
      case "cloud":
        particle.mesh.position.x += particle.driftSpeed
        if (particle.mesh.position.x > 12) {
          particle.mesh.position.x = -12
        }
        break
      case "floating":
      case "mist":
        this.updateFloatingParticle(particle)
        break
    }
  }

  updateRainParticle(particle) {
    const positions = particle.mesh.geometry.attributes.position.array

    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= particle.speed
      if (positions[i] < -10) {
        positions[i] = 25
        positions[i - 1] = (Math.random() - 0.5) * 20
        positions[i + 1] = (Math.random() - 0.5) * 20
      }
    }
    particle.mesh.geometry.attributes.position.needsUpdate = true
  }

  updateSnowParticle(particle) {
    const positions = particle.mesh.geometry.attributes.position.array
    const time = Date.now() * 0.001

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += Math.sin(time + i) * 0.02
      positions[i + 1] -= particle.speed
      positions[i + 2] += Math.cos(time + i) * 0.02

      if (positions[i + 1] < -10) {
        positions[i + 1] = 20
        positions[i] = (Math.random() - 0.5) * 20
        positions[i + 2] = (Math.random() - 0.5) * 20
      }
    }
    particle.mesh.geometry.attributes.position.needsUpdate = true
  }

  updateFloatingParticle(particle) {
    const positions = particle.mesh.geometry.attributes.position.array
    const time = Date.now() * 0.001

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += Math.sin(time + i) * particle.speed
      positions[i + 1] += Math.cos(time + i * 0.5) * particle.speed * 0.5
      positions[i + 2] += Math.sin(time + i * 0.3) * particle.speed
    }
    particle.mesh.geometry.attributes.position.needsUpdate = true
  }

  resize() {
    if (!this.camera || !this.renderer || !this.canvas) return

    this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight)
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.clearParticles()
    if (this.renderer) {
      this.renderer.dispose()
    }
    if (this.scene) {
      this.scene.fog = null // Remove fog when destroying scene
    }
  }
}

// Make it globally available
window.AdvancedWeather3D = AdvancedWeather3D

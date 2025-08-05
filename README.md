# indian-wheather-pro

# 🌤️ India Weather 3D Pro

An advanced 3D weather visualization web application for Indian cities with voice search capabilities. Built with vanilla JavaScript, Three.js, and the OpenWeatherMap API.

![Weather App Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=India+Weather+3D+Pro)

## ✨ Features

- **🎤 Voice Search**: Speak city names instead of typing
- **🌍 3D Weather Visualization**: Advanced particle effects for different weather conditions
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🏙️ 20+ Indian Cities**: Pre-loaded weather data for major Indian cities
- **⚡ Real-time Data**: Live weather updates from OpenWeatherMap API
- **🎨 Beautiful UI**: Modern glassmorphism design with smooth animations
- **🔄 Interactive Controls**: Multiple camera views and animation controls

## 🎯 Weather Effects

- ☀️ **Sunny**: Animated sun with rotating rays and floating particles
- 🌧️ **Rain**: Realistic falling raindrops with storm clouds
- ❄️ **Snow**: Gentle snowfall with swirling motion
- ☁️ **Cloudy**: Floating clouds with atmospheric particles
- ⛈️ **Thunderstorm**: Lightning effects with heavy rain
- 🌫️ **Mist/Fog**: Dense fog particles with reduced visibility

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **3D Graphics**: Three.js
- **API**: OpenWeatherMap API
- **Voice Recognition**: Web Speech API
- **Design**: Glassmorphism, CSS Grid, Flexbox
- **Icons**: Weather icons from OpenWeatherMap

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Web Browser**: Chrome, Edge, Safari, or Firefox (Chrome recommended for voice features)
2. **Code Editor**: Visual Studio Code (recommended)
3. **Live Server Extension**: For VS Code (required for local development)
4. **OpenWeatherMap API Key**: Free account required
5. **Microphone**: For voice search functionality
6. **HTTPS Connection**: Required for microphone access (Live Server provides this)

## 🚀 Getting Started

### Step 1: Clone or Download

\`\`\`bash
# Option 1: Clone the repository
git clone https://github.com/yourusername/india-weather-3d-pro.git
cd india-weather-3d-pro

# Option 2: Download ZIP file and extract
\`\`\`

### Step 2: Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to "API Keys" section
4. Copy your API key

### Step 3: Configure API Key

1. Open `script.js` file
2. Find line 2: `const API_KEY = "79e671270479fb520a536b11ae5416f0"`
3. Replace with your API key:
   \`\`\`javascript
   const API_KEY = "your_actual_api_key_here"
   \`\`\`

### Step 4: Install VS Code Extensions

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Install **Live Server** by Ritwick Dey

### Step 5: Run the Application

1. Open the project folder in VS Code
2. Right-click on `index.html`
3. Select **"Open with Live Server"**
4. The app will open in your browser at `http://127.0.0.1:5500`

## 🎤 Voice Search Setup

### Browser Permissions

1. **Allow Microphone Access**: Click "Allow" when prompted
2. **Check Browser Settings**: Ensure microphone is not blocked
3. **HTTPS Required**: Live Server automatically provides HTTPS

### Supported Voice Commands

Speak any of these city names clearly:

- **Major Cities**: Mumbai, Delhi, Bangalore, Chennai, Kolkata
- **Alternative Names**: Bombay (Mumbai), Madras (Chennai), Calcutta (Kolkata)
- **Pronunciation Variations**: The app handles common mispronunciations

### Voice Search Tips

- 🗣️ **Speak Clearly**: Use normal speaking volume
- 🎯 **City Names Only**: Say just the city name (e.g., "Mumbai")
- 🔄 **Retry if Needed**: Click microphone button again if not recognized
- 🌐 **Internet Required**: Voice recognition needs internet connection

## 📁 Project Structure

\`\`\`
india-weather-3d-pro/
├── index.html                 # Main HTML file
├── styles.css                 # CSS styles and animations
├── script.js                  # Main JavaScript application
├── advanced-weather-3d.js     # 3D weather effects with Three.js
├── config.json               # Configuration settings
├── scripts/                  # Python scripts for data processing
│   ├── requirements.txt      # Python dependencies
│   ├── weather_api.py       # Weather API utilities
│   └── weather_data.json    # Sample weather data
└── README.md                 # This file
\`\`\`

## 🔧 Configuration

### API Settings (config.json)

\`\`\`json
{
  "api": {
    "provider": "OpenWeatherMap",
    "base_url": "https://api.openweathermap.org/data/2.5/weather"
  },
  "cities": {
    "total": 20,
    "country": "India",
    "update_interval": "10 minutes"
  }
}
\`\`\`

### Supported Cities

The app includes weather data for these Indian cities:

- Mumbai, Delhi, Bangalore, Hyderabad, Chennai
- Kolkata, Pune, Ahmedabad, Jaipur, Surat
- Lucknow, Kanpur, Nagpur, Indore, Bhopal
- Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana

## 🎮 How to Use

### 1. Voice Search
- Click the 🎤 microphone button
- Speak a city name clearly
- Wait for recognition and automatic search

### 2. Text Search
- Type city name in the search box
- Press Enter or click Search button

### 3. 3D Weather Controls
- **⏸️ Pause/Play**: Toggle weather animations
- **🔄 Change View**: Switch camera angles
- **🏠 Reset View**: Return to default view

### 4. City Weather Cards
- Click any city card to view detailed weather
- See 3D weather visualization
- View comprehensive weather stats

## 🐛 Troubleshooting

### Voice Search Issues

**Problem**: "No speech detected"
- **Solution**: Check microphone permissions, speak louder, ensure HTTPS

**Problem**: City not recognized
- **Solution**: Try alternative names (e.g., "Bombay" for Mumbai)

**Problem**: Microphone access denied
- **Solution**: Allow microphone in browser settings, refresh page

### API Issues

**Problem**: "City not found" error
- **Solution**: Check API key, verify internet connection

**Problem**: Weather data not loading
- **Solution**: Ensure API key is valid, check browser console for errors

### 3D Graphics Issues

**Problem**: 3D effects not working
- **Solution**: Use modern browser, check if WebGL is supported

**Problem**: Poor performance
- **Solution**: Close other browser tabs, use Chrome for better performance

## 🔒 Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Voice Search | ✅ | ✅ | ✅ | ❌ |
| 3D Graphics | ✅ | ✅ | ✅ | ✅ |
| Responsive Design | ✅ | ✅ | ✅ | ✅ |
| Weather API | ✅ | ✅ | ✅ | ✅ |

## 📱 Mobile Support

- **Touch-friendly**: All buttons optimized for touch
- **Responsive Layout**: Adapts to different screen sizes
- **Voice Search**: Works on mobile browsers that support Web Speech API
- **3D Performance**: Optimized for mobile GPUs

## 🚀 Deployment Options

### Option 1: GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via `https://yourusername.github.io/repository-name`

### Option 2: Netlify
1. Drag and drop project folder to [Netlify](https://netlify.com)
2. Get instant HTTPS deployment
3. Automatic updates on code changes

### Option 3: Vercel
1. Connect GitHub repository to [Vercel](https://vercel.com)
2. Automatic deployments on commits
3. Built-in HTTPS and CDN

## 🔐 Security Notes

- **API Key**: Keep your OpenWeatherMap API key secure
- **HTTPS**: Required for microphone access
- **Permissions**: App only requests microphone access
- **No Data Storage**: No personal data is stored locally

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap**: Weather data API
- **Three.js**: 3D graphics library
- **Web Speech API**: Voice recognition
- **Google Fonts**: Inter font family

## 📞 Support

If you encounter any issues:

1. Check the browser console (F12) for error messages
2. Verify all prerequisites are met
3. Ensure API key is correctly configured
4. Try different browsers for compatibility

## 🔄 Updates

### Version 1.0.0
- Initial release with voice search
- 3D weather visualization
- 20+ Indian cities support
- Responsive design

---

**Made with ❤️ for weather enthusiasts in India**

For more information, visit the [project repository](https://github.com/yourusername/india-weather-3d-pro).

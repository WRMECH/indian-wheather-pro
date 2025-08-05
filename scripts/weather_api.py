import requests
import json
from datetime import datetime
import os

class IndiaWeatherAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"
        
        # Major Indian cities with coordinates
        self.indian_cities = [
            {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
            {"name": "Delhi", "lat": 28.7041, "lon": 77.1025},
            {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946},
            {"name": "Hyderabad", "lat": 17.3850, "lon": 78.4867},
            {"name": "Chennai", "lat": 13.0827, "lon": 80.2707},
            {"name": "Kolkata", "lat": 22.5726, "lon": 88.3639},
            {"name": "Pune", "lat": 18.5204, "lon": 73.8567},
            {"name": "Ahmedabad", "lat": 23.0225, "lon": 72.5714},
            {"name": "Jaipur", "lat": 26.9124, "lon": 75.7873},
            {"name": "Surat", "lat": 21.1702, "lon": 72.8311},
            {"name": "Lucknow", "lat": 26.8467, "lon": 80.9462},
            {"name": "Kanpur", "lat": 26.4499, "lon": 80.3319},
            {"name": "Nagpur", "lat": 21.1458, "lon": 79.0882},
            {"name": "Indore", "lat": 22.7196, "lon": 75.8577},
            {"name": "Bhopal", "lat": 23.2599, "lon": 77.4126},
            {"name": "Visakhapatnam", "lat": 17.6868, "lon": 83.2185},
            {"name": "Patna", "lat": 25.5941, "lon": 85.1376},
            {"name": "Vadodara", "lat": 22.3072, "lon": 73.1812},
            {"name": "Ghaziabad", "lat": 28.6692, "lon": 77.4538},
            {"name": "Ludhiana", "lat": 30.9010, "lon": 75.8573}
        ]

    def get_weather_by_coordinates(self, lat, lon):
        """Get weather data by latitude and longitude"""
        try:
            url = f"{self.base_url}?lat={lat}&lon={lon}&appid={self.api_key}&units=metric"
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data: {e}")
            return None

    def get_weather_by_city(self, city_name):
        """Get weather data by city name"""
        try:
            url = f"{self.base_url}?q={city_name},IN&appid={self.api_key}&units=metric"
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data for {city_name}: {e}")
            return None

    def get_all_cities_weather(self):
        """Get weather data for all major Indian cities"""
        weather_data = []
        
        for city in self.indian_cities:
            print(f"Fetching weather for {city['name']}...")
            data = self.get_weather_by_coordinates(city['lat'], city['lon'])
            
            if data:
                weather_info = self.format_weather_data(data, city['name'])
                weather_data.append(weather_info)
            
        return weather_data

    def format_weather_data(self, data, custom_name=None):
        """Format weather data into a readable structure"""
        return {
            "city": custom_name or data['name'],
            "country": data['sys']['country'],
            "temperature": round(data['main']['temp']),
            "feels_like": round(data['main']['feels_like']),
            "humidity": data['main']['humidity'],
            "pressure": data['main']['pressure'],
            "description": data['weather'][0]['description'].title(),
            "icon": data['weather'][0]['icon'],
            "wind_speed": data['wind']['speed'],
            "wind_direction": data['wind'].get('deg', 0),
            "visibility": data.get('visibility', 0) / 1000,  # Convert to km
            "coordinates": {
                "lat": data['coord']['lat'],
                "lon": data['coord']['lon']
            },
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    def save_weather_data(self, filename="weather_data.json"):
        """Save weather data to JSON file"""
        weather_data = self.get_all_cities_weather()
        
        with open(filename, 'w') as f:
            json.dump(weather_data, f, indent=2)
        
        print(f"Weather data saved to {filename}")
        return weather_data

    def display_weather_summary(self):
        """Display a summary of weather conditions"""
        weather_data = self.get_all_cities_weather()
        
        print("\n" + "="*60)
        print("INDIA WEATHER SUMMARY")
        print("="*60)
        
        for city_data in weather_data:
            print(f"\n🌍 {city_data['city']}")
            print(f"   Temperature: {city_data['temperature']}°C (Feels like {city_data['feels_like']}°C)")
            print(f"   Condition: {city_data['description']}")
            print(f"   Humidity: {city_data['humidity']}%")
            print(f"   Wind: {city_data['wind_speed']} m/s")
            print(f"   Updated: {city_data['timestamp']}")

def main():
    # You need to get a free API key from https://openweathermap.org/api
    API_KEY = "79e671270479fb520a536b11ae5416f0"  # Replace with your actual API key
    
    if API_KEY == "YOUR_API_KEY_HERE":
        print("Please get an API key from https://openweathermap.org/api")
        print("Replace 'YOUR_API_KEY_HERE' with your actual API key")
        return
    
    # Initialize the weather API
    weather_api = IndiaWeatherAPI(API_KEY)
    
    # Display weather summary
    weather_api.display_weather_summary()
    
    # Save data to JSON file
    weather_api.save_weather_data()
    
    # Example: Get weather for a specific city
    print("\n" + "="*60)
    print("SEARCH SPECIFIC CITY")
    print("="*60)
    
    city_name = input("Enter city name (or press Enter to skip): ").strip()
    if city_name:
        weather_data = weather_api.get_weather_by_city(city_name)
        if weather_data:
            formatted_data = weather_api.format_weather_data(weather_data)
            print(f"\n🌍 {formatted_data['city']}")
            print(f"   Temperature: {formatted_data['temperature']}°C")
            print(f"   Condition: {formatted_data['description']}")
            print(f"   Humidity: {formatted_data['humidity']}%")
            print(f"   Wind: {formatted_data['wind_speed']} m/s")

if __name__ == "__main__":
    main()

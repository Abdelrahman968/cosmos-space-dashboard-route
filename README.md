# 🚀 COSMOS - Space Explorer Dashboard

A modern, interactive web application that brings the wonders of space exploration to your browser. COSMOS provides real-time space data, stunning astronomy imagery, and comprehensive information about our solar system.

![COSMOS Dashboard](./assets/images/favicon.png)

## ✨ Features

### 🌌 Today in Space (APOD)
- **NASA Astronomy Picture of the Day**: View stunning daily images and videos from NASA
- **Custom Date Selection**: Explore space imagery from any date since June 16, 1995
- **Full Resolution Images**: Access high-quality versions of all images
- **Detailed Information**: Read expert explanations and copyright information
- **Responsive Image Viewer**: Beautiful presentation on all devices

### 🚀 Launches Tracker
- **Upcoming Launches**: Track the next 10 upcoming space launches
- **Featured Launch**: Highlighted next major launch with detailed information
- **Real-time Countdown**: Days until launch counter
- **Launch Details**: 
  - Launch date and time (UTC)
  - Location and country
  - Rocket configuration
  - Mission description
  - Launch provider information
- **External Links**: Direct links to detailed launch information

### 🪐 Planets Explorer
- **Interactive Planet Cards**: Click any planet to view detailed information
- **Comprehensive Data**:
  - Physical characteristics (mass, radius, density)
  - Orbital parameters (period, distance, eccentricity)
  - Discovery information
  - Atmospheric conditions
  - Moon count
- **Planet Comparison Table**: Side-by-side comparison of all planets
- **Quick Facts**: Interesting information about each celestial body
- **Wikipedia Integration**: Learn more about each planet

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Tailwind CSS utilities
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Beautiful icons
- **SweetAlert2** - Elegant error handling
- **Google Fonts** - Space Grotesk & Inter typography

## 📡 APIs Used

1. **NASA APOD API**
   - Endpoint: `https://api.nasa.gov/planetary/apod`
   - Provides daily astronomy pictures and descriptions

2. **The Space Devs Launch Library API**
   - Endpoint: `https://ll.thespacedevs.com/2.3.0/launches/upcoming/`
   - Real-time rocket launch information

3. **Solar System OpenData API**
   - Endpoint: `https://solar-system-opendata-proxy.vercel.app/api/planets`
   - Comprehensive planetary data

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls
- (Optional) A NASA API key for higher rate limits

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdelrahman968/cosmos-space-dashboard-route.git
   cd cosmos-space-dashboard-route
   ```

2. **Set up your NASA API Key** (Optional)
   - Get a free API key from [NASA API Portal](https://api.nasa.gov/)
   - Replace the API key in `assets/js/index.js`:
   ```javascript
   const NASA_API_KEY = 'YOUR_API_KEY_HERE';
   ```

3. **Launch the application**
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

4. **Access the dashboard**
   - Navigate to `http://localhost:8000` (or your local server address)

## 📁 Project Structure

```
cosmos-space-dashboard/
│
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   ├── style.css      # Custom styles
│   │   └── main.css       # Main stylesheet
│   ├── js/
│   │   └── index.js       # Main JavaScript file
│   └── images/            # Static images and placeholders
│       ├── favicon.png
│       ├── placeholder.webp
│       ├── launch-placeholder.png
│       └── [planet-images].png
│
└── README.md              # This file
```

## 🎨 Key Features Implementation

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile devices
- Adaptive grid layouts
- Touch-friendly interface

### Error Handling
- Graceful API failure handling
- User-friendly error messages with SweetAlert2
- Fallback placeholder images
- Retry mechanisms

### Performance
- Efficient DOM manipulation
- Optimized API calls
- Image lazy loading
- Minimal dependencies

## 🔧 Configuration

### API Rate Limits
- **NASA APOD**: 1000 requests/hour with API key, 30/hour without
- **Space Devs**: Rate limits apply, cached data recommended
- **Solar System OpenData**: Open access

### Customization
You can customize various aspects of the dashboard:

- **Number of launches**: Modify `limitNumber` parameter in `spaceDevsLaunchesAPI()`
- **Date range**: Adjust `min` attribute in the date input
- **Styling**: Edit CSS files in `assets/css/`

## 🌟 Usage

### Navigation
- Use the sidebar to switch between sections
- Click on planet cards to view detailed information
- Use the date picker to explore historical space images

### Interactions
- **Today in Space**: Click "Today" to view current day's image
- **Launches**: Click "Details" buttons for more information
- **Planets**: Click any planet card to update the details panel

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Abdelrahman**
- GitHub: [@Abdelrahman968](https://github.com/Abdelrahman968)

## 🙏 Acknowledgments

- NASA for the incredible APOD API
- The Space Devs for launch tracking data
- Solar System OpenData for planetary information
- The space exploration community for inspiration

## 📧 Contact

For questions or feedback, please open an issue on GitHub or reach out through the repository.

## 🔮 Future Enhancements

- [ ] ISS location tracker
- [ ] Mars rover images
- [ ] Asteroid tracker
- [ ] Space news feed
- [ ] User favorites system
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Export data functionality

---

⭐ Star this repository if you find it helpful!

🌌 Happy Space Exploring! 🚀

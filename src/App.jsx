import React , {useState} from "react";
import { IoIosSearch } from "react-icons/io";
import { GiPaperWindmill } from "react-icons/gi";
import { WiHumidity } from "react-icons/wi";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
// import wicon from "../src/assets/wicon.png";

const App = () => {
  
const API_KEY = "6fc84f4416bea6da4a380209f59bf8ea"; // Replace with your actual API key
const [search, setSearch] = useState(""); // State for search input
const [loading, setLoading] = useState(false); // State for loading status
const [temperature, setTemperature] = useState(null); // State for temperature data
const [humidity, setHumidity] = useState(null); // State for humidity data
const [windSpeed, setWindSpeed] = useState(null); // State for wind speed
const [weatherIcon, setWeatherIcon] = useState("01d"); // State for weather icon
const [feelsLike, setFeelsLike] = useState(null); // State for feels like temperature
const [cityName, setCityName] = useState(""); // State for city name

  async function fetchWeatherData() {
    if (!search) return; // Prevent fetch if search is empty
    setLoading(true); // Set loading to true when fetching starts
    try {
      axios.get;
      // First, get lat/lon from city name using Direct Geocoding API
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${API_KEY}`
      );
      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error("City not found");
      }
      const { lat, lon } = geoResponse.data[0];

      // Then, fetch weather data using lat/lon
      const weatherResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` // Use metric units for Celsius
      );
      const data = weatherResponse.data;
      if (!data || !data.main || !data.weather || data.weather.length === 0) {
        throw new Error("City not found");
      }
      console.log(data); // Log the fetched data for debugging
      if(data.main && data.weather) {
        setTemperature(data.main.temp); // Set temperature
        setFeelsLike(data.main.feels_like); // Set feels like temperature
        setHumidity(data.main.humidity); // Set humidity
        setWindSpeed(data.wind.speed); // Set wind speed
        setCityName(data.name); // Set city name
        setWeatherIcon(data.weather[0].icon); // Set weather icon
      }
      // Here you can update the state with the fetched data
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data: " + error.message);
      setCityName("City not found"); // Set city name to "City not found" if error occurs
      setTemperature(null); // Reset temperature
      setFeelsLike(null); // Reset feels like temperature
      setHumidity(null); // Reset humidity
      setWindSpeed(null); // Reset wind speed
      setWeatherIcon("01d"); // Reset weather icon to default clear sky icon
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-blue-800 text-white">
        {/* Header Section */}
        <div className="flex items-center justify-between w-full max-w-4xl p-4 bg-white rounded-full shadow-lg text-gray-800">
          <input
            type="text"
            placeholder="Search for a city..."
            value={search} 
            onChange={(e) => setSearch(e.target.value)} // Controlled input, replace with state if needed
            className=" flex-1 rounded-full p-2 w-full text-gray-800 outline-none bold text-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
              fetchWeatherData();
              }
            }}
            />
            <IoIosSearch onClick={fetchWeatherData} className="text-gray-600 cursor-pointer w-6 h-6"  />
          </div>

          {/* Weather icon*/}
        <img src={`http://openweathermap.org/img/wn/${weatherIcon}.png`} alt="Weather Icon" className="w-24 h-24 mt-[15px]" />

        {/* Temp and CityName */}
        <h1 className="text-5xl font-bold mb-[10px]">
          <h2 className="inline">Temperature : </h2>
          {temperature !== null ? `${temperature}°C` : "N/A"}
        </h1>
        <h1 className="text-5xl font-bold mb-[13px]">
          <h2 className="inline">Feels Like : </h2>
          {feelsLike !== null ? `${feelsLike}°C` : "N/A"}
        </h1>
        <h2 className="text-2xl mt-2 font-semibold">{cityName}</h2>
        {/* Wind Speed and Humidity */}
        <div className=" flex flex-col md:flex-row items-center justify-around w-full max-w-4xl mt-8 p-4 bg-white rounded-full shadow-lg text-gray-800">
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <GiPaperWindmill className="text-4xl" />
            <span className="text-lg font-medium">{windSpeed !== null ? `${windSpeed} km/h` : "N/A"}</span>
            <p>Wind Speed</p>
          </div>
          <div className="flex flex-col items-center">
            <WiHumidity className="text-4xl" />
            <span className="text-lg font-medium">{humidity !== null ? `${humidity}%` : "N/A"}</span>
            <p>Humidity</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import WeatherCard from './weatherCard';

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const predefinedLocations = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

  useEffect(() => {
    const fetchWeather = async (location) => {
      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=4d25aea3b99b439a9fd74708250501&q=${location}&aqi=no`
        );
        const data = await response.json();
        return data; // Return the data for this specific location
      } catch (error) {
        console.error('Error fetching data for', location, error);
        setError('Failed to load weather data');
        return null; // Return null in case of error to handle gracefully
      }
    };

    const fetchAllWeatherData = async () => {
      try {
        setIsLoading(true);
        const dataPromises = predefinedLocations.map((location) => fetchWeather(location));
        const allData = await Promise.all(dataPromises); // Resolving all promises for each location
        setWeatherData(allData.filter((data) => data !== null)); // Filter out any null results
      } catch (error) {
        console.error('Error fetching all weather data', error);
        setError('Failed to fetch weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllWeatherData();
  }, []);

  if (isLoading) {
    return <p>Loading weather data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-700 to-yellow-400 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl text-black font-bold mb-8">Abraham's Weather Forecast App using React</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {weatherData.map((weather, index) => (
        <WeatherCard key={index} weather={weather} />
      ))}
    </div>
    </div>
  );
}

export default App;
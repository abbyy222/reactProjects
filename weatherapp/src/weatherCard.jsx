import React from 'react';

function WeatherCard({ weather }) {
  // Check if the necessary data is present
  if (!weather || !weather.current || !weather.location) {
    return <p>Loading weather data...</p>;
  }

  // Extract data from the weather object
  const { location, current } = weather;
  const { name } = location;
  const { temp_c, condition, feelslike_c, humidity, wind_kph } = current;

  // Set the background based on weather condition
  const weatherCondition = condition.text.toLowerCase();
  const backgroundClasses = {
    clear: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-600',
    cloudy: 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600',
    rain: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
    snow: 'bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600',
  };

  const bgClass = backgroundClasses[weatherCondition] || 'bg-gradient-to-r from-blue-500 to-purple-600';

  return (
    <div className={`${bgClass} text-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105`}>
      <h2 className="text-3xl font-bold mb-2">{name}</h2>
      <p className="text-xl mb-1">Temperature: {temp_c}°C</p>
      <p className="text-lg mb-1">Weather: {condition.text}</p>
      <p className="text-lg mb-1">Feels Like: {feelslike_c}°C</p>
      <p className="text-lg mb-1">Humidity: {humidity}%</p>
      <p className="text-lg mb-1">Wind Speed: {wind_kph} kph</p>
    </div>
  );
}

export default WeatherCard;
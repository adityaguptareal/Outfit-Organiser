
import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
  loading: boolean;
  error: string | null;
}

// Mock weather data for demonstration
const mockWeatherData = {
  temperature: 22,
  condition: 'Clear',
  icon: 'sun',
  location: 'New York',
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    condition: '',
    icon: '',
    location: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Simulate loading weather data
    const fetchWeather = async () => {
      try {
        // In a real app, we would call a weather API here
        // For demo purposes, we'll use mock data with a delay for loading effect
        setTimeout(() => {
          setWeather({
            ...mockWeatherData,
            loading: false,
            error: null,
          });
        }, 1500);
      } catch (error) {
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch weather data',
        }));
      }
    };

    fetchWeather();
  }, []);

  return weather;
}

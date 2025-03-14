
import React from 'react';
import { useWeather } from '@/hooks/useWeather';
import { Sun, Cloud, CloudRain, CloudSnow, Loader2 } from 'lucide-react';
import GlassmorphicContainer from '../UI/GlassmorphicContainer';

interface WeatherDisplayProps {
  className?: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ className }) => {
  const weather = useWeather();

  // Render weather icon based on condition
  const renderWeatherIcon = () => {
    if (weather.loading) return <Loader2 className="animate-spin" size={24} />;

    switch (weather.icon) {
      case 'sun':
        return <Sun size={24} className="text-yellow-500" />;
      case 'cloud':
        return <Cloud size={24} className="text-gray-500" />;
      case 'rain':
        return <CloudRain size={24} className="text-blue-500" />;
      case 'snow':
        return <CloudSnow size={24} className="text-blue-200" />;
      default:
        return <Sun size={24} className="text-yellow-500" />;
    }
  };

  if (weather.error) {
    return (
      <GlassmorphicContainer className={`p-3 ${className}`}>
        <p className="text-sm text-destructive">Unable to load weather data</p>
      </GlassmorphicContainer>
    );
  }

  return (
    <GlassmorphicContainer className={`px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-full p-2 bg-background/50">
            {renderWeatherIcon()}
          </div>
          <div>
            <p className="text-sm font-medium">
              {weather.loading ? 'Loading...' : `${weather.temperature}°C`}
            </p>
            <p className="text-xs text-muted-foreground">
              {weather.loading ? '' : weather.condition}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-right text-muted-foreground">
            {weather.loading ? '' : weather.location}
          </p>
          <p className="text-xs text-right text-muted-foreground">
            {weather.loading ? '' : new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </GlassmorphicContainer>
  );
};

export default WeatherDisplay;

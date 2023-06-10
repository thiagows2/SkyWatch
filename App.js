import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import axios from "axios";
import DropDownPicker from 'react-native-dropdown-picker';

const apiCredentials = {
  weather13: {
    key: '',
    host: 'open-weather13.p.rapidapi.com',
  },
  geoDB: {
    key: '',
    host: 'wft-geo-db.p.rapidapi.com',
  }
}

export default function App() {
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);

  function convertToCelsius(fahrenheit) {
    return (((fahrenheit - 32) * 5) / 9).toFixed(2);
  }

  async function fetchWeather() {
    if (!city) return;

    setLoading(true);
    const encodedCity = encodeURIComponent(city);
    const options = {
      url: `https://open-weather13.p.rapidapi.com/city/${encodedCity}`,
      headers: {
        "X-RapidAPI-Key": apiCredentials.weather13.key,
        "X-RapidAPI-Host": apiCredentials.weather13.host,
      },
    };

    try {
      const response = await axios.request(options);
      const weatherData = {
        temperature: convertToCelsius(response.data.main.temp),
        minTemperature: convertToCelsius(response.data.main.temp_min),
        maxTemperature: convertToCelsius(response.data.main.temp_max),
      }

      setWeather(weatherData);
      setLoading(false);
    } catch (error) {
      console.error("Erro na chamada da API:", error);
    }
  }

  function buildCityOptions(data) {
    if (!data) return [];

    const options = data.map(city => ({ label: city.name, value: city.city }));

    return options.filter((option, index, self) =>
      index === self.findIndex((t) => (
        t.value === option.value
      ))
    )
  }

  async function searchCity(prefix) {
    if (prefix.length < 3) return;

    const encodedPrefix = encodeURIComponent(prefix);
    const options = {
      url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      params: {
        types: 'city',
        namePrefix: encodedPrefix
      },
      headers: {
        'X-RapidAPI-Key': apiCredentials.geoDB.key,
        'X-RapidAPI-Host': apiCredentials.geoDB.host,
      }
    };

    try {
      const response = await axios.request(options);
      const cities = buildCityOptions(response.data.data)

      setCityOptions(cities);
    } catch (_error) {
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="sun" size={64} color="#FFC300" />
        <Text style={styles.title}>Previsão do Tempo</Text>
      </View>

      <Card style={styles.card}>
        <DropDownPicker
          open={openDropDown}
          value={city}
          items={cityOptions}
          setOpen={setOpenDropDown}
          setValue={setCity}
          searchable={true}
          placeholder="Buscar cidade"
          searchPlaceholder={"Digite pelo menos 3 caracteres"}
          language="PT"
          onChangeSearchText={searchCity}
          onSelectItem={() => setWeather(null)}
          maxHeight={300}
        />

        <Button mode="contained" onPress={fetchWeather} style={styles.button(openDropDown)} loading={loading}>
          Ver Previsão
        </Button>

        {weather && (
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherText}>Temperatura: {weather.temperature} °C</Text>
            <Text style={styles.weatherText}>Mínima: {weather.minTemperature} °C</Text>
            <Text style={styles.weatherText}>Máxima: {weather.maxTemperature} °C</Text>
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#FFF',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  card: {
    margin: 16,
    padding: 16,
    elevation: 4,
  },
  button: (openDropDown) => ({
    marginTop: 32,
    marginBottom: 16,
    display: openDropDown ? 'none' : 'flex',
  }),
  weatherContainer: {
    marginTop: 16,
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 8,
  }
});

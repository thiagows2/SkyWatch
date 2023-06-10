import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import axios from "axios";

const apiCredentials = {
  key: '0c6eaa4026msh310d8c145e29a91p1fa6b6jsn3e580de12cc3',
  host: 'open-weather13.p.rapidapi.com',
}

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  function convertToCelsius(fahrenheit) {
    return (((fahrenheit - 32) * 5) / 9).toFixed(2);
  }

  async function fetchWeather() {
    if (!city) return;

    const encodedCity = encodeURIComponent(city);
    const options = {
      url: `https://open-weather13.p.rapidapi.com/city/${encodedCity}`,
      headers: {
        "X-RapidAPI-Key": apiCredentials.key,
        "X-RapidAPI-Host": apiCredentials.host,
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
    } catch (error) {
      console.error("Erro na chamada da API:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="sun" size={64} color="#FFC300" />
        <Text style={styles.title}>Previsão do Tempo</Text>
      </View>

      <Card style={styles.card}>
        <TextInput
          label="Digite a região"
          value={city}
          onChangeText={text => setCity(text)}
          style={styles.input}
        />
        <Button mode="contained" onPress={fetchWeather} style={styles.button}>
          Ver Previsão
        </Button>

        {weather && (
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherText}>Cidade: {city}</Text>
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  weatherContainer: {
    marginTop: 16,
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 8,
  },
});

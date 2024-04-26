const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'
app.use(express.json()); // Permite que el servidor maneje JSON entrante
app.use(cors({
    origin: 'http://localhost:5173' // Asegúrate de cambiar esto al dominio de tu cliente React
  }));

// Ruta que maneja la búsqueda de vuelos
app.get('/buscarVuelos', async (req, res) => {
    const { origen, destino, fecha } = req.query;
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';

    try {
        const tokenResponse = await axios.post(url, 'grant_type=client_credentials&client_id={ADD_YOUR_KEY}&client_secret={ADD_YOUR_SECRET_KEY}', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const flightSearchResponse = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
            params: {
                originLocationCode: origen,
                destinationLocationCode: destino,
                departureDate: fecha,
                adults: '1'
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        res.json(flightSearchResponse.data);
    } catch (error) {
        console.error('Error al buscar vuelos:', error);
        res.status(500).json({ error: 'Error al buscar vuelos', details: error.message }); // Asegúrate de enviar un objeto JSON
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

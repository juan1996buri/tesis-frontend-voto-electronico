import axios from "axios";

const url = "http://localhost:9090/api/v1.0/ciudad/";

export const getCiudades = async (state) => {
    await axios.get(url).then((resp) => state(resp.data.result));
};
export const getCiudadesAndProvincia = async (setCiudades, provincia, setCiudad) => {
    console.log(provincia);
    await axios.get(url).then((resp) => setCiudades(resp.data.result));
};

export const getCiudadesSeled = async (state, data) => {
    await axios.get(url).then((resp) => console.log(resp.data.result));
};

export const createCiudad = async (provincia) => {
    return await axios.post(url, provincia);
};

export const updateCiudad = async (provincia) => {
    await axios.put(url, provincia);
};

export const eliminarCiudad = async (id) => {
    await axios.delete(url + id).catch(function (error) {
        if (error.response) {
            // La respuesta fue hecha y el servidor respondió con un código de estado
            // que esta fuera del rango de 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
            // http.ClientRequest en node.js
            console.log(error.request);
        } else {
            // Algo paso al preparar la petición que lanzo un Error
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
};

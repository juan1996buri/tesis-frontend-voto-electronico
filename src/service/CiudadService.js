import axios from "axios";

const url = "http://localhost:9090/api/v1.0/ciudad/";

export class CiudadService {
    getCiudades = async (state) => {
        return axios.get(url).then((resp) => state(resp.data.result));
    };
    getCiudadesAndProvincia = async (setCiudades, provincia, setCiudad) => {
        return axios.get(url).then((resp) => setCiudades(resp.data.result));
    };

    getCiudadesSeled = async (state, data) => {
        return axios.get(url).then((resp) => console.log(resp.data.result));
    };

    createCiudad = async (provincia) => {
        return await axios.post(url, provincia);
    };

    updateCiudad = async (provincia) => {
        return axios.put(url, provincia);
    };

    eliminarCiudad = async (id) => {
        return axios.delete(url + id).catch(function (error) {
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
}

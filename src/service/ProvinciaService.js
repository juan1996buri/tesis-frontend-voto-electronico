import axios from "axios";

const url = "http://localhost:9090/api/v1.0/provincia/";

export class ProvinciaService {
    getProvincias = async (state) => {
        return axios.get(url).then((resp) => state(resp.data.result));
    };

    createProvince = async (provincia) => {
        return axios.post(url, provincia);
    };

    updateProvincia = async (provincia) => {
        return axios.put(url, provincia);
    };

    deleteProvincia = async (id, setActive) => {
        return axios
            .delete(url + id)
            .then((resp) => resp.data.success && setActive(true))
            .catch(function (error) {
                if (error.response) {
                    if (error.response.state === 500) {
                        setActive(false);
                    }
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

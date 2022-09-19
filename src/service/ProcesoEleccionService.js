import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/procesoeleccion/";

export class ProcesoEleccionService {
    getProcesosElecciones(ruc, state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    state(res.data.result.filter((item) => item.institucion.ruc === ruc));
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    getProcesoEleccionAVotar(votante) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    const data = res.data.result;
                    const procesoEleccionAVotar = data.filter((item) => item.institucion.id === votante.institucion.id).filter((estado) => estado.activo === true);
                    return procesoEleccionAVotar;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    postProcesoEleccion(data) {
        return axios
            .post(url, data, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    return res.data.result;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    updateProcesoEleccion(data) {
        console.log(data);
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    deleteProcesoEleccion(id) {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((resp) => resp.data.success)
            .catch(function (error) {
                return error.response.data.status;
            });
    }
}

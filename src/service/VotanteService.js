import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/votante/";

export class VotanteService {
    getVotantes(ruc, state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    state(res.data.result.filter((item) => item.institucion.ruc === ruc));
                    return res.data.result.filter((item) => item.institucion.ruc === ruc);
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    getVotante(cedula) {
        return axios
            .get(url + cedula)
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

    getCodigo(id) {
        return axios
            .get(url + "codigo/" + id, { headers: authHeader() })
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

    getLogin(code) {
        return axios
            .get(url + "login/" + code)
            .then((res) => {
                if (res.data.success) {
                    const data = res.data.result;
                    window.localStorage.setItem(
                        "institucion",
                        JSON.stringify({
                            cedula: data.cedula,
                        })
                    );
                    return data;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    postVotante(data) {
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
    updateVotante(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    deleteVotante(id) {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((resp) => resp.data.success)
            .catch(function (error) {
                return error.response.data.status;
            });
    }
}

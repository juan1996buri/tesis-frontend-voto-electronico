import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/usuario/";

export class UserService {
    getUsers() {
        return axios
            .get(url)
            .then((res) => {
                return res.data.result;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    postUser(state) {
        return axios
            .post(url + "registrar", state)
            .then((res) => {
                return res.status;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    postCambiarPassword(state) {
        return axios
            .post(url, state, { headers: authHeader() })
            .then((res) => {
                return res.status;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    postUserLogin(state) {
        return axios
            .post(url + "login", state)
            .then((res) => {
                const data = res.data.result;
                window.localStorage.setItem(
                    "institucion",
                    JSON.stringify({
                        ruc: data.ruc,
                        rol: data.roles.nombre,
                        token: data.token,
                    })
                );
                return res.data.result;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
}

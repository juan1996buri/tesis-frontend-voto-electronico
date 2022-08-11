import axios from "axios";

const url = "http://localhost:9090/api/v1.0/institucion/";

export class AppService {
    getUser(correo, state) {
        return axios.get(url + correo).then((res) => state(res.data.result));
    }
}

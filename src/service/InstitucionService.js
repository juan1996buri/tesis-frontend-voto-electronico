import axios from "axios";

const url = "http://localhost:9090/api/v1.0/institucion/";

export class InstitucionService {
    getInstitucion(ruc, state) {
        return axios.get(url + ruc).then((res) => {
            state(res.data.result);
            const data = res.data.result;
            window.localStorage.setItem(
                "institucion",
                JSON.stringify({
                    ruc: data.ruc,
                })
            );
            return data;
        });
    }
    updateInstitucion(data) {
        return axios.put(url, data);
    }
}

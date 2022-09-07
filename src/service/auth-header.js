export default function authHeader() {
    const institucion = JSON.parse(localStorage.getItem("institucion"));

    if (institucion && institucion.token) {
        return { "Content-Type": "application/json", Authorization: "Bearer " + institucion.token }; // for Spring Boot back-end
        // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
    } else {
        return {};
    }
}

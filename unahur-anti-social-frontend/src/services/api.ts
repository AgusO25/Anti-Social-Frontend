import axios from "axios"; // Es una librería que nos permite comunicarnos con nuestro backend mediante peticiones HTTP.

/*
    Esta constante crea una instancia de Axios.

    En lugar de escribir la URL del backend en cada petición,
    configuramos Axios una sola vez.

    Luego, cualquier archivo podrá hacer:

        api.get(...)
        api.post(...)
        api.put(...)
        api.delete(...)

    y automáticamente utilizará esta URL base.
*/
const api = axios.create({
    baseURL: "http://localhost:3000/api",

    // Tiempo maximo de espera (Cada MIL es un segundo.)
    timeout: 10000,  // 10 segundos. Más que nada si se llega a caer el backend, no queda esperando para siempre.
});


export default api;
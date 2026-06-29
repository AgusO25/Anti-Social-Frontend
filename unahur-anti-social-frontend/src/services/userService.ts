import api from "./api"; 
import type { User } from "../interfaces/User"; // Se importa así porque es una Interfaz.

/*
    Este servicio contiene todas las operaciones relacionadas
    con los usuarios.

    La idea es que ninguna página haga peticiones HTTP directamente.
    Siempre se utilizará las funciones de este servicio.
*/

class UserService {

    // Obtiene la lista completa de usuarios.

   // El promise es Promesa del Ingles, lo que significa que esta función devuelve una promesa, prometiendo que, cuando termine, devuelve el arreglo con los usuarios.
   // No es instantaneo, tarda unos segundos, por eso es una promesa.
    async getUsers(): Promise<User[]> {

        try {

            const response = await api.get("/users");

            return response.data;

        } catch (error) {

            console.error("Error al obtener los usuarios.", error);

            throw error;
        }

    }

    /*
        Crea un nuevo usuario.

        Recibe un objeto User y lo envía al backend.
    */
    async createUser(user: User): Promise<User> {

        try {

            const response = await api.post("/users", user);

            return response.data;

        } catch (error) {

            console.error("Error al crear el usuario.", error);

            throw error;
        }

    }

}

export default new UserService();
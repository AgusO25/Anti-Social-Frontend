/*
    Esta interfaz representa a un usuario de la aplicación.

    IMPORTANTE:
    Si el backend cambia algún atributo,
    solamente tendremos que modificar esta interfaz.
*/

export interface User {
    _id: string;
    nickName: string;
    createdAt?: string;
}

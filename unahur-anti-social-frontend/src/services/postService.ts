import api from "./api";

import type { Post } from "../interfaces/Post";

/* Encargado de todas las operaciones relacionadas con publi. */

class PostService {
    // Obtener todas las publi.

    async getPost(): Promise<Post[]> {
        try{
            const response = await api.get("/posts");

            return response.data;
        } catch (error){
            console.error("Error al obtener publicaciones.", error);
            throw error
        }
    }

    // Obtener una publi por su id.

    async getPostById(id: string): Promise<Post> {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    }

    // Obtener las publis de un usuario.

    async getPostsByUser(userId: string) {
        const response = await api.get(`/posts?userId=${userId}`);
        return response.data;
    }

    // Crear una publi.

    async createPost(data:object){
        const response = await api.post("/posts", data);
        return response.data;
    }

}

export default new PostService();
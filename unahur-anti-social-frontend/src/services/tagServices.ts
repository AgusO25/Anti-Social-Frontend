import api from "./api";
import type { Tag } from "../interfaces/Tag";

class TagService { 

    // Todas las etiquetas disponibles

    async getTags(): Promise<Tag[]> {
        try {
            const response = await api.get("/tags");
            return response.data;
        } catch (error) {
            console.error("Error al obtener etiquetas.", error);
            throw error;
        }
    }

}

export default new TagService();
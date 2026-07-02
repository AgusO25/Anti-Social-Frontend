import api from "./api";

class PostImageService {

    // Actualizar imagen
    async uploadImage(postId: string, formData: FormData) {

        const response = await api.post(
            `/posts/${postId}/images`,
            formData
        );

        return response.data;
    }

    // Borrar imagen
    async deleteImage(postId: string) {

        const response = await api.delete(
            `/posts/${postId}/images`
        );

        return response.data;
    }

}

export default new PostImageService();
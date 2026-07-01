import api from "./api";

class PostImageService {

    // Trae las umagenes de un post.

    async getImages(postId: string) {

        const response = await api.get(`/postimages/post/${postId}`);

        return response.data;
    }

    // Agregar una imagen.

    async createImage(data: object) {

        const response = await api.post("/postimages", data);

        return response.data;
    }

}

export default new PostImageService();
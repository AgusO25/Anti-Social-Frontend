import api from "./api";
import type { Comment } from "../interfaces/Comment";

class CommentService {

    // Trae los comentarios visibles de un post.

    async getComments(postId: string): Promise<Comment[]> {

        const response = await api.get(`/comments/posts/${postId}`);
        
        return response.data
    }

    // Agregar un comentario.

    async createComment(data: object) {

        const response = await api.post("/comments", data);

        return response.data;
    }

}

export default new CommentService();
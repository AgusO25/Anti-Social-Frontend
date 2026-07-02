import api from "./api";
import type { Comment } from "../interfaces/Comment";

class CommentService {

    // Trae los comentarios visibles de un post.

    async getComments(postId: string | number): Promise<Comment[]> {

        const response = await api.get(`/posts/${postId}/comments`);
        
        return response.data
    }

    // Agregar un comentario.

    async createComment(postId: string | number , text: string , user_nickName: string): Promise<Comment> {

        const response = await api.post(`/posts/${postId}/comments`, {
            text,
            user_nickName
        });

        return response.data;
    }

}

export default new CommentService();
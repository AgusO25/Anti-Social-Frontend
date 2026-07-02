import type { Tag } from "./Tag";

/*
    Representa una publicación.

    Se reutiliza la interfaz Tag para evitar repetir código.
*/

export interface Post {
    id?: string;
    _id: string;

    description: string;

    user_nickName: string;

    images: string[];
    imagesUrl?: string;

    tags: Tag[];

    commentsCount?: number;
    
    createdAt?: string;
}
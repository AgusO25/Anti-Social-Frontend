

export interface Comment {
    _id: string;
    text: string;
    user_nickName: string;
    post_id: string;
    visible: boolean;
    createdAt?: string;
}
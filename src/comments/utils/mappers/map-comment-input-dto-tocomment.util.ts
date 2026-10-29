
import { Comment } from "../../type/comment";
import { WithId } from "mongodb";
import { User } from "../../../users/types/user";

export function mapCommentInputDtoToComment(
    dto: string, user:WithId<User>, postId: string):Comment{
        return {
            content: dto,
        commentatorInfo: {
        'userId': user._id.toString(),
        'userLogin':user.login
    },
    postId: postId,
    createdAt: new Date().toISOString()
        }
    }

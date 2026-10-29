import { WithId } from "mongodb";
import { Comment } from "../../type/comment";
import { CommentViewModel } from "../../dto/comment.view.model";

export function mapToCommentViewModel(comment:WithId<Comment>):CommentViewModel{
    return {
            id: comment._id.toString(),
    content:comment.content,
    commentatorInfo: {
        'userId': comment.commentatorInfo.userId,
        'userLogin':comment.commentatorInfo.userLogin
    },
    createdAt:comment.createdAt
    }

}
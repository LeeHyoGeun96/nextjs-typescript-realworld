import { Link } from "react-router-dom";
import { CommentType } from "../types/articleTypes";
import Avatar from "./Avatar";

interface CommentCardProps {
  comment: CommentType;
  onDelete?: (e: React.MouseEvent) => void;
  isDeletePending?: boolean;
  canModify?: boolean;
}

const CommentCard = ({
  comment,
  onDelete,
  isDeletePending,
  canModify,
}: CommentCardProps) => {
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link
          to={`/profile/${comment.author.username}`}
          className="comment-author"
        >
          <Avatar
            username={comment.author.username}
            image={comment.author.image}
            size="sm"
            className="mr-1"
          />
        </Link>
        &nbsp;
        <Link
          to={`/profile/${comment.author.username}`}
          className="comment-author"
        >
          {comment.author.username}
        </Link>
        <span className="date-posted">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
        {canModify && (
          <div className="mod-options">
            <button
              className="btn btn-sm btn-outline-danger "
              onClick={onDelete}
              disabled={isDeletePending}
            >
              <i className="ion-trash-a mr-1"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;

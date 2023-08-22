import { Textarea } from '~shared/ui/textarea';

export function CommentForm() {
  return (
    <form className="card comment-form">
      <fieldset disabled={false}>
        <div className="card-block">
          <Textarea
            className="form-control"
            placeholder="Write a comment..."
            rows={3}
          />
        </div>
        <div className="card-footer">
          <img src={image} className="comment-author-img" alt={username} />
          <button className="btn btn-sm btn-primary" type="submit">
            Post Comment
          </button>
        </div>
      </fieldset>
    </form>
  );
}

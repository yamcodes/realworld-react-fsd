import { useList, useUnit } from 'effector-react';
import { CommentCard } from '~entities/comment';
import { $$sessionModel } from '~entities/session';
import { DeleteComment } from '~features/comment';
import { ErrorHandler } from '~shared/ui/error-handler';
import { Spinner } from '~shared/ui/spinner';
import { CommentsListModel } from './model';

type CommentsListProps = {
  $$model: CommentsListModel;
};

export function CommentsList(props: CommentsListProps) {
  const { $$model } = props;

  const { pending, error } = useUnit($$model.commentsQuery);
  const articleSlug = useUnit($$model.$slug);

  const visitor = useUnit($$sessionModel.$visitor);

  const commentsList = useList($$model.commentsQuery.$data, (comment) => (
    <CommentCard
      comment={comment}
      actions={
        visitor &&
        visitor.username === comment.author.username && (
          <DeleteComment
            $$model={$$model.$$deleteComment}
            id={comment.id}
            slug={articleSlug!}
          />
        )
      }
    />
  ));

  if (pending)
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );

  if (error) return <ErrorHandler error={error as any} />;

  return <div>{commentsList}</div>;
}

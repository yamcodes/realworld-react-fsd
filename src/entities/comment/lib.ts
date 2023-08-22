// eslint-disable-next-line no-restricted-imports
import { mapProfile } from '~entities/profile/@x/article';
import { CommentDto } from '~shared/api/realworld';
import { Comment } from './types';

export function mapComment(commentDto: CommentDto): Comment {
  const { author, ...comment } = commentDto;
  return {
    ...comment,
    author: mapProfile(author),
  };
}

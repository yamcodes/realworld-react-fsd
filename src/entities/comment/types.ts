// eslint-disable-next-line no-restricted-imports
import { Profile } from '~entities/profile/@x/comment';

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
}

export interface NewComment {
  body: string;
}

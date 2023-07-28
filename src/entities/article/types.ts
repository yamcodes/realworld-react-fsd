// eslint-disable-next-line no-restricted-imports
import { Profile } from '~entities/profile/@x/article';

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export type Query = {
  tag?: string;
  author?: string;
  favorited?: string;
  offset?: number;
  limit?: number;
};

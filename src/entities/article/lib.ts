// eslint-disable-next-line no-restricted-imports
import { mapProfile } from '~entities/profile/@x/article';
import { ArticleDto } from '~shared/api/realworld';
import { Article } from './types';

export function mapArticle(articleDto: ArticleDto): Article {
  const { author, ...article } = articleDto;
  return {
    ...article,
    author: mapProfile(author),
  };
}

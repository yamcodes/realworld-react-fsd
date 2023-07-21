import { createEffect } from 'effector';
import { Api, ContentType } from './Api';
import type {
  LoginUserDto,
  NewUserDto,
  UserDto,
  UpdateUserDto,
  ProfileDto,
  ArticleDto,
  NewArticleDto,
  UpdateArticleDto,
  CommentDto,
  NewCommentDto,
  GenericErrorModelDto,
  UnexpectedErrorModelDto,
  ErrorModelDto,
  HttpResponse,
  RequestParams,
} from './Api';

type GenericErrorModel = HttpResponse<unknown, ErrorModelDto>;

const realworldApi = new Api<string>({
  baseApiParams: {
    headers: {
      'Content-Type': ContentType.Json,
    },
    format: 'json',
  },
  securityWorker: (token) =>
    token ? { headers: { Authorization: `Token ${token}` } } : {},
});

const setSecurityDataFx = createEffect<string | null, void>({
  name: 'setSecurityDataFx',
  handler: realworldApi.setSecurityData,
});

const abortRequestFx = createEffect({
  name: 'abortRequestFx',
  handler: realworldApi.abortRequest,
});

export { Api, realworldApi, setSecurityDataFx, abortRequestFx };
export type {
  LoginUserDto,
  NewUserDto,
  UserDto,
  UpdateUserDto,
  ProfileDto,
  ArticleDto,
  NewArticleDto,
  UpdateArticleDto,
  CommentDto,
  NewCommentDto,
  GenericErrorModelDto,
  UnexpectedErrorModelDto,
  ErrorModelDto,
  HttpResponse,
  RequestParams,
  GenericErrorModel,
};

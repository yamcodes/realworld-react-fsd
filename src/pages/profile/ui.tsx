import cn from 'classnames';
import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { MainArticleList } from '~widgets/main-article-list';
import {
  ProfileInfoAnon,
  ProfileInfoAuth,
  ProfileInfoOwner,
} from '~widgets/profile-info';
import { $$profilePage, PageCtx } from './model';

export function ProfilePage() {
  const profileCtx = useUnit($$profilePage.$profileCtx);
  const pageCtx = useUnit($$profilePage.$pageCtx);

  return (
    <div className="profile-page">
      {profileCtx === 'auth' && (
        <ProfileInfoAuth $$model={$$profilePage.$$profileInfo.auth} />
      )}
      {profileCtx === 'owner' && (
        <ProfileInfoOwner $$model={$$profilePage.$$profileInfo.owner} />
      )}
      {profileCtx === 'anon' && (
        <ProfileInfoAnon $$model={$$profilePage.$$profileInfo.anon} />
      )}

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <ArticlesFeedNavigation pageCtx={pageCtx!} />

            <MainArticleList $$model={$$profilePage.$$mainArticleList} />
          </div>
        </div>
      </div>
    </div>
  );
}

type ArticlesFeedNavigationProps = {
  pageCtx: PageCtx;
};

function ArticlesFeedNavigation(props: ArticlesFeedNavigationProps) {
  const { pageCtx } = props;

  const { username, path } = pageCtx;

  return (
    <div className="articles-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            to={`/profile/${username}`}
            className={cn('nav-link', { active: path === 'author' })}
          >
            My Articles
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/profile/${username}/favorites`}
            className={cn('nav-link', { active: path === 'favorited' })}
          >
            Favorited Articles
          </Link>
        </li>
      </ul>
    </div>
  );
}

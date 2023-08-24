import { useEffect } from 'react';
import cn from 'classnames';
import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/router';
import { MainArticleList } from '~widgets/main-article-list';
import { ProfileInfo } from '~widgets/profile-info';
import { $$profilePage, Tab } from './model';

export function ProfilePage() {
  const access = useUnit($$profilePage.$access);
  const tab = useUnit($$profilePage.$tab);
  const username = useUnit($$profilePage.$username);

  const unmounted = useUnit($$profilePage.unmounted);

  useEffect(() => unmounted, [unmounted]);

  return (
    <div className="profile-page">
      {access === 'anon' && (
        <ProfileInfo.Anon $$model={$$profilePage.$$profileInfo.anon} />
      )}

      {access === 'auth' && (
        <ProfileInfo.Auth $$model={$$profilePage.$$profileInfo.auth} />
      )}

      {access === 'owner' && (
        <ProfileInfo.Owner $$model={$$profilePage.$$profileInfo.owner} />
      )}

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <ArticlesFeedNavigation tab={tab} username={username!} />

            <MainArticleList $$model={$$profilePage.$$mainArticleList} />
          </div>
        </div>
      </div>
    </div>
  );
}

type ArticlesFeedNavigationProps = {
  tab: Tab;
  username: string;
};

function ArticlesFeedNavigation(props: ArticlesFeedNavigationProps) {
  const { tab, username } = props;

  return (
    <div className="articles-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            to={PATH_PAGE.profile.root(username)}
            className={cn('nav-link', { active: tab === 'author' })}
          >
            My Articles
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={PATH_PAGE.profile.favorites(username)}
            className={cn('nav-link', { active: tab === 'favorited' })}
          >
            Favorited Articles
          </Link>
        </li>
      </ul>
    </div>
  );
}

import cn from 'classnames';
import { useUnit } from 'effector-react';
import { MainArticleList } from '~widgets/main-article-list';
import {
  ProfileInfoAnon,
  ProfileInfoAuth,
  ProfileInfoVisitor,
} from '~widgets/profile-info';
import { $$profilePage } from './model';

export function ProfilePage() {
  const context = useUnit($$profilePage.$context);

  const filterBy = useUnit(
    $$profilePage.$$mainArticleList.$$filterQuery.filterBy,
  );

  const username = useUnit($$profilePage.$username);

  return (
    <div className="profile-page">
      {context === 'auth' && (
        <ProfileInfoAuth $$model={$$profilePage.$$profileInfo.auth} />
      )}
      {context === 'visitor' && (
        <ProfileInfoVisitor $$model={$$profilePage.$$profileInfo.visitor} />
      )}
      {context === 'anon' && (
        <ProfileInfoAnon $$model={$$profilePage.$$profileInfo.anon} />
      )}

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button
                    className={cn('nav-link')}
                    type="button"
                    onClick={() => filterBy.author(username!)}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={cn('nav-link active')}
                    type="button"
                    onClick={() => filterBy.authorFavorites(username!)}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            <MainArticleList $$model={$$profilePage.$$mainArticleList} />

            {/* {tabs.author && (
              <GlobalArticlesList
                query={{ limit: 10, offset: 0, author: tabs.author }}
              />
            )}

            {tabs.favorited && (
              <GlobalArticlesList
                query={{ limit: 10, offset: 0, favorited: tabs.favorited }}
              />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ProfileCard } from '~widgets/profile-card';
import { $$profilePage } from './model';

export function ProfilePage() {
  return (
    <div className="profile-page">
      <ProfileCard $$model={$$profilePage.$$profileCard} />

      {/* <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button
                    className={cn('nav-link', { active: tabs.author })}
                    type="button"
                    onClick={onAuthorfeedClick}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={cn('nav-link', { active: tabs.favorited })}
                    type="button"
                    onClick={onFavoritedfeedClick}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            {tabs.author && (
              <GlobalArticlesList
                query={{ limit: 10, offset: 0, author: tabs.author }}
              />
            )}

            {tabs.favorited && (
              <GlobalArticlesList
                query={{ limit: 10, offset: 0, favorited: tabs.favorited }}
              />
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

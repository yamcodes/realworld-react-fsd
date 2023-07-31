import cn from 'classnames';
import { useUnit } from 'effector-react';
import {
  ProfileInfoAnon,
  ProfileInfoAuth,
  ProfileInfoVisitor,
} from '~widgets/profile-info';
import { $$profilePage } from './model';

export function ProfilePage() {
  const context = useUnit($$profilePage.$context);

  return (
    <div className="profile-page">
      {context === 'auth' && (
        <ProfileInfoAuth $$model={$$profilePage.$$profileInfoModel.auth} />
      )}
      {context === 'visitor' && (
        <ProfileInfoVisitor
          $$model={$$profilePage.$$profileInfoModel.visitor}
        />
      )}
      {context === 'anon' && (
        <ProfileInfoAnon $$model={$$profilePage.$$profileInfoModel.anon} />
      )}

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button className={cn('nav-link')} type="button">
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button className={cn('nav-link active')} type="button">
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

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

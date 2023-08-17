import cn from 'classnames';
import { useUnit } from 'effector-react';
import { $$sessionModel } from '~entities/session';
import { MainArticleList } from '~widgets/main-article-list';
import { PopularTags } from '~widgets/popular-tags';
import { UserArticleList } from '~widgets/user-article-list';
import { $$homePage } from './model';

export function HomePage() {
  const activeTab = useUnit($$homePage.$activeTab);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <ArticlesFeedTabs />

            {activeTab.userFeed && (
              <UserArticleList $$model={$$homePage.$$userArticleList} />
            )}

            {(activeTab.globalFeed || activeTab.tagFeed) && (
              <MainArticleList $$model={$$homePage.$$mainArticleList} />
            )}
          </div>

          <div className="col-md-3">
            <PopularTags $$model={$$homePage.$$popularTags} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticlesFeedTabs() {
  const auth = useUnit($$sessionModel.$visitor);
  const activeTab = useUnit($$homePage.$activeTab);
  const tab = useUnit($$homePage.tab);

  const onUserFeedClicked = () => tab.userFeed();
  const onGlobalFeedClicked = () => tab.globalFeed();

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {auth && (
          <li className="nav-item">
            <button
              className={cn('nav-link', { active: activeTab.userFeed })}
              type="button"
              onClick={onUserFeedClicked}
            >
              Your Feed
            </button>
          </li>
        )}
        <li className="nav-item">
          <button
            className={cn('nav-link', { active: activeTab.globalFeed })}
            type="button"
            onClick={onGlobalFeedClicked}
          >
            Global Feed
          </button>
        </li>
        {activeTab?.tagFeed && (
          <li className="nav-item">
            <button className="nav-link active" type="button">
              #{activeTab.tagFeed}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

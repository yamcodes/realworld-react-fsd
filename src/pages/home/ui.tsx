import cn from 'classnames';
import { useUnit } from 'effector-react';
import { $$sessionModel } from '~entities/session';
import { MainArticleList } from '~widgets/main-article-list';
import { PopularTags } from '~widgets/popular-tags';
import { UserArticleList } from '~widgets/user-article-list';
import { $$homePage } from './model';

export function HomePage() {
  const tab = useUnit($$homePage.$tab);

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

            {tab === 'author' && (
              <UserArticleList $$model={$$homePage.$$userArticleList} />
            )}

            {(tab === 'all' || tab === 'tag') && (
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
  const tag = useUnit($$homePage.$tag);
  const tab = useUnit($$homePage.$tab);

  const tabApi = useUnit($$homePage.tabApi);

  const onUserFeedClicked = () => tabApi.author();
  const onGlobalFeedClicked = () => tabApi.all();

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {auth && (
          <li className="nav-item">
            <button
              className={cn('nav-link', { active: tab === 'author' })}
              type="button"
              onClick={onUserFeedClicked}
            >
              Your Feed
            </button>
          </li>
        )}
        <li className="nav-item">
          <button
            className={cn('nav-link', { active: tab === 'all' })}
            type="button"
            onClick={onGlobalFeedClicked}
          >
            Global Feed
          </button>
        </li>
        {tab === 'tag' && (
          <li className="nav-item">
            <button className="nav-link active" type="button">
              #{tag!}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

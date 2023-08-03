import cn from 'classnames';
import { useUnit } from 'effector-react';
import { $$sessionModel } from '~entities/session';
import { MainArticleList } from '~widgets/main-article-list';
import { PopularTags } from '~widgets/popular-tags';
import { UserArticleList } from '~widgets/user-article-list';
import { $$homePage, HomePageModel } from './model';

export function HomePage() {
  const userFeed = useUnit($$homePage.$userFeed);

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
            <ArticlesFeedNavigation $$model={$$homePage} />

            {userFeed && (
              <UserArticleList $$model={$$homePage.$$userArticleList} />
            )}

            {!userFeed && (
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

type ArticlesFeedNavigationProps = {
  $$model: HomePageModel;
};

function ArticlesFeedNavigation(props: ArticlesFeedNavigationProps) {
  const { $$model } = props;

  const auth = useUnit($$sessionModel.$visitor);
  const filter = useUnit($$model.$$filterModel.$query);
  const filterBy = useUnit($$model.$$filterModel.filterBy);
  const userFeed = useUnit($$model.$userFeed);

  const userFeedClicked = useUnit($$model.userFeedClicked);

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {auth && (
          <li className="nav-item">
            <button
              className={cn('nav-link', { active: userFeed })}
              type="button"
              onClick={userFeedClicked}
            >
              Your Feed
            </button>
          </li>
        )}
        <li className="nav-item">
          <button
            className={cn('nav-link', { active: !userFeed && !filter })}
            type="button"
            onClick={() => filterBy.all()}
          >
            Global Feed
          </button>
        </li>
        {filter?.tag && (
          <li className="nav-item">
            <button
              className={cn('nav-link', { active: !userFeed && filter.tag })}
              type="button"
            >
              #{filter.tag}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

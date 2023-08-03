import { useUnit } from 'effector-react';
import { ErrorHandler } from '~shared/ui/error-handler';
import { PopularTagsModel } from './model';

type PopularTagsProps = {
  $$model: PopularTagsModel;
};

export function PopularTags(props: PopularTagsProps) {
  const { $$model } = props;

  const { data: tags, pending, error } = useUnit($$model.popularTagsQuery);
  const tagClicked = useUnit($$model.tagClicked);

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {pending && 'Loading tags...'}

        {(error as any) && <ErrorHandler error={error as any} />}

        {tags &&
          tags.length &&
          tags.map((tag) => (
            <button
              key={tag}
              className="tag-pill tag-default"
              type="button"
              onClick={() => tagClicked(tag)}
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
}

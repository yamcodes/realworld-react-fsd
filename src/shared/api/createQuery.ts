import {
  Effect,
  attach,
  combine,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { $ctx } from '../ctx';

type CreateQueryConfig<Params, Done, Error> = {
  fx: Effect<Params, Done, Error>;
  name: string;
};

export function createQuery<Params, Done, Error>(
  config: CreateQueryConfig<Params, Done, Error>,
) {
  const { fx, name } = config;

  const attachedFx = attach({ effect: fx });

  const abortFx = attach({
    name: name.concat('.abortFx'),
    source: { ctx: $ctx },
    effect: ({ ctx }, cancelToken: string) => {
      ctx.restClient.abortRequest(cancelToken);
    },
  });

  const start = createEvent<Params>({ name: name.concat('.start') });
  const success = createEvent<Done>({ name: name.concat('.success') });
  const failure = createEvent<Error>({ name: name.concat('.failure') });
  const abort = createEvent({ name: name.concat('.abort') });
  const reset = createEvent({ name: name.concat('.reset') });
  const settled = createEvent<
    | {
        status: 'done';
        params: Params;
        result: Done;
      }
    | {
        status: 'fail';
        params: Params;
        error: Error;
      }
  >({ name: name.concat('.settled') });

  const $data = createStore<Done | null>(null, { name: name.concat('.$data') })
    .on(success, (_, data) => data)
    .reset(reset);

  const $error = createStore<Error | null>(null, {
    name: name.concat('.$error'),
  })
    .on(failure, (_, error) => error)
    .reset(reset);

  const $cancelToken = createStore<string | null>(null).on(
    start,
    // @ts-expect-error
    (_, params) => params?.params?.cancelToken,
  );

  const $response = combine({
    data: $data,
    pending: fx.pending,
    error: $error,
  });

  sample({
    clock: start,
    target: attachedFx,
  });

  sample({
    clock: attachedFx.doneData,
    target: success,
  });

  sample({
    clock: attachedFx.failData,
    target: failure,
  });

  sample({
    clock: attachedFx.finally,
    target: settled,
  });

  sample({
    clock: abort,
    source: $cancelToken,
    filter: Boolean,
    target: abortFx,
  });

  return {
    start,
    finished: {
      success,
      failure,
      finally: settled,
    },
    abort,
    reset,
    $response,
  };
}

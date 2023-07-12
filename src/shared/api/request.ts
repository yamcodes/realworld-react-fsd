import { Effect, Unit, createStore } from 'effector';
import { GenericErrorModel } from './realworld';

type RequestFactoryParams<EffectParams, EffectData> = {
  effect: Effect<EffectParams, EffectData, GenericErrorModel>;
  reset: Array<Unit<any>>;
  name: string;
};

export function requestFactory<Params, Done>(
  params: RequestFactoryParams<Params, Done>,
) {
  const { effect, reset, name } = params;

  const $data = createStore<Done | null>(null, { name: name.concat('.data') });
  const $pending = createStore<boolean>(false, {
    name: name.concat('.pending'),
  });
  const $error = createStore<GenericErrorModel | null>(null, {
    name: name.concat('.error'),
  });

  $data.on(effect.doneData, (_, data) => data);
  $pending.on(effect.pending, (_, pending) => pending);
  $error.on(effect.failData, (_, error) => error);

  $data.reset(reset);
  $pending.reset(reset);
  $error.reset(reset);

  return [$data, $pending, $error];
}

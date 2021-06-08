import { TimerApi, TimerState } from "../../types";
import { TimerInternalApi, TimerInternalState } from "../../internal";

import { createPlay } from "./play";
import { createPause } from "./pause";
import { createTogglePlay } from "./togglePlay";
import { createReset } from "./reset";
import { createGetTime, createSetTime } from "./getSetTime";
import { createGetIsPlaying } from "./getIsPlaying";
import { createSubscribe } from "./subscribe";
import { createGetDuration, createSetDuration } from "./getSetDuration";
import {
    createGetUpdateInterval,
    createSetUpdateInterval,
} from "./getSetUpdateInterval";

export const createApiFns = {
    createPlay,
    createPause,
    createTogglePlay,
    createReset,
    createGetTime,
    createSetTime,
    createGetIsPlaying,
    createSubscribe,
    createGetDuration,
    createSetDuration,
    createGetUpdateInterval,
    createSetUpdateInterval,
};

export type CreateApiFn<
    T extends keyof TimerApi,
    TParams = undefined,
> = TParams extends undefined
    ? (
          state: TimerState,
          internalState: TimerInternalState,
          internalApi: TimerInternalApi,
      ) => TimerApi[T]
    : (
          state: TimerState,
          internalState: TimerInternalState,
          internalApi: TimerInternalApi,
          extraParams: TParams,
      ) => TimerApi[T];

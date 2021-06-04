import { TimerApi, TimerState } from "./types";
import { TimerInternalState } from "./internal";
export declare function createApi(state: TimerState, internalState: TimerInternalState): TimerApi;

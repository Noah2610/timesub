import { TimerEvent, TimerState } from "../types";
import { TimerInternalState } from "./internalState";
export interface TimerInternalApi {
    startTimeout(): void;
    stopTimeout(): void;
    update(): void;
    updateTime(): void;
    updateIsFinished(): void;
    updateSubscribers(event: TimerEvent): void;
}
export declare function createInternalApi(state: TimerState, internalState: TimerInternalState): TimerInternalApi;

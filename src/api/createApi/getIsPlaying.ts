import { CreateApiFn } from ".";

export const createGetIsPlaying: CreateApiFn<"getIsPlaying"> =
    (state, _internalState, _internalApi) => () =>
        state.isPlaying;

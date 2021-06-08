import { CreateApiFn } from ".";

export const createTogglePlay: CreateApiFn<
    "togglePlay",
    { play: () => boolean; pause: () => boolean }
> =
    (state, _internalState, _internalApi, { play, pause }) =>
    () =>
        state.isPlaying ? pause() : play();

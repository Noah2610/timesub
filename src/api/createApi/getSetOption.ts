import { CreateApiFn } from ".";

export const createGetOption: CreateApiFn<"getOption"> =
    (_state, internalState, _internalApi) => (option) =>
        internalState.options[option];

export const createSetOption: CreateApiFn<"setOption"> =
    (_state, internalState, _internalApi) => (option, value) => {
        internalState.options[option] = value;
    };

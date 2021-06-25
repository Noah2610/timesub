import { CreateApiFn } from ".";
import { TimerSetOptionEvent } from "../../types";

export const createGetOption: CreateApiFn<"getOption"> =
    (_state, internalState, _internalApi) => (option) =>
        internalState.options[option];

export const createSetOption: CreateApiFn<"setOption"> =
    (_state, internalState, internalApi) => (option, value) => {
        internalState.options[option] = value;
        internalApi.emit({
            type: `setOption-${option}`,
            option,
            value,
        } as TimerSetOptionEvent<any>); // TODO
    };

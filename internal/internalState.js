"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalState = void 0;
function createInternalState(options) {
    return {
        timeout: undefined,
        lastUpdate: undefined,
        subscribers: [],
        nextSubscriberIdx: 0,
        options: options,
        timer: undefined,
    };
}
exports.createInternalState = createInternalState;

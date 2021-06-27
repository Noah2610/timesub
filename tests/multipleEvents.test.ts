import { createTimer, TimerEventType, TimerListener } from "../src";

describe("on API with multiple timer events", () => {
    it("listens to multiple timer events on the same callback", () => {
        const timer = createTimer({
            duration: 100,
            updateInterval: 10,
        });

        const cb: TimerListener<TimerEventType[]> = jest.fn((_, event) =>
            expect(["play", "pause"]).toContain(event.type),
        );
        timer.on(["play", "pause"], cb);

        timer.play();
        timer.pause();
        timer.togglePlay();
        timer.pause();

        timer.setTime(10);
        timer.reset();

        expect(cb).toHaveBeenCalledTimes(4);
    });
});

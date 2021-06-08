import { createTimer, Timer, TimerEventOfType } from "../src";

describe("listen to timer events with `on` API", () => {
    it("listens to play event", (done) => {
        const timer = createTimer();

        const callback = jest.fn(
            ({ isPlaying, pause }: Timer, event: TimerEventOfType<"play">) => {
                expect(isPlaying).toBe(true);
                expect(event.type).toBe("play");
                expect(callback).toHaveBeenCalledTimes(1);
                unsubscribe();
                pause();
                done();
            },
        );
        const unsubscribe = timer.on("play", callback);

        timer.play();
    });

    it("listens to play and pause events", (done) => {
        const timer = createTimer();

        const callbackPlay = jest.fn(
            ({ isPlaying }: Timer, _event: TimerEventOfType<"play">) => {
                expect(isPlaying).toBe(true);
                expect(callbackPlay).toHaveBeenCalledTimes(1);
            },
        );
        const unsubscribePlay = timer.on("play", callbackPlay);

        const callbackPause = jest.fn(
            ({ isPlaying }: Timer, _event: TimerEventOfType<"pause">) => {
                expect(isPlaying).toBe(false);
                expect(callbackPause).toHaveBeenCalledTimes(1);
                unsubscribePlay();
                unsubscribePause();
                done();
            },
        );
        const unsubscribePause = timer.on("pause", callbackPause);

        timer.play();
        timer.pause();
    });

    it("listens to update event", (done) => {
        const timer = createTimer({
            duration: 100,
            updateInterval: 21,
        });

        const expectedTimesCalled = 4;
        let timesCalled = 0;

        const callback = jest.fn(
            (
                { isPlaying, pause }: Timer,
                event: TimerEventOfType<"update">,
            ) => {
                expect(event.type).toBe("update");
                expect(isPlaying).toBe(true);
                timesCalled += 1;
                if (timesCalled >= expectedTimesCalled) {
                    expect(callback).toHaveBeenCalledTimes(4);
                    unsubscribe();
                    pause();
                    done();
                }
            },
        );
        const unsubscribe = timer.on("update", callback);

        timer.play();
    });

    it("listens to finish event", (done) => {
        const timer = createTimer({
            duration: 50,
            updateInterval: 10,
        });

        const callback = jest.fn(
            (timer: Timer, event: TimerEventOfType<"finish">) => {
                expect(event.type).toBe("finish");
                expect(timer.isPlaying).toBe(false);
                expect(timer.isFinished).toBe(true);
                expect(callback).toHaveBeenCalledTimes(1);
                unsubscribe();
                done();
            },
        );
        const unsubscribe = timer.on("finish", callback);

        timer.play();
    });

    it("listens to update event and unsubscribes", (done) => {
        const timer = createTimer({
            duration: 50,
            updateInterval: 10,
        });

        const callback = jest.fn(() => {
            unsubscribe();
        });
        const unsubscribe = timer.on("update", callback);

        timer.on("finish", () => {
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        });

        timer.play();
    });
});

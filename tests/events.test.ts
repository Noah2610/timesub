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

    it("has multiple listeners, and unsubscribes properly", () => {
        const timer = createTimer({
            duration: 50,
            updateInterval: 50,
        });

        const listeners = [
            jest.fn(() => {}),
            jest.fn(() => {}),
            jest.fn(() => {}),
            jest.fn(() => {}),
            jest.fn(() => {}),
        ];

        const unsubscribes = listeners.map((listener) =>
            timer.on("play", listener),
        );

        // 3 play calls should trigger 3 listener calls on all listeners.
        timer.play();
        timer.pause();
        timer.play();
        timer.pause();
        timer.play();
        timer.pause();

        for (const listener of listeners) {
            expect(listener).toHaveBeenCalledTimes(3);
        }

        unsubscribes[0]!();

        timer.play();
        timer.pause();
        timer.play();
        timer.pause();

        expect(listeners[0]!).toHaveBeenCalledTimes(3);
        for (let i = 1; i < listeners.length; i++) {
            expect(listeners[i]!).toHaveBeenCalledTimes(5);
        }

        for (let i = 1; i < unsubscribes.length; i++) {
            unsubscribes[i]!();
        }
    });

    it("listens to setDuration event", () => {
        const initialDuration = 100;
        const expectedDuration = 200;

        const timer = createTimer({
            duration: initialDuration,
        });

        const callback = jest.fn(
            (timer: Timer, event: TimerEventOfType<"setDuration">) => {
                expect(event.type).toBe("setDuration");
                expect(event.duration).toBe(expectedDuration);
                expect(timer.getDuration()).toBe(expectedDuration);
            },
        );
        const unsubscribe = timer.on("setDuration", callback);

        expect(timer.getDuration()).toBe(initialDuration);

        timer.setDuration(expectedDuration);

        expect(timer.getDuration()).toBe(expectedDuration);
        expect(callback).toHaveBeenCalledTimes(1);

        unsubscribe();
    });

    it("listens to setUpdateInterval event", () => {
        const initialUpdateInterval = 100;
        const expectedUpdateInterval = 50;

        const timer = createTimer({
            updateInterval: initialUpdateInterval,
        });

        const callback = jest.fn(
            (timer: Timer, event: TimerEventOfType<"setUpdateInterval">) => {
                expect(event.type).toBe("setUpdateInterval");
                expect(event.updateInterval).toBe(expectedUpdateInterval);
                expect(timer.getUpdateInterval()).toBe(expectedUpdateInterval);
            },
        );
        const unsubscribe = timer.on("setUpdateInterval", callback);

        expect(timer.getUpdateInterval()).toBe(initialUpdateInterval);

        timer.setUpdateInterval(expectedUpdateInterval);

        expect(timer.getUpdateInterval()).toBe(expectedUpdateInterval);
        expect(callback).toHaveBeenCalledTimes(1);

        unsubscribe();
    });
});

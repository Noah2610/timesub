import { createTimer, Timer, TimerEvent } from "../src";

describe("subscribe to timer", () => {
    it("subscribes and calls subscription function", () => {
        const timer = createTimer();

        const callback = jest.fn((_: Timer) => {});
        const unsubscribe = timer.subscribe(callback);

        timer.play();
        timer.pause();

        expect(callback).toHaveBeenCalledTimes(2);

        unsubscribe();
    });

    it("subscribes and unsubscribes", () => {
        const timer = createTimer();

        const callback = jest.fn((_: Timer) => {});
        const unsubscribe = timer.subscribe(callback);

        timer.play();
        expect(callback).toHaveBeenCalledTimes(1);

        unsubscribe();
        timer.pause();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("finishes timer", (done) => {
        const timer = createTimer({
            duration: 100,
            updateInterval: 50,
        });

        const expectedTimesCalled = 3;
        let timesCalled = 0;

        const callback = jest.fn(({ isPlaying }: Timer) => {
            timesCalled++;
            const expectedIsPlaying =
                timesCalled < expectedTimesCalled ? true : false;
            expect(isPlaying).toBe(expectedIsPlaying);
            if (timesCalled === expectedTimesCalled) {
                expect(callback).toHaveBeenCalledTimes(expectedTimesCalled);
                unsubscribe();
                done();
            }
        });

        const unsubscribe = timer.subscribe(callback);
        timer.play();
    });

    it("finishes timer with event", (done) => {
        const timer = createTimer({
            duration: 100,
            updateInterval: 50,
        });

        const callback = jest.fn(
            ({ isPlaying, isFinished }: Timer, event: TimerEvent) => {
                switch (event.type) {
                    case "update": {
                        expect(isPlaying).toBe(true);
                        expect(isFinished).toBe(false);
                        break;
                    }
                    case "finish": {
                        expect(isPlaying).toBe(false);
                        expect(isFinished).toBe(true);
                        expect(callback).toHaveBeenCalledTimes(3);
                        unsubscribe();
                        done();
                    }
                }
            },
        );

        const unsubscribe = timer.subscribe(callback);
        timer.play();
    });
});

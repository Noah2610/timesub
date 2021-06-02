import { createTimer, Timer } from ".";

describe("createTimer", () => {
    it("creates a timer", () => {
        const timer = createTimer();
        expect(timer).toBeTruthy();
        expect(timer.time).toBe(0.0);
        expect(timer.isPlaying).toBe(false);
        expect(timer.isFinished).toBe(false);
    });

    it("creates a timer with options", () => {
        const timer = createTimer({
            duration: 1000,
            updateInterval: 50,
        });
        expect(timer).toBeTruthy();
        expect(timer.time).toBe(0.0);
        expect(timer.isPlaying).toBe(false);
        expect(timer.isFinished).toBe(false);
    });
});

describe("timer API", () => {
    it("plays and pauses timer", () => {
        const timer = createTimer();
        expect(timer.isPlaying).toBe(false);

        timer.play();
        expect(timer.isPlaying).toBe(true);

        timer.pause();
        expect(timer.isPlaying).toBe(false);

        timer.togglePlay();
        expect(timer.isPlaying).toBe(true);
    });

    it("gets and sets time with API", () => {
        const timer = createTimer();
        expect(timer.getTime()).toBe(0.0);

        timer.setTime(10000);
        expect(timer.getTime()).toBe(10000);

        timer.reset();
        expect(timer.time).toBe(0.0);
    });
});

describe("subscribe to timer", () => {
    it("subscribes and calls subscription function", () => {
        const timer = createTimer();

        const callback = jest.fn((_: Timer) => {});
        timer.subscribe(callback);

        timer.play();
        timer.pause();

        expect(callback).toHaveBeenCalledTimes(2);
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
    }),
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
                    done();
                }
            });
            timer.subscribe(callback);

            timer.play();
        }, 300);
});

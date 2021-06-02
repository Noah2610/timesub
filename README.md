# timesub
A simple JS timer library, with an easy subscription to the updating time.  

## Usage
```ts
import { createTimer } from "timesub";

// Optional timer options.
// You can omit any of these properties.
// These are the default values:
const options = {
    duration: "infinite" // "infinite" or number, to set the duration.
    updateInterval: 100, // Delay in milliseconds between every update.
};

// You can omit the `options` argument altogether.
const timer = createTimer(options);

// SUBSCRIBE API
// You can subscribe to time updates, by passing a
// callback function to the `subscribe` function.
// Returns an "unsubscribe" function, which you can call to, uuuh, unsubscribe.
const unsubscribe = timer.subscribe(
    ({ time, isPlaying, isFinished, ...api }) => {
        //                             ^^^
        // The callback is also given all API functions listed below.

        console.log(`Current time: ${time}`);

        if (isPlaying) {
            // do stuff...
        }
        if (isFinished) {
            // do other stuff...
        }
    },
);

// Unsubscribe by calling the returned function.
unsubscribe();

// API
timer.play();
timer.pause();
timer.togglePlay();
const currentTime = timer.getTime();
timer.setTime(1000); // Set a new time in milliseconds.
const isCurrentlyPlaying = timer.getIsPlaying();
```

## Licensing
Distributed under the terms of the [MIT license].

[MIT license]: ./LICENSE

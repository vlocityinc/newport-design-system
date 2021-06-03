const DURATION = 400;

let animStart: number | null = null;
let animProgress = 0;

/**
 * @param callback the callback function
 * @param timestamp a timestamp
 * @param duration duration of animation
 * @param resolve function called when resolved animation
 */
function animateNext(callback: Function, timestamp: number, duration: number, resolve: Function) {
    if (animStart == null) {
        animStart = timestamp;
    }
    animProgress = Math.min((timestamp - animStart) / duration, 1);
    callback(animProgress);

    if (animProgress !== 1) {
        requestAnimationFrame((ts) => animateNext(callback, ts, duration, resolve));
    } else {
        resolve();
    }
}

/**
 * @param callback the callback function
 * @param duration duration of animation
 * @returns Promise
 */
function animate(callback: Function, duration: number = DURATION): Promise<void> {
    return new Promise((resolve) => {
        animStart = null;
        animProgress = 0;
        requestAnimationFrame((timestamp) => animateNext(callback, timestamp, duration, resolve));
    });
}

export { animate, DURATION };

const DURATION = 400;

let animStart: number | null = null;
let animProgress = 0;

function animateNext(callback: any, timestamp: number, duration: number) {
    if (animStart == null) {
        animStart = timestamp;
    }
    animProgress = Math.min((timestamp - animStart) / duration, 1);
    callback(animProgress);

    if (animProgress !== 1) {
        requestAnimationFrame((ts) => animateNext(callback, ts, duration));
    }
}

function animate(callback: any, duration: number = DURATION) {
    animStart = null;
    animProgress = 0;
    requestAnimationFrame((timestamp) => animateNext(callback, timestamp, duration));
}

export { animate };

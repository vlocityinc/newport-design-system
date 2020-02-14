const DURATION = 400;

let animStart: number | null = null;
let animProgress = 0;

function animateNext(callback: any, timestamp: number) {
    if (animStart == null) {
        animStart = timestamp;
    }
    animProgress = Math.min((timestamp - animStart) / DURATION, 1);
    callback(animProgress);

    if (animProgress !== 1) {
        requestAnimationFrame(ts => animateNext(callback, ts));
    }
}

function animate(callback: any) {
    animStart = null;
    animProgress = 0;
    requestAnimationFrame(timestamp => animateNext(callback, timestamp));
}

export { animate };

export const getInstrumentation = (name) => {
    return {
        metricsForLoad: {
            trackValue: () => {},
            incrementCounter: () => {}
        },
        metricsForCanvas: {
            trackValue: () => {},
            incrementCounter: () => {}
        }
    };
};

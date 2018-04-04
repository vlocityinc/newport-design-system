let getSubflowsFunction;

export function setGetSubflowsFunction(theFunction) {
    getSubflowsFunction = theFunction;
}

/*
 * Get subflows
 */
export function getSubflows(callback) {
    getSubflowsFunction(callback);
}

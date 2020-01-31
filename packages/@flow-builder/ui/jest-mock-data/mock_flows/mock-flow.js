export const getActionCallsByNames = (flow, names) => {
    const actionCalls = flow.metadata.actionCalls;
    const filteredActionCalls = [];
    actionCalls.forEach(actionCall => {
        if (names.includes(actionCall.name)) {
            filteredActionCalls.push(actionCall);
        }
    });
    return filteredActionCalls;
};

export const systemVariables = JSON.stringify([
    {
        "devName":"CurrentDate",
        "isCollection":false,
        "isAssignable":false,
        "dataType":"Date"
    },
    {"devName":"CurrentDateTime","isCollection":false,"isAssignable":false,"dataType":"DateTime"},
    {"devName":"FaultMessage","isCollection":false,"isAssignable":false,"dataType":"String"},
    {"devName":"CurrentStage","isCollection":false,"isAssignable":true,"dataType":"String","elementType":"STAGE"},
    {"devName":"ActiveStages","isCollection":true,"isAssignable":true,"dataType":"String","elementType":"STAGE"},
    {"devName":"InterviewGuid","isCollection":false,"isAssignable":false,"dataType":"String"},
    {"devName":"CurrentRecord","isCollection":false,"isAssignable":true,"dataType":"String"}
]);
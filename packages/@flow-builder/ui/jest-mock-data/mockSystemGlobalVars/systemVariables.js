export const systemVariables = JSON.stringify([
    {"devName":"CurrentDate", "isCollection":false, "isAssignable":false, "dataType":"Date", category: "Flow"},
    {"devName":"CurrentDateTime","isCollection":false,"isAssignable":false,"dataType":"DateTime", category: "Flow"},
    {"devName":"FaultMessage","isCollection":false,"isAssignable":false,"dataType":"String", category: "Flow"},
    {"devName":"CurrentStage","isCollection":false,"isAssignable":true,"dataType":"String","elementType":"STAGE", category: "Flow"},
    {"devName":"ActiveStages","isCollection":true,"isAssignable":true,"dataType":"String","elementType":"STAGE", category: "Flow"},
    {"devName":"InterviewGuid","isCollection":false,"isAssignable":false,"dataType":"String", category: "Flow"},
    {"devName":"CurrentRecord","isCollection":false,"isAssignable":true,"dataType":"String", category: "Flow"}
]);
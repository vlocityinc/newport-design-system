export const mockActions = [{
    Description:"Post to the feed for a specific record, user, or Chatter group.",
    DurableId:"chatterPost-chatterPost",
    IsStandard:true,
    Label:"Post to Chatter",
    Name:"chatterPost",
    Type:"chatterPost",
    sobjectType:"InvocableAction"
}, {
    Description:"Send an email where you specify the subject, body, and recipients.",
    DurableId:"emailSimple-emailSimple",
    IsStandard:true,
    Label:"Send Email",
    Name:"emailSimple",
    Type:"emailSimple",
    sobjectType:"InvocableAction"
}, {
    Name:"apexAction1",
    DurableId:"apexAction1",
    IsStandard: false,
    Type: "apex",
    Description: "This is an apex action 1",
    Label: "Apex1"
}, {
    Name:"apexAction2",
    DurableId:"apexAction2",
    IsStandard: false,
    Type: "apex",
    Description: "This is an apex action 2",
    Label: "Apex2"
}, {
    Name:"apexAction3",
    DurableId:"apexAction3",
    IsStandard: false,
    Type: "apex",
    Description: "This is an apex action 3",
    Label: "Apex3"
}];
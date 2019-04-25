export const MOCK_AUTO_TEMPLATE = {
    Label: 'Autolaunched template',
    EnumOrId: '301xx000003Gblb',
    ProcessType: 'AutoLaunchedFlow',
    Description: 'This is an autolaunched template',
};

export const MOCK_SCREEN_TEMPLATE_1 = {
    Label: 'Screen template',
    EnumOrId: '301xx000005Abdh',
    ProcessType: 'Flow',
    Description: 'This is a screen template',
};

export const MOCK_SCREEN_TEMPLATE_2 = {
    Label: 'Screen template 2',
    EnumOrId: '301xx000008jhgn',
    ProcessType: 'Flow',
    Description: 'This is a screen template 2',
};

export const MOCK_ALL_TEMPLATES = [MOCK_AUTO_TEMPLATE, MOCK_SCREEN_TEMPLATE_1, MOCK_SCREEN_TEMPLATE_2];


export const MOCK_RAW_TEMPLATE_LIST = [{
    DefinitionId:"300xx000000bncDAAQ",
    Description:null,
    EnumOrID:"301xx000003GYXPAA4",
    isTemplate:true,
    Label:"myFlowTemplateGetAccount",
    ProcessType: "AutoLaunchedFlow",
    Status:{value: "Draft"},
    VersionNumber:1
}, {
    DefinitionId:"300xx000000bncDBBQ",
    Description:null,
    EnumOrID:"301xx000003GYXPBB5",
    isTemplate:true,
    Label:"myAutoLaunchedFlow",
    ProcessType: "AutoLaunchedFlow",
    Status:{value: "Draft"},
    VersionNumber:1
},{
    DefinitionId:"300xx000000abcDCCQ",
    Description:null,
    EnumOrID:"301xx000003GYXPAA6",
    isTemplate:true,
    Label:"myScreenFlowTemplateGetAccount",
    ProcessType: "Flow",
    Status:{value: "Draft"},
    VersionNumber:1
}, {
    DefinitionId:"300xx000000defDDDQ",
    Description:null,
    EnumOrID:"301xx000003GYXPBB7",
    isTemplate:true,
    Label:"screenFlowAddAccount",
    ProcessType: "Flow",
    Status:{value: "Draft"},
    VersionNumber:1
}];
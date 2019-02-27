import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";

export const MOCK_PROCESS_TYPES = { FEATURED : [
    {label:"Autolaunched Flow", name : FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW},
    {label:"Screen Flow", name: FLOW_PROCESS_TYPE.FLOW}
   ], OTHERS : [
    {label:"Checkout Flow", name: FLOW_PROCESS_TYPE.CHECKOUT_FLOW},
    {label:"Contact Request Flow", name: FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW},
    {label:"Embedded Appointment Management Flow", name: FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB},
    {label:"Field Service Mobile Flow", name: FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE},
    {label:"User Provisioning Flow", name: FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW},
    {label:"Well no icon yet", name: "WeDoNotKnowYou"}
   ]
};

export const MOCK_ALL_PROCESS_TYPES = [...MOCK_PROCESS_TYPES.FEATURED, ...MOCK_PROCESS_TYPES.OTHERS];
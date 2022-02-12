import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const DEFAULT_INPUT_VALUE = {
    reactionType: '',
    trackingID: '',
    maxRections: 1,
    lookbackDays: 90
};

export const ELEMENT_PROPS = {
    inputOffers: {
        name: 'inputOffers',
        dataType: FLOW_DATA_TYPE.SOBJECT.value
    },
    trackingID: {
        name: 'trackingID',
        dataType: FLOW_DATA_TYPE.STRING.value
    },
    reactionType: {
        name: 'reactionType',
        dataType: FLOW_DATA_TYPE.STRING.value
    },
    maxReaction: {
        name: 'maxReaction',
        dataType: 'Integer'
    },
    lookBackDays: {
        name: 'lookBackDays',
        dataType: 'Integer'
    }
};

export interface LimitRepetitionsInput {
    name: string;
    value: string | number;
    valueDataType: string;
}

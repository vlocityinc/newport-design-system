import { FEROV_DATA_TYPE, FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const DEFAULT_LOOK_BACK_DAYS = 90;
export const DEFAULT_MAX_REACTION = 1;
export const RECORD_ID = 'recordId';

export enum ReactionType {
    All = 'ALL',
    Accepted = 'ACCEPTED',
    Rejected = 'REJECTED'
}

export const DEFAULT_INPUT_VALUE = {
    inputOffers: { value: '', error: null },
    recordId: { value: RECORD_ID, error: null },
    lookBackDays: { value: DEFAULT_LOOK_BACK_DAYS, error: null },
    maxReaction: { value: DEFAULT_MAX_REACTION, error: null },
    reactionType: { value: ReactionType.All, error: null }
};

export const ELEMENT_PROPS = {
    inputOffers: {
        name: 'inputOffers',
        dataType: FEROV_DATA_TYPE.REFERENCE
    },
    recordId: {
        name: 'recordId',
        dataType: FEROV_DATA_TYPE.REFERENCE
    },
    reactionType: {
        name: 'reactionType',
        dataType: FLOW_DATA_TYPE.STRING.value
    },
    maxReaction: {
        name: 'maxReaction',
        dataType: FLOW_DATA_TYPE.NUMBER.value
    },
    lookBackDays: {
        name: 'lookBackDays',
        dataType: FLOW_DATA_TYPE.NUMBER.value
    }
};

export interface LimitRepetitionsInput {
    name: string;
    value: string | number;
    valueDataType: string;
}

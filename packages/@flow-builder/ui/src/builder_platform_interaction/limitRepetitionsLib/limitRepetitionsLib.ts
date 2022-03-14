import { FEROV_DATA_TYPE, FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const DEFAULT_WITHIN_DAYS = 90;
export const MIN_WITHIN_DAYS = 1;
export const MAX_WITHIN_DAYS = 99999;

export const DEFAULT_MAX_RESPONSES = 1;
export const MIN_MAX_RESPONSES = 1;
export const MAX_MAX_RESPONSES = 2000;

export const RECORD_ID = 'recordId';

export enum ResponseTypeToLimit {
    All = 'ALL',
    Accepted = 'ACCEPTED',
    Rejected = 'REJECTED'
}

export const DEFAULT_INPUT_VALUE = {
    inputRecommendations: { value: '', error: null },
    recordId: { value: RECORD_ID, error: null },
    withinDays: { value: DEFAULT_WITHIN_DAYS, error: null },
    maxResponses: { value: DEFAULT_MAX_RESPONSES, error: null },
    responseTypeToLimit: { value: ResponseTypeToLimit.All, error: null }
};

export const ELEMENT_PROPS = {
    inputRecommendations: {
        name: 'inputRecommendations',
        dataType: FEROV_DATA_TYPE.REFERENCE
    },
    recordId: {
        name: 'recordId',
        dataType: FEROV_DATA_TYPE.REFERENCE
    },
    responseTypeToLimit: {
        name: 'responseTypeToLimit',
        dataType: FLOW_DATA_TYPE.STRING.value
    },
    maxResponses: {
        name: 'maxResponses',
        dataType: FLOW_DATA_TYPE.NUMBER.value
    },
    withinDays: {
        name: 'withinDays',
        dataType: FLOW_DATA_TYPE.NUMBER.value
    }
};

export interface LimitRepetitionsInput {
    name: string;
    value: string | number;
    valueDataType: string;
}

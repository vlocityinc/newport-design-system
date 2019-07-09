import { flowPropertiesEditorReducer } from '../flowPropertiesEditorReducer';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { deepCopy } from 'builder_platform_interaction/storeLib';

const state = {
    description: '',
    elementType: 'FLOW_PROPERTIES',
    hasUnsavedChanges: false,
    interviewLabel: '{!aee09670-5055-426e-b387-f51930a9e54d}',
    isCreatedOutsideLfb: false,
    isLightningFlowBuilder: true,
    isTemplate: false,
    label: '423sd',
    lastModifiedBy: 'Admin User',
    lastModifiedDate: '2018-11-25T00:10:34.000Z',
    name: 'X423sd',
    processType: 'AutoLaunchedFlow',
    runInSystemMode: false,
    status: 'InvalidDraft',
    versionNumber: 1
};

describe('FlowPropertiesReducer', () => {
    it('PropertyChangedEvent should return the state with the updated label in the store.', () => {
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = flowPropertiesEditorReducer(deepCopy(state), event);
        expect(resultObj).toBeDefined();
        expect(resultObj.label.value).toEqual('newlabel');
        expect(resultObj).not.toBe(state);
    });
    it('PropertyChangedEvent should return the default state when event type is undefined.', () => {
        const event = {
            type: undefined
        };
        const resultObj = flowPropertiesEditorReducer(deepCopy(state), event);
        expect(resultObj).toBeDefined();
        expect(resultObj).toEqual(state);
    });
});

import { createElement } from 'lwc';
import LoopEditor from '../loopEditor';
import { PropertyChangedEvent, ComboboxStateChangedEvent } from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import {
    stringCollectionVariable1,
    accountSObjectVariable,
    caseSObjectVariable,
    caseSObjectCollectionVariable,
    stringVariable
} from 'mock/storeData';
import { getErrorFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING: actual.FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: (processType) => {
            return processType === 'Flow' ? 'Supported' : 'Unsupported';
        }
    };
});
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');
    return {
        updateProperties: actual.updateProperties,
        getValueFromHydratedItem: actual.getValueFromHydratedItem,
        sanitizeGuid: actual.sanitizeGuid,
        getErrorFromHydratedItem: jest.fn()
    };
});

const IAMERRORED = 'IAMERRORED';
const VARIABLE = 'VARIABLE_GUID';
const MENU_ITEM: UI.ComboboxItem = {
    iconSize: 'size',
    dataType: 'dataType',
    type: 'type',
    displayText: 'displayText',
    value: 'value'
};

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-loop-editor', {
        is: LoopEditor
    });

    Object.assign(el, { processType: FLOW_PROCESS_TYPE.FLOW });
    setDocumentBodyChildren(el);
    return el;
}

const selectors = {
    LOOP_COLLECTION_FEROV_RESOURCE_PICKER: '.test-loop-collection',
    LOOP_VARIABLE_FEROV_RESOURCE_PICKER: '.test-loop-variable',
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description'
};

const getCollectionFerovResourcePicker = (loopElement) => {
    return loopElement.shadowRoot.querySelector(selectors.LOOP_COLLECTION_FEROV_RESOURCE_PICKER);
};

const getVariableFerovResourcePicker = (loopElement) => {
    return loopElement.shadowRoot.querySelector(selectors.LOOP_VARIABLE_FEROV_RESOURCE_PICKER);
};

describe('loop-editor', () => {
    let noErrorState;
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    beforeEach(() => {
        noErrorState = {
            name: { value: 'testLoop', error: null },
            label: { value: 'testLoop', error: null },
            description: { value: 'test description', error: null },
            assignNextValueToReference: { value: 'VARIABLE_1', error: null },
            assignNextValueToReferenceIndex: { value: 'guid', error: null },
            collectionReference: { value: 'VARIABLE_2', error: null },
            collectionReferenceIndex: { value: 'guid2', error: null },
            iterationOrder: { value: 'Asc', error: null },
            elementType: 'LOOP',
            guid: '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElement: true,
            locationX: 789,
            locationY: 123
        };
    });
    const variableToMenuItem = (variable): UI.ComboboxItem => {
        const menuItem: UI.ComboboxItem = variable;
        menuItem.value = variable.guid;
        return menuItem;
    };
    it('handles the property changed event and updates the property', async () => {
        const loopElement = createComponentForTest();
        loopElement.node = noErrorState;
        Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            loopElement.shadowRoot.querySelector(selectors.LABEL_DESCRIPTION).dispatchEvent(event);
        });
        await ticks(1);
        expect(loopElement.node.description.value).toBe('new desc');
    });
    it('loop collection handles the combobox value changed event and updates the property', async () => {
        const loopElement = createComponentForTest();
        loopElement.node = noErrorState;
        MENU_ITEM.value = VARIABLE;
        Promise.resolve().then(() => {
            const event = new ComboboxStateChangedEvent(MENU_ITEM, VARIABLE, null);
            getVariableFerovResourcePicker(loopElement).dispatchEvent(event);
        });
        await ticks(1);
        expect(loopElement.node.assignNextValueToReference.value).toBe(VARIABLE);
        expect(loopElement.node.assignNextValueToReference.error).toBe(null);
    });
    it('handles the loop collection value and error message is updated', async () => {
        const loopElement = createComponentForTest();
        loopElement.node = noErrorState;
        MENU_ITEM.value = VARIABLE;

        Promise.resolve().then(() => {
            const event = new ComboboxStateChangedEvent(MENU_ITEM, VARIABLE, IAMERRORED);
            getCollectionFerovResourcePicker(loopElement).dispatchEvent(event);
        });
        await ticks(1);
        expect(loopElement.node.collectionReference.value).toBe(VARIABLE);
        expect(loopElement.node.collectionReference.error).toBe(IAMERRORED);
    });
    it('does not deal with loop variable error message when selecting a collection and using automatic output', async () => {
        const loopElement = createComponentForTest();
        Object.assign(noErrorState, {
            storeOutputAutomatically: true,
            collectionReference: caseSObjectCollectionVariable
        });
        loopElement.node = noErrorState;
        await ticks(1);

        const event = new ComboboxStateChangedEvent(variableToMenuItem(stringCollectionVariable1), VARIABLE, null);
        getCollectionFerovResourcePicker(loopElement).dispatchEvent(event);

        await ticks(1);
        expect(getErrorFromHydratedItem).not.toHaveBeenCalled();
    });
    describe('loop variable combobox', () => {
        it('is on error when loop collection is set to a different type', async () => {
            const loopElement = createComponentForTest();
            Object.assign(noErrorState.assignNextValueToReference, { value: accountSObjectVariable.guid });
            loopElement.node = noErrorState;
            const collectionVariable = variableToMenuItem(stringCollectionVariable1);

            Promise.resolve().then(() => {
                const event = new ComboboxStateChangedEvent(collectionVariable, VARIABLE, null);
                getCollectionFerovResourcePicker(loopElement).dispatchEvent(event);
            });
            await ticks(1);
            expect(loopElement.node.assignNextValueToReference.error).toBe(
                'FlowBuilderLoopEditor.loopVariableErrorMessage'
            );
        });
        it('is on error when loop collection is set to a different subtype', async () => {
            const loopElement = createComponentForTest();
            Object.assign(noErrorState.assignNextValueToReference, { value: accountSObjectVariable.guid });
            loopElement.node = noErrorState;
            const collectionVariable = variableToMenuItem(caseSObjectCollectionVariable);

            Promise.resolve().then(() => {
                const event = new ComboboxStateChangedEvent(collectionVariable, VARIABLE, null);
                getCollectionFerovResourcePicker(loopElement).dispatchEvent(event);
            });
            await ticks(1);
            expect(loopElement.node.assignNextValueToReference.error).toBe(
                'FlowBuilderLoopEditor.loopVariableErrorMessage'
            );
        });
        it('is on error when selected variable is of different type than loop collection', async () => {
            const loopElement = createComponentForTest();
            Object.assign(noErrorState.collectionReference, { value: stringCollectionVariable1.guid });
            loopElement.node = noErrorState;

            Promise.resolve().then(() => {
                const event = new ComboboxStateChangedEvent(variableToMenuItem(accountSObjectVariable), VARIABLE, null);
                getVariableFerovResourcePicker(loopElement).dispatchEvent(event);
            });
            await ticks(1);
            expect(loopElement.node.assignNextValueToReference.error).toBe(
                'FlowBuilderLoopEditor.loopVariableErrorMessage'
            );
        });
        it('is on error when selected variable is of different subtype than loop collection', async () => {
            const loopElement = createComponentForTest();
            Object.assign(noErrorState.collectionReference, { value: caseSObjectCollectionVariable.guid });
            loopElement.node = noErrorState;

            Promise.resolve().then(() => {
                const event = new ComboboxStateChangedEvent(variableToMenuItem(accountSObjectVariable), VARIABLE, null);
                getVariableFerovResourcePicker(loopElement).dispatchEvent(event);
            });
            await ticks(1);
            expect(loopElement.node.assignNextValueToReference.error).toBe(
                'FlowBuilderLoopEditor.loopVariableErrorMessage'
            );
        });
        it('is not on error when loop variable is set back to a value with the same type as the collection', async () => {
            const loopElement = createComponentForTest();
            Object.assign(noErrorState.assignNextValueToReference, { value: accountSObjectVariable.guid });
            Object.assign(noErrorState.collectionReference, stringCollectionVariable1);
            loopElement.node = noErrorState;

            Promise.resolve().then(() => {
                const event = new ComboboxStateChangedEvent(variableToMenuItem(stringVariable), VARIABLE, null);
                getVariableFerovResourcePicker(loopElement).dispatchEvent(event);
            });
            await ticks(1);
            expect(loopElement.node.assignNextValueToReference.error).toBe(null);
        });
        it('is not on error when loop variable is set back to a value with the same subtype as the collection', async () => {
            const loopElement = createComponentForTest();
            Object.assign(noErrorState.assignNextValueToReference, { value: accountSObjectVariable.guid });
            Object.assign(noErrorState.collectionReference, caseSObjectCollectionVariable);
            loopElement.node = noErrorState;

            Promise.resolve().then(() => {
                const event = new ComboboxStateChangedEvent(variableToMenuItem(caseSObjectVariable), VARIABLE, null);
                getVariableFerovResourcePicker(loopElement).dispatchEvent(event);
            });
            await ticks(1);
            expect(loopElement.node.assignNextValueToReference.error).toBe(null);
        });
    });
});

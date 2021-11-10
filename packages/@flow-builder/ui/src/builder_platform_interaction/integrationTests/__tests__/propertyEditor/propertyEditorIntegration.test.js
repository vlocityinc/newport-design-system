import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as autoLaunchedFlowScheduled from 'mock/flows/autoLaunchedFlowScheduled.json';
import * as contactRequestFlow from 'mock/flows/contactRequestFlow.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import * as orchestratorFlow from 'mock/flows/orchestratorFlow.json';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import * as scheduleTriggeredFlow from 'mock/flows/scheduleTriggeredFlow.json';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setupStateForFlow, resetState } from '../integrationTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { getPropertyEditorConfig } from 'builder_platform_interaction/builderUtils';
import { createElement } from 'lwc';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { isSystemElement } from 'builder_platform_interaction/flowMetadata';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    return Object.assign({}, sharedUtils, {
        invokeModal: require('builder_platform_interaction/sharedUtils/auraUtils').invokeModal
    });
});
jest.mock('builder_platform_interaction/editor', () => {
    return Object.assign({}, { launchSubflow: jest.fn() });
});

const createPropertyEditorComponent = async (
    elementForPropertyEditor,
    processType = Store.getStore().getCurrentState().properties.processType
) => {
    const mode = EditElementEvent.EVENT_NAME;
    const propertyEditorParams = getPropertyEditorConfig(mode, {
        mode,
        node: elementForPropertyEditor,
        processType,
        nodeUpdate: () => {}
    });
    // this test file is a js file because tsc cannot compile files with await import given our compilerOptions.target
    // eslint-disable-next-line lwc-core/no-dynamic-import
    const module = await import(propertyEditorParams.attr.bodyComponent.className);
    const propertyEditorElement = createElement('x-lazy', {
        is: module.default
    });
    Object.assign(propertyEditorElement, {
        node: elementForPropertyEditor,
        mode: propertyEditorParams.attr.bodyComponent.attr.mode,
        processType: propertyEditorParams.attr.bodyComponent.attr.processType,
        editorParams: propertyEditorParams
    });
    setDocumentBodyChildren(propertyEditorElement);
    return propertyEditorElement;
};

const RESOURCE_TYPES = [
    ELEMENT_TYPE.VARIABLE,
    ELEMENT_TYPE.CONSTANT,
    ELEMENT_TYPE.FORMULA,
    ELEMENT_TYPE.TEXT_TEMPLATE,
    ELEMENT_TYPE.CHOICE,
    ELEMENT_TYPE.RECORD_CHOICE_SET,
    ELEMENT_TYPE.PICKLIST_CHOICE_SET,
    ELEMENT_TYPE.STAGE
];

const getEditableElements = ({ elements, canvasElements } = Store.getStore().getCurrentState()) => {
    const editableResources = Object.values(elements).filter((element) => RESOURCE_TYPES.includes(element.elementType));
    // TODO : for some processTypes, startElement is editable
    const nonSystemEditableCanvasElements = canvasElements
        .map((guid) => elements[guid])
        .filter((element) => !isSystemElement(element.elementType));
    return [...editableResources, ...nonSystemEditableCanvasElements];
};

describe('Property Editor', () => {
    describe.each([
        { flow: flowWithAllElements },
        { flow: autoLaunchedFlowScheduled },
        { flow: contactRequestFlow },
        { flow: fieldServiceMobileFlow },
        { flow: orchestratorFlow },
        { flow: recordTriggeredFlow },
        { flow: scheduleTriggeredFlow }
    ])('for flow : $flow.fullName', ({ flow }) => {
        beforeAll(async () => {
            // we set devMode to true to detect illegal changes to the state during getElementForPropertyEditor calls (see W-9823122 or W-9843783)
            await setupStateForFlow(flow, { devMode: true });
        });
        afterAll(() => {
            resetState();
        });
        test('can create property editor for all elements', async () => {
            for (const element of getEditableElements()) {
                try {
                    const elementForPropertyEditor = getElementForPropertyEditor(element);
                    expect(elementForPropertyEditor).toBeTruthy();
                    // this makes sure the property editor component can be created, but some elements can be in error state and some promises can be rejected ...
                    // eslint-disable-next-line no-await-in-loop
                    await createPropertyEditorComponent(elementForPropertyEditor);
                    // eslint-disable-next-line no-await-in-loop
                    await ticks(50);
                } catch (e) {
                    const message = `Could not create property editor for element '${element.name}'`;
                    const error = new Error(message);
                    error.stack = `${message}\n${e.stack}`;
                    throw error;
                }
            }
        });
    });
});

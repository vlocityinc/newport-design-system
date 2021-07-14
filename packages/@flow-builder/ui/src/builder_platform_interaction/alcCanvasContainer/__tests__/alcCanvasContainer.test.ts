// @ts-nocheck
import { createElement } from 'lwc';
import AlcCanvasContainer from 'builder_platform_interaction/alcCanvasContainer';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getChildElementTypesWithOverridenProperties } from 'builder_platform_interaction/elementConfig';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/alcCanvas', () => require('builder_platform_interaction_mocks/alcCanvas'));

jest.mock('builder_platform_interaction/storeLib');

const elementsMetadata = [
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:screen',
        label: 'Screen',
        value: 'Screen',
        elementType: 'Screen',
        description: 'Collect information from users who run the flow or show them some information.',
        canHaveFaultConnector: false
    },
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:lightning_component',
        label: 'New Action',
        value: 'ActionCall',
        elementType: 'ActionCall',
        description:
            'Perform an action outside of the flow. Choose from your org’s custom create and update actions or an out-of-the-box action, like Post to Chatter or Submit for Approval.',
        canHaveFaultConnector: true
    },
    {
        section: 'Flow Control',
        type: 'branch',
        icon: 'standard:decision',
        label: 'Decision',
        value: 'Decision',
        elementType: 'Decision',
        description: 'Create paths for the flow to take based on conditions you set.',
        canHaveFaultConnector: false
    },
    {
        section: 'Flow Control',
        type: 'branch',
        icon: 'standard:waits',
        label: 'Pause',
        value: 'Wait',
        elementType: 'Wait',
        description:
            'Pause the flow. Resume the flow when the org receives a platform event message or a specified day, date, or time occurs.',
        canHaveFaultConnector: true
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_create',
        label: 'RecordCreate',
        value: 'RecordCreate',
        elementType: 'RecordCreate',
        description: 'Create Salesforce records using values from the flow.',
        canHaveFaultConnector: true
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_update',
        label: 'RecordUpdate',
        value: 'RecordUpdate',
        elementType: 'RecordUpdate',
        description: 'Find Salesforce records, and store their field values to use later in the flow.',
        canHaveFaultConnector: true
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_lookup',
        label: 'RecordQuery',
        value: 'RecordQuery',
        elementType: 'RecordQuery',
        description: 'Update Salesforce records using values from the flow.',
        canHaveFaultConnector: true
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_delete',
        label: 'RecordDelete',
        value: 'RecordDelete',
        elementType: 'RecordDelete',
        description: 'Delete Salesforce records.',
        canHaveFaultConnector: true
    },
    {
        section: null,
        icon: 'utility:right',
        label: 'Start',
        value: 'START_ELEMENT',
        elementType: 'START_ELEMENT',
        type: 'start',
        canHaveFaultConnector: false
    },
    {
        section: null,
        icon: '',
        label: '',
        elementType: 'root',
        value: 'root',
        type: 'root',
        canHaveFaultConnector: false
    },
    {
        section: 'Logic',
        icon: 'standard:first_non_empty',
        description: 'End Description',
        label: 'End',
        value: 'END_ELEMENT',
        elementType: 'END_ELEMENT',
        type: 'end',
        canHaveFaultConnector: false
    },
    {
        section: 'Interaction',
        type: 'orchestratedstage',
        icon: 'standard:screen',
        label: 'orchestratedStage',
        value: 'orchestratedstage',
        elementType: 'orchestratedstage',
        description: 'stepped stage desc',
        canHaveFaultConnector: false,
        supportsMenu: true,
        isSupported: true,
        dynamicNodeComponent: 'builder_platform_interaction/orchestratedStageNode'
    }
];

const createComponentForTest = (elementsMetadata = []) => {
    const el = createElement('builder_platform_interaction-alc-canvas-container', {
        is: AlcCanvasContainer
    });

    el.isSelectionMode = false;
    el.isPasteAvailable = false;
    el.elementsMetadata = elementsMetadata;

    setDocumentBodyChildren(el);

    return el;
};

describe('alc builder container', () => {
    let cmp;

    beforeAll(() => {
        Store.getStore.mockImplementation(() => {
            return {
                getCurrentState: jest.fn(() => {
                    return {
                        elements: { startGuid: { elementType: 'START_ELEMENT' } },
                        properties: { processType: 'autolaunched', isAutoLayoutCanvas: true }
                    };
                }),
                subscribe: jest.fn(() => jest.fn()),
                unsubscribe: jest.fn()
            };
        });
    });

    beforeEach(() => {
        cmp = createComponentForTest(elementsMetadata);
    });

    const getBuilderContainerElement = () =>
        cmp.shadowRoot.querySelector('builder_platform_interaction-alc-canvas-container');

    const getAlcCanvas = () => cmp.shadowRoot.querySelector('builder_platform_interaction-alc-canvas');

    it('renders the component', async () => {
        await ticks(1);
        expect(getBuilderContainerElement).not.toBeNull();
    });

    it('offsets when in selection mode', async () => {
        await ticks(1);
        expect(getAlcCanvas().offsets).toEqual([0, 58]);

        cmp.isSelectionMode = true;
        await ticks(1);
        expect(getAlcCanvas().offsets).toEqual([320, 58]);
    });

    it('intializes augmented metadata types correctly', async () => {
        await ticks(1);
        const elementTypes = cmp.elementsMetadata.map((element) => {
            return element.elementType;
        });
        const expectedElementTypeArray = [
            ELEMENT_TYPE.END_ELEMENT,
            ELEMENT_TYPE.ROOT_ELEMENT,
            ELEMENT_TYPE.START_ELEMENT
        ].concat(getChildElementTypesWithOverridenProperties());

        expect(elementTypes).toEqual(expect.arrayContaining(expectedElementTypeArray));
    });

    it('can have a fault connector for record update', async () => {
        await ticks(1);
        const elementsMetadata = cmp.elementsMetadata.filter(
            (element) => element.elementType === ELEMENT_TYPE.RECORD_UPDATE
        );
        expect(elementsMetadata.length).toBe(1);
        expect(elementsMetadata[0].canHaveFaultConnector).toBe(true);
    });
});

describe('before save flow', () => {
    let cmp;

    beforeAll(() => {
        Store.getStore.mockImplementation(() => {
            return {
                getCurrentState: jest.fn(() => {
                    return {
                        elements: { startGuid: { elementType: 'START_ELEMENT', triggerType: 'RecordBeforeSave' } },
                        properties: { processType: 'autolaunched' }
                    };
                }),
                subscribe: jest.fn(() => jest.fn()),
                unsubscribe: jest.fn()
            };
        });
    });

    beforeEach(() => {
        cmp = createComponentForTest(elementsMetadata);
    });

    it('cannot have a fault connector for record update', async () => {
        await ticks(1);
        const elementsMetadata = cmp.elementsMetadata.filter(
            (element) => element.elementType === ELEMENT_TYPE.RECORD_UPDATE
        );
        expect(elementsMetadata.length).toBe(1);
        expect(elementsMetadata[0].canHaveFaultConnector).toBe(false);
    });
});

import CustomPropertyEditor from '../customPropertyEditor';
import { createElement } from 'lwc';
import { createConfigurationEditor } from 'builder_platform_interaction/builderUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/translatorLib', () => ({
    translateUIModelToFlow: jest.fn()
}));

jest.mock('builder_platform_interaction/builderUtils', () => ({
    createConfigurationEditor: jest.fn()
}));

const mockConfgurationEditorProperties = [
    {
        apexClass: null,
        dataType: 'string',
        description: 'Optional. The org-wide email address to be used as the sender.',
        durableId: 'emailSimple-emailSimple-input-senderAddress',
        id: null,
        isInput: true,
        isOutput: false,
        isRequired: false,
        isSystemGeneratedOutput: false,
        label: 'Sender Address',
        maxOccurs: 1,
        name: 'senderAddress',
        sobjectType: null
    },
    {
        apexClass: null,
        dataType: 'string',
        description: 'desc2',
        durableId: 'emailSimple-emailSimple-input-senderAddress',
        id: null,
        isInput: true,
        isOutput: false,
        isRequired: false,
        isSystemGeneratedOutput: false,
        label: 'name',
        maxOccurs: 1,
        name: 'testname',
        sobjectType: null
    }
];

const mockConfigurationEditorValues = [
    {
        id: 'names',
        value: 'Hello World',
        dataType: 'string'
    }
];

const mockFlowContext = {
    variables: []
};

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-custom-property-editor', { is: CustomPropertyEditor });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Custom Property Editor', () => {
    it('renders and calls generateGuid', () => {
        const storeLib = require('builder_platform_interaction_mocks/storeLib');
        storeLib.generateGuid = jest.fn().mockReturnValue('mockGuid');

        const cpe = createComponentForTest();
        expect(cpe).toBeDefined();
        expect(generateGuid).toHaveBeenCalled();
    });
    it('gets the correct properties from the proxy ', () => {
        const cpe = createComponentForTest();
        const proxy = new Proxy(mockConfgurationEditorProperties, {});
        cpe.configurationEditorProperties = proxy;

        expect(cpe.configurationEditorProperties).toMatchObject(mockConfgurationEditorProperties);
    });
    it('gets the correct values from the proxy ', () => {
        const cpe = createComponentForTest();
        const proxy = new Proxy(mockConfigurationEditorValues, []);
        cpe.configurationEditorValues = proxy;

        expect(cpe.configurationEditorValues).toMatchObject(mockConfigurationEditorValues);
    });
    it('gets the correct flow context from the proxy ', () => {
        const cpe = createComponentForTest();
        const proxy = new Proxy(mockFlowContext, {});
        cpe.flowContext = proxy;

        expect(cpe.flowContext).toMatchObject(mockFlowContext);
    });
    it('creates the config editor when there is data and a configuration editor ', async () => {
        const cpe = createComponentForTest({
            configurationEditor: {
                name: 'c-test_editor',
                errors: []
            }
        });

        const proxy = new Proxy(mockConfgurationEditorProperties, {});
        cpe.configurationEditorProperties = proxy;

        await ticks(1);
        expect(createConfigurationEditor).toHaveBeenCalled();
    });
    it('does not create a config editor when there is no configuration editor ', async () => {
        const cpe = createComponentForTest();

        const proxy = new Proxy(mockConfgurationEditorProperties, {});
        cpe.configurationEditorProperties = proxy;

        await ticks(1);
        expect(createConfigurationEditor).not.toHaveBeenCalled();
    });
    it('does not creates the config editor when configuration editor is defined but there are errors', async () => {
        const cpe = createComponentForTest({
            configurationEditor: {
                name: 'c-test_editor',
                errors: ['errors']
            }
        });

        const proxy = new Proxy(mockConfgurationEditorProperties, {});
        cpe.configurationEditorProperties = proxy;

        await ticks(1);
        expect(createConfigurationEditor).not.toHaveBeenCalled();
    });
});

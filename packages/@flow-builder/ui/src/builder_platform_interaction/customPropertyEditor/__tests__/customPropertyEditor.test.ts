// @ts-nocheck
import CustomPropertyEditor from '../customPropertyEditor';
import { createElement } from 'lwc';
import { createConfigurationEditor } from 'builder_platform_interaction/customPropertyEditorLib';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/translatorLib', () => ({
    translateUIModelToFlow: jest.fn()
}));

jest.mock('builder_platform_interaction/customPropertyEditorLib', () => ({
    createConfigurationEditor: jest.fn()
}));

const SELECTORS = { SPINNER: '.spinner' };

const mockElementInfo = {
    apiName: 'CreateTask',
    type: 'Action'
};

const mockConfigurationEditorInputVariables = [
    {
        name: 'names',
        value: 'Hello World',
        valueDataType: 'string'
    }
];

const mockConfigurationEditorTypeMappings = [
    {
        name: 'T',
        value: 'Account'
    }
];

const mockBuilderContext = {
    variables: []
};

const mockAutomaticOutputVariables = {
    phone: [
        {
            apiName: 'label',
            dataType: 'string'
        }
    ]
};

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-custom-property-editor', { is: CustomPropertyEditor });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

describe('Custom Property Editor', () => {
    it('gets the correct element info from the proxy ', () => {
        const cpe = createComponentForTest();
        const proxy = new Proxy(mockElementInfo, {});
        cpe.elementInfo = proxy;

        expect(cpe.elementInfo).toMatchObject(mockElementInfo);
    });
    it('gets the correct input variables from the proxy ', () => {
        const cpe = createComponentForTest();
        const proxy = new Proxy(mockConfigurationEditorInputVariables, []);
        cpe.inputVariables = proxy;

        expect(cpe.inputVariables).toMatchObject(mockConfigurationEditorInputVariables);
    });
    it('gets the correct type mappings from the proxy ', () => {
        const cpe = createComponentForTest();
        const proxy = new Proxy(mockConfigurationEditorTypeMappings, []);
        cpe.genericTypeMappings = proxy;

        expect(cpe.genericTypeMappings).toMatchObject(mockConfigurationEditorTypeMappings);
    });
    it('gets the correct builder context from the proxy ', () => {
        const cpe = createComponentForTest();
        const proxy = new Proxy(mockBuilderContext, {});
        cpe.builderContext = proxy;

        expect(cpe.builderContext).toMatchObject(mockBuilderContext);
    });
    it('gets the correct automatic output variables from the proxy ', () => {
        const cpe = createComponentForTest();
        const proxy = new Proxy(mockAutomaticOutputVariables, {});
        cpe.automaticOutputVariables = proxy;

        expect(cpe.automaticOutputVariables).toMatchObject(mockAutomaticOutputVariables);
    });
    it('creates the config editor when there is data and a configuration editor ', async () => {
        const cpe = createComponentForTest({
            configurationEditor: {
                name: 'c-test_editor',
                errors: []
            }
        });

        const proxy = new Proxy(mockConfigurationEditorInputVariables, {});
        cpe.configurationEditorInputVariables = proxy;

        await ticks(1);
        expect(createConfigurationEditor).toHaveBeenCalled();
    });
    it('does not create a config editor when there is no configuration editor ', async () => {
        const cpe = createComponentForTest();

        const proxy = new Proxy(mockConfigurationEditorInputVariables, {});
        cpe.configurationEditorInputVariables = proxy;

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

        const proxy = new Proxy(mockConfigurationEditorInputVariables, {});
        cpe.configurationEditorInputVariables = proxy;

        await ticks(1);
        expect(createConfigurationEditor).not.toHaveBeenCalled();
    });
    it('spinner should not be displayed initially', () => {
        const cpe = createComponentForTest();
        const spinner = cpe.shadowRoot.querySelector(SELECTORS.SPINNER);
        expect(spinner).toBeNull();
    });
    it('spinner should not be displayed when configuration editor is loaded with errors', async () => {
        const cpe = createComponentForTest({
            configurationEditor: {
                name: 'c-test_editor',
                errors: ['errors']
            }
        });
        await ticks(1);
        const spinner = cpe.shadowRoot.querySelector(SELECTORS.SPINNER);
        expect(spinner).toBeNull();
    });
    it('spinner should be displayed when configuration editor is loaded without errors', async () => {
        const cpe = createComponentForTest({
            configurationEditor: {
                name: 'c-test_editor',
                errors: []
            }
        });
        await ticks(1);
        const spinner = cpe.shadowRoot.querySelector(SELECTORS.SPINNER);
        expect(spinner).not.toBeNull();
    });
});

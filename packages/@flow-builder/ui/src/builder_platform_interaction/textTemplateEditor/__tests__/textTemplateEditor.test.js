import { createElement } from 'lwc';
import TextTemplateEditor from '../textTemplateEditor';
import { textTemplateReducer } from '../textTemplateReducer';
import * as mockStoreData from 'mock/storeData';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import {
    createAction,
    PROPERTY_EDITOR_ACTION
} from 'builder_platform_interaction/actions';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    RESOURCED_RICH_TEXT_EDITOR:
        'builder_platform_interaction-resourced-rich-text-editor',
    LIGHTNING_INPUT_RICH_TEXT: 'lightning-input-rich-text'
};

const setupComponentUnderTest = props => {
    const element = createElement(
        'builder_platform_interaction-text-template-editor',
        {
            is: TextTemplateEditor
        }
    );
    element.node = props;
    document.body.appendChild(element);
    return element;
};

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = require.requireActual(
        '../../dataMutationLib/dataMutationLib.js'
    );
    return {
        pick: actual.pick,
        getErrorsFromHydratedElement: jest.fn(),
        getValueFromHydratedItem: actual.getValueFromHydratedItem
    };
});

jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload) => payload),
        PROPERTY_EDITOR_ACTION: require.requireActual(
            '../../actions/actions.js'
        ).PROPERTY_EDITOR_ACTION
    };
});

jest.mock('../textTemplateReducer', () => {
    return {
        textTemplateReducer: jest
            .fn()
            .mockImplementation(obj => Object.assign({}, obj))
    };
});

const mockHydratedElementWithErrors = [
    { key: 'mockKey', errorString: 'mockErrorString' }
];

describe('text-template-editor', () => {
    let textTemplateResource;

    beforeEach(() => {
        textTemplateResource = deepCopy(
            mockStoreData.textTemplates[mockStoreData.textTemplateGuid]
        );
    });

    test('check UI (snapshot) - "RichTextPlainTextSwitch" displayed with "richText" mode checked by default and correct css class for resource picker', () => {
        const textTemplateEditor = setupComponentUnderTest(
            textTemplateResource
        );
        expect(textTemplateEditor).toMatchSnapshot();
    });

    it('contains a text template element', () => {
        const textTemplateEditor = setupComponentUnderTest(
            textTemplateResource
        );
        return Promise.resolve().then(() => {
            expect(textTemplateEditor.node.elementType).toEqual(
                mockStoreData.textTemplate
            );
            expect(textTemplateEditor.getNode()).toEqual(textTemplateResource);
        });
    });

    it('has label description component that shows only dev name and description', () => {
        const textTemplateEditor = setupComponentUnderTest(
            textTemplateResource
        );
        const labelDescription = textTemplateEditor.shadowRoot.querySelector(
            SELECTORS.LABEL_DESCRIPTION
        );
        expect(labelDescription).toBeDefined();
        expect(labelDescription.description).toEqual(
            textTemplateResource.description
        );
        expect(labelDescription.devName).toEqual(textTemplateResource.name);
        expect(labelDescription.hideLabel).toBeTruthy();
    });

    it('has resourced-textarea showing the correct text template', () => {
        const textTemplateEditor = setupComponentUnderTest(
            textTemplateResource
        );
        const resourcedRichTextEditor = textTemplateEditor.shadowRoot.querySelector(
            SELECTORS.RESOURCED_RICH_TEXT_EDITOR
        );
        expect(resourcedRichTextEditor).toBeDefined();
        const lightningInputRichText = resourcedRichTextEditor.shadowRoot.querySelector(
            SELECTORS.LIGHTNING_INPUT_RICH_TEXT
        );
        expect(lightningInputRichText.value).toEqual(
            textTemplateResource.text.value
        );
    });

    it('handles the property changed event and updates the property from label-description', () => {
        const textTemplateEditor = setupComponentUnderTest(
            textTemplateResource
        );
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent(
                'description',
                'new desc',
                null
            );
            textTemplateEditor.shadowRoot
                .querySelector('builder_platform_interaction-label-description')
                .dispatchEvent(event);
            expect(createAction.mock.calls[0][0]).toEqual(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY
            );
            expect(textTemplateReducer.mock.calls[0][0]).toEqual(
                textTemplateEditor.node
            );
        });
    });

    it('handles the change event and updates the property from resourced-textarea', () => {
        const textTemplateEditor = setupComponentUnderTest(
            textTemplateResource
        );
        const newTextTemplate = '<html> New text in template</html>';
        return Promise.resolve().then(() => {
            const event = new CustomEvent('change', {
                detail: { value: newTextTemplate, error: null },
                cancelable: true,
                composed: true,
                bubbles: true
            });
            textTemplateEditor.shadowRoot
                .querySelector(SELECTORS.RESOURCED_RICH_TEXT_EDITOR)
                .dispatchEvent(event);
            expect(createAction.mock.calls[0][0]).toEqual(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY
            );
            expect(createAction.mock.calls[0][1]).toEqual({
                propertyName: 'text',
                value: newTextTemplate,
                error: null
            });
            expect(textTemplateReducer.mock.calls[0][0]).toEqual(
                textTemplateEditor.node
            );
        });
    });

    describe('validation', () => {
        it('calls reducer with validate all event', () => {
            const textTemplateEditor = setupComponentUnderTest(
                textTemplateResource
            );
            const node = textTemplateEditor.node;
            textTemplateEditor.validate();
            expect(textTemplateReducer.mock.calls[0][0]).toEqual(node);
            expect(textTemplateReducer.mock.calls[0][1]).toEqual({
                type: VALIDATE_ALL
            });
        });

        it('gets the errors after validating', () => {
            const textTemplateEditor = setupComponentUnderTest(
                textTemplateResource
            );
            getErrorsFromHydratedElement.mockReturnValueOnce(
                mockHydratedElementWithErrors
            );
            const result = textTemplateEditor.validate();
            expect(getErrorsFromHydratedElement).toHaveBeenCalledWith(
                textTemplateEditor.node
            );
            expect(result).toEqual(mockHydratedElementWithErrors);
        });
    });
});

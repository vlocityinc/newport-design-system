// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import recordPicker from 'builder_platform_interaction/recordPicker';
import { createElement } from 'lwc';
import { AuraComponent } from '../auraInterop';

jest.mock('../auraInterop');
AuraComponent.mockImplementation(() => {
    jest.fn();
});

const createComponentUnderTest = (attributes, values, recordSelectedCallback, error) => {
    const el = createElement('builder_platform_interaction-stepped-stage-item-editor', {
        is: recordPicker
    });

    el.attributes = attributes;
    el.values = values;
    el.error = error;
    el.recordSelectedCallback = recordSelectedCallback;
    el.required = true;

    setDocumentBodyChildren(el);

    return el;
};

describe('recordPicker', () => {
    const attributes = { a: 1 };
    const values = [{ id: 2 }];
    const errors = [];
    const required = true;
    const recordSelectedCallback = jest.fn();
    let component;

    beforeEach(() => {
        component = createComponentUnderTest(attributes, values, recordSelectedCallback);
    });

    it('loads the aura component once attributes, values, recordSelectedCallback, and errors are available', () => {
        const mergedAttributes = {
            ...attributes,
            recordSelectedCallback,
            required,
            values,
            errors
        };
        const entityPicker = component.shadowRoot.querySelector('.entityPicker');
        expect(AuraComponent).toHaveBeenLastCalledWith(
            entityPicker,
            'builder_platform_interaction:recordPickerWrapper',
            mergedAttributes,
            expect.anything()
        );
    });
});

// @ts-nocheck
import { createElement } from 'lwc';
import recordPicker from 'builder_platform_interaction/recordPicker';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
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

    setDocumentBodyChildren(el);

    return el;
};

describe('recordPicker', () => {
    const attributes = { a: 1 };
    const values = [{ id: 2 }];
    const errors = [];
    const recordSelectedCallback = jest.fn();

    beforeEach(() => {
        createComponentUnderTest(attributes, values, recordSelectedCallback);
    });

    it('loads the aura component once attributes, values, recordSelectedCallback, and errors are available', () => {
        const mergedAttributes = {
            ...attributes,
            recordSelectedCallback,
            values,
            errors
        };
        expect(AuraComponent).toHaveBeenCalledWith(
            null,
            'builder_platform_interaction:recordPickerWrapper',
            mergedAttributes,
            expect.anything()
        );
    });
});

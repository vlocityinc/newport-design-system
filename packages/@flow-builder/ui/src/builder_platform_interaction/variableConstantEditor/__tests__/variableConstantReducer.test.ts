// @ts-nocheck
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { createElement } from 'lwc';
import * as mockStoreData from 'mock/storeData';
import VariableConstantEditor from '../variableConstantEditor';
import { variableConstantReducer } from '../variableConstantReducer';
import { variableConstantValidation } from '../variableConstantValidation';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-variable-constant-editor', {
        is: VariableConstantEditor
    });
    element.node = props;
    element.node.defaultValueIndex = { value: 'guid', error: null };
    setDocumentBodyChildren(element);
    return element;
};

describe('variable/constant reducer', () => {
    const propertyName = 'description';
    const value = 'desc';
    const error = 'error';

    let variableConstantEditor;
    let stringVariable;
    let spy;
    let updateAction;
    let updatedEditor;

    beforeEach(() => {
        stringVariable = mockStoreData.stringVariableForPropertyEditor();
        variableConstantEditor = setupComponentUnderTest(stringVariable);

        updateAction = (errorValue) => {
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                propertyName,
                value,
                error: errorValue
            });
            updatedEditor = variableConstantReducer(variableConstantEditor, action);
        };

        spy = jest.spyOn(variableConstantValidation, 'validateProperty');
    });

    afterEach(() => {
        spy.mockRestore();
    });

    it('validates property on update', () => {
        updateAction();

        expect(spy).toHaveBeenCalledWith(propertyName, value);
    });
    it('preserves existing error', () => {
        updateAction(error);

        expect(spy).not.toHaveBeenCalledWith();
        expect(updatedEditor[propertyName][error]).toEqual(error);
    });
    it('updates error when one is not provided', () => {
        spy.mockImplementation(() => error);
        updateAction();

        expect(spy).toHaveBeenCalledWith(propertyName, value);
        expect(updatedEditor[propertyName][error]).toEqual(error);
    });
});

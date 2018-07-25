import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { mutateFEROV, deMutateFEROV } from '../ferovEditorDataMutation';
import * as store from 'mock-store-data';
import * as storeUtilMock from 'builder_platform_interaction-store-utils';
import { FLOW_DATA_TYPE } from '../../data-type-lib/data-type-lib';
import { addCurlyBraces } from 'builder_platform_interaction-common-utils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction-system-lib';

const stringFerovValue = 'abc';
const variableFerovValue = 123;
const dateFerovValue = '2008-08-09T00:00:00.000+0000';
const dateTimeFerovValue = '2018-07-24T23:04:03+07:00';
const elementReference = 'myVariable';

const expectedParams = {
    valueProperty: 'rightHandSide',
    dataTypeProperty: 'rightHandSideDataType',
};

jest.mock('builder_platform_interaction-store-utils', () => {
    return {
        getElementByGuid: jest.fn(),
    };
});

jest.mock('builder_platform_interaction-data-mutation-lib', () => {
    return {
        mutateTextWithMergeFields: require.requireActual('builder_platform_interaction-data-mutation-lib').mutateTextWithMergeFields,
    };
});

describe('mutateFerov function', () => {
    it('should mutate ferov with string value', () => {
        const item = {};
        item.ferov = { stringValue: stringFerovValue };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(stringFerovValue);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.STRING);
    });

    it('should mutate ferov with global constant empty string value', () => {
        const item = {};
        item.ferov = { stringValue: '' };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING));
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.STRING);
    });

    it('should mutate ferov with number value', () => {
        const item = {};
        item.ferov = { numberValue: variableFerovValue };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(variableFerovValue.toString());
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.NUMBER);
    });

    it('should mutate ferov with date value', () => {
        const item = {};
        item.ferov = { dateValue: dateFerovValue };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual('2008-08-09');
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.DATE);
    });

    it('should mutate ferov with datetime value', () => {
        const item = {};
        item.ferov = { dateTimeValue: dateTimeFerovValue };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual('07/24/2018 09:04:03 GMT-0700 (PDT)');
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.DATETIME);
    });

    it('should mutate ferov with boolean value true', () => {
        const item = {};
        item.ferov = { booleanValue: true };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_TRUE));
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.BOOLEAN);
    });

    it('should mutate ferov with boolean value false', () => {
        const item = {};
        item.ferov = { booleanValue: false };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE));
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.BOOLEAN);
    });

    it('should mutate ferov with reference value', () => {
        const item = {};
        item.ferov = { elementReference };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(elementReference);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
    });

    it('should mutate ferov with null / undefined ferov', () => {
        const item = {};
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual('');
    });

    it('should mutate ferov with null string value', () => {
        const item = {};
        item.ferov = { stringValue: null };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(null);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.STRING);
    });

    it('should not blow up with empty ferov', () => {
        const item = {};
        item.ferov = {};
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual('');
    });

    it('should mutate ferov with reference guid', () => {
        const numberVariableElement = store.elements[store.numberVariableGuid];
        storeUtilMock.getElementByGuid.mockReturnValue(numberVariableElement);
        const item = {};
        item.ferov = { elementReference : store.numberVariableGuid };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual('{!' + store.elements[store.numberVariableGuid].name + '}');
        expect(mutatedItem.rightHandSideGuid).toEqual(store.numberVariableGuid);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
    });

    it('should mutate ferov with inline merge field', () => {
        const stringValue = 'Hey this is a number: ';
        const item = {};
        item.ferov = { stringValue: stringValue + addCurlyBraces(store.numberVariableGuid) };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        const numberVariableElement = store.elements[store.numberVariableGuid];
        expect(mutatedItem.rightHandSide).toEqual(stringValue + addCurlyBraces(numberVariableElement.name));
    });

    it('should mutate ferov with mulitple inline merge fields', () => {
        const stringValue = 'Hey this is a number {1} and so is this {1}';
        const item = {};
        item.ferov = { stringValue: stringValue.replace('{1}', addCurlyBraces(store.numberVariableGuid)) };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        const numberVariableElement = store.elements[store.numberVariableGuid];
        expect(mutatedItem.rightHandSide).toEqual(stringValue.replace('{1}', addCurlyBraces(numberVariableElement.name)));
    });
});

describe('deMutateFerov function', () => {
    it('should demutate ferov with string value', () => {
        const item = {};
        item.rightHandSide = stringFerovValue;
        item.rightHandSideDataType = FLOW_DATA_TYPE.STRING.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.stringValue).toEqual(stringFerovValue);
    });

    it('should demutate ferov with global constant empty string value', () => {
        const item = {};
        item.rightHandSide = addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING);
        item.rightHandSideDataType = FLOW_DATA_TYPE.STRING.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.stringValue).toEqual('');
    });

    it('should demutate ferov with number value', () => {
        const item = {};
        item.rightHandSide = variableFerovValue;
        item.rightHandSideDataType = FLOW_DATA_TYPE.NUMBER.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.numberValue).toEqual(variableFerovValue);
    });

    it('should demutate ferov with currency value', () => {
        const item = {};
        item.rightHandSide = variableFerovValue;
        item.rightHandSideDataType = FLOW_DATA_TYPE.CURRENCY.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.numberValue).toEqual(variableFerovValue);
    });

    it('should demutate ferov with date value', () => {
        const item = {};
        item.rightHandSide = dateFerovValue;
        item.rightHandSideDataType = FLOW_DATA_TYPE.DATE.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.dateValue).toEqual('2008-08-09');
    });

    it('should demutate ferov with dateTime value', () => {
        const item = {};
        item.rightHandSide = dateTimeFerovValue;
        item.rightHandSideDataType = FLOW_DATA_TYPE.DATE_TIME.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.dateTimeValue).toEqual('2018-07-24T16:04:03.000Z');
    });

    it('should demutate ferov with boolean true value', () => {
        const item = {};
        item.rightHandSide = addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_TRUE);
        item.rightHandSideDataType = FLOW_DATA_TYPE.BOOLEAN.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.booleanValue).toBe(true);
    });

    it('should demutate ferov with boolean false value', () => {
        const item = {};
        item.rightHandSide = addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE);
        item.rightHandSideDataType = FLOW_DATA_TYPE.BOOLEAN.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.booleanValue).toBe(false);
    });

    it('should demutate ferov with reference value', () => {
        const item = {};
        item.rightHandSide = elementReference;
        item.rightHandSideDataType = FEROV_DATA_TYPE.REFERENCE;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.elementReference).toEqual(elementReference);
    });

    it('should demutate ferov with reference guid', () => {
        const item = {};
        item.rightHandSide = '{!var1}';
        item.rightHandSideGuid = 'VARIABLE_12';
        item.rightHandSideDataType = FEROV_DATA_TYPE.REFERENCE;

        const expectedItem = { elementReference: 'VARIABLE_12'};
        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov).toEqual(expectedItem);
    });

    it('should demutate ferov with empty / null value', () => {
        const item = {};
        item.rightHandSide = '';
        item.rightHandSideDataType = FEROV_DATA_TYPE.STRING.value;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov).toBeUndefined();
    });
});

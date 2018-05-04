import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { mutateFEROV, deMutateFEROV } from '../ferovEditorDataMutation';
import * as store from 'mock-store-data';
import * as storeUtilMock from 'builder_platform_interaction-store-utils';

const stringFerovValue = 'abc';
const variableFerovValue = 123;
const dateFerovValue = '05-24-1983';
const dateTimeFerovValue = '05-24-1983 12:00';
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

describe('mutateFerov function', () => {
    it('should mutate ferov with string value', () => {
        const item = {};
        item.ferov = { stringValue: stringFerovValue };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(stringFerovValue);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.STRING);
    });

    it('should mutate ferov with number value', () => {
        const item = {};
        item.ferov = { numberValue: variableFerovValue };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(variableFerovValue);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.NUMBER);
    });

    it('should mutate ferov with date value', () => {
        const item = {};
        item.ferov = { dateValue: dateFerovValue };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(dateFerovValue);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.DATE);
    });

    it('should mutate ferov with datetime value', () => {
        const item = {};
        item.ferov = { dateTimeValue: dateTimeFerovValue };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(dateTimeFerovValue);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.DATETIME);
    });

    it('should mutate ferov with boolean value', () => {
        const item = {};
        item.ferov = { booleanValue: true };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toBeTruthy();
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.BOOLEAN);
    });

    it('should mutate ferov with reference value', () => {
        const item = {};
        item.ferov = { elementReference };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual(elementReference);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
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
        expect(mutatedItem.rightHandSide).toBeUndefined();
        expect(mutatedItem.rightHandSideDataType).toBeUndefined();
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
    it('should mutate ferov with reference sobject field', () => {
        const accountSourceSuffix = '.AccountSource';
        const accountVariableElement = store.elements[store.accountSObjectVariableGuid];
        storeUtilMock.getElementByGuid.mockReturnValue(accountVariableElement);
        const item = {};
        item.ferov = { elementReference : store.accountSObjectVariableGuid + accountSourceSuffix };
        const mutatedItem = mutateFEROV(item, 'ferov', expectedParams);
        expect(mutatedItem.rightHandSide).toEqual('{!' + store.elements[store.accountSObjectVariableGuid].name + accountSourceSuffix + '}');
        expect(mutatedItem.rightHandSideGuid).toEqual(store.accountSObjectVariableGuid);
        expect(mutatedItem.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
    });
});

describe('deMutateFerov function', () => {
    it('should demutate ferov with string value', () => {
        const item = {};
        item.rightHandSide = stringFerovValue;
        item.rightHandSideDataType = FEROV_DATA_TYPE.STRING;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.stringValue).toEqual(stringFerovValue);
    });

    it('should demutate ferov with number value', () => {
        const item = {};
        item.rightHandSide = variableFerovValue;
        item.rightHandSideDataType = FEROV_DATA_TYPE.NUMBER;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.numberValue).toEqual(variableFerovValue);
    });

    it('should demutate ferov with date value', () => {
        const item = {};
        item.rightHandSide = dateFerovValue;
        item.rightHandSideDataType = FEROV_DATA_TYPE.DATE;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.dateValue).toEqual(dateFerovValue);
    });

    it('should demutate ferov with dateTime value', () => {
        const item = {};
        item.rightHandSide = dateTimeFerovValue;
        item.rightHandSideDataType = FEROV_DATA_TYPE.DATETIME;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.dateTimeValue).toEqual(dateTimeFerovValue);
    });

    it('should demutate ferov with boolean value', () => {
        const item = {};
        item.rightHandSide = true;
        item.rightHandSideDataType = FEROV_DATA_TYPE.BOOLEAN;

        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov.booleanValue).toBeTruthy();
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
    it('should demutate ferov with reference sobject field', () => {
        const item = {};
        item.rightHandSide = '{!myAccount.name}';
        item.rightHandSideGuid = 'VARIABLE_12';
        item.rightHandSideDataType = FEROV_DATA_TYPE.REFERENCE;

        const expectedItem = { elementReference: 'VARIABLE_12.name'};
        const deMutatedItem = deMutateFEROV(item, 'ferov', expectedParams);
        expect(deMutatedItem.ferov).toEqual(expectedItem);
    });
});

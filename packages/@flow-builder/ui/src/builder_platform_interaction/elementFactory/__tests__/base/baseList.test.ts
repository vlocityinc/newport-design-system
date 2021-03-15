// @ts-nocheck
import { createListRowItem, createParameterListRowItem } from '../../base/baseList';

const listRowItem = {
    leftHandSide: '{!var1}',
    operator: 'equals',
    rightHandSide: 'Hello World',
    rightHandSideDataType: 'string'
};

const parameterListRowItem = {
    rowIndex: 'index',
    name: 'myInput',
    value: 'hello',
    valueDataType: 'String',
    isCollection: true
};

describe('createListRowItem function', () => {
    it('returns a new list row item object when no argument is passed', () => {
        const expectedResult = {
            leftHandSide: '',
            operator: '',
            rightHandSide: '',
            rightHandSideDataType: ''
        };
        const actualResult = createListRowItem();
        expect(actualResult).toMatchObject(expectedResult);
    });

    it('returns a new list row item object when listRowItem is passed as argument', () => {
        const expectedResult = {
            leftHandSide: '{!var1}',
            operator: 'equals',
            rightHandSide: 'Hello World',
            rightHandSideDataType: 'string'
        };
        const actualResult = createListRowItem(listRowItem);
        expect(actualResult).not.toBe(expectedResult);
    });

    it('returns a new list row item object with same values when listRowItem is passed as argument', () => {
        const expectedResult = {
            leftHandSide: '{!var1}',
            operator: 'equals',
            rightHandSide: 'Hello World',
            rightHandSideDataType: 'string'
        };
        const actualResult = createListRowItem(listRowItem);
        expect(actualResult).toMatchObject(expectedResult);
    });
});

describe('createParameterListRowItem function', () => {
    it('returns a new list row item object when no argument is passed', () => {
        const mockGuid = 'abc';
        const storeLib = require('builder_platform_interaction/storeLib');
        storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
        const expectedResult = {
            rowIndex: mockGuid,
            name: '',
            value: '',
            valueDataType: ''
        };

        const actualResult = createParameterListRowItem();
        expect(actualResult).toMatchObject(expectedResult);
    });

    it('returns a new list row item object when listRowItem is passed as argument', () => {
        const expectedResult = {
            rowIndex: 'index',
            name: 'myInput',
            value: 'hello',
            valueDataType: 'String',
            isCollection: true
        };
        const actualResult = createParameterListRowItem(parameterListRowItem);
        expect(actualResult).not.toBe(expectedResult);
    });

    it('returns a new list row item object with same values when listRowItem is passed as argument', () => {
        const expectedResult = {
            rowIndex: 'index',
            name: 'myInput',
            value: 'hello',
            valueDataType: 'String',
            isCollection: true
        };
        const actualResult = createParameterListRowItem(parameterListRowItem);
        expect(actualResult).toMatchObject(expectedResult);
    });
});

// @ts-nocheck
import { setGlobalVariables, getGlobalVariables, resetGlobalVariables, getGlobalVariable } from '../globalVariables';
import { mockGlobalVariablesWithMultiPicklistField } from 'mock/globalVariableData';

describe('global Variables', () => {
    describe('setGlobalVariables', () => {
        afterEach(() => {
            resetGlobalVariables();
        });
        it('sets global variables', () => {
            setGlobalVariables(mockGlobalVariablesWithMultiPicklistField);

            expect(getGlobalVariables('$Organization')).toEqual({
                '$Organization.Country': {
                    apiName: 'Country',
                    dataType: 'String',
                    guid: '$Organization.Country',
                    label: 'Country',
                    name: '$Organization.Country'
                }
            });
        });
    });
    describe('getGlobalVariable', () => {
        afterEach(() => {
            resetGlobalVariables();
        });
        it('gets a global variable', () => {
            setGlobalVariables(mockGlobalVariablesWithMultiPicklistField);

            expect(getGlobalVariable('$Organization.MP__c')).toEqual({
                apiName: 'MP__c',
                dataType: 'Multipicklist',
                guid: '$Organization.MP__c',
                label: 'MP__c',
                name: '$Organization.MP__c'
            });
        });
    });
});

// @ts-nocheck
import { applyDynamicTypeMappings } from '../invocableActionLib';

describe('applyDynamicTypeMappings', () => {
    const params = [
        {
            apiName: 'record1',
            dataType: 'SOBJECT',
            sobjectType: 'T__record1'
        },
        {
            apiName: 'record2',
            dataType: 'SOBJECT',
            sobjectType: 'T__record2'
        },
        {
            apiName: 'output',
            dataType: 'SOBJECT',
            sobjectType: 'T__output'
        }
    ];

    const dynamicTypeMappings = [
        {
            typeName: 'T__record1',
            typeValue: null
        },
        {
            typeName: {
                value: 'T__record2',
                error: null
            },
            typeValue: {
                value: 'Contact',
                error: null
            }
        },
        {
            typeName: {
                value: 'T__output',
                error: null
            },
            typeValue: {
                value: 'CustomObject__c',
                error: null
            }
        }
    ];

    it('assigns concrete types to generically typed parameters, which types are bound', () => {
        const output = applyDynamicTypeMappings(params, dynamicTypeMappings);
        expect(output).toHaveLength(3);
        expect(output[0]).toMatchObject({
            dataType: 'SOBJECT',
            sobjectType: 'T__record1'
        });
        expect(output[1]).toMatchObject({
            dataType: 'SOBJECT',
            sobjectType: 'Contact'
        });
        expect(output[2]).toMatchObject({
            dataType: 'SOBJECT',
            sobjectType: 'CustomObject__c'
        });
    });

    it('returns supplied parameters intact if no dynamic type mappings are supplied', () => {
        expect(applyDynamicTypeMappings(params, undefined)).toBe(params);
        expect(applyDynamicTypeMappings(params, [])).toBe(params);
    });
});

/* eslint-disable @typescript-eslint/no-var-requires */
import accountObjectInfo from 'mock-data/getObjectInfo/getObjectInfo_Account';
import picklistInfo from 'mock-data/getPicklistValues/getPicklistValues_Account_012RO00000055zsYAA_AccountSource';
import { getObjectInfoApi, getPicklistValuesApi, makeWireResponse } from '../fieldInputMenuDataApi';

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity: jest.fn(() => {
            return Promise.resolve(require('mock-data/getObjectInfo/getObjectInfo_Account').default.fields);
        }),
        fetchFieldsForPicklist: jest.fn(() => {
            return Promise.resolve(
                require('mock-data/getPicklistValues/getPicklistValues_Account_012RO00000055zsYAA_AccountSource')
                    .default.values
            );
        })
    };
});

describe('Field Input Menu Data Api Tests', () => {
    it('sanity', async () => {
        expect(true).toBeTruthy();
    });

    describe('apis', () => {
        it('getPicklistValues', async () => {
            const fieldApiName = 'Account.Address';
            const recordTypeId = 'TBD';

            const response = await getPicklistValuesApi({
                recordTypeId,
                fieldApiName
            });
            expect(response).toEqual(makeWireResponse({ values: picklistInfo.values }));
        });

        it('getObjectInfo', async () => {
            const objectApiName = 'Account';

            const result = await getObjectInfoApi({
                objectApiName
            });

            expect(result).toEqual(makeWireResponse({ fields: accountObjectInfo.fields }));
        });
    });
});

import accountObjectInfo from 'mock-data/getObjectInfo/getObjectInfo_Account';
import { getObjectInfoApi, getPicklistValuesApi, makeWireResponse } from '../fieldInputMenuDataApi';

const picklistValues = {};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity: jest.fn(() => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return Promise.resolve(require('mock-data/getObjectInfo/getObjectInfo_Account').default.fields);
        })
    };
});

describe('Field Input Menu Data Api Tests', () => {
    it('sanity', async () => {
        expect(true).toBeTruthy();
    });

    describe('apis', () => {
        it('getPicklistValues', async () => {
            const fieldApiName = 'Account.address';
            const recordTypeId = 'TBD';

            const response = await getPicklistValuesApi({
                recordTypeId,
                fieldApiName
            });

            expect(response).toEqual(makeWireResponse(picklistValues));
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

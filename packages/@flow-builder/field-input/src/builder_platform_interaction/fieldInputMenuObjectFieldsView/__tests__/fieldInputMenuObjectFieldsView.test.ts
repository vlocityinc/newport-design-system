import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { getObjectFieldsViewSections } from '../utils';

const tag = 'builder_platform_interaction-field-input-menu-object-fields-view';

const apiData: GetObjectInfoApiData = {
    fields: [
        {
            label: 'Address',
            apiName: 'address',
            dataType: 'string',
            sobjectName: 'Account'
        },
        {
            label: 'Address2',
            apiName: 'address2',
            dataType: 'string',
            sobjectName: 'Account'
        },
        {
            label: 'BillingGeocodeAccuracy',
            apiName: 'address2',
            dataType: 'Picklist',
            sobjectName: 'Account'
        }
    ]
};

const mockApiResponse = {
    data: apiData
};

jest.mock('builder_platform_interaction/fieldInputMenuSectionItem', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputMenuSectionItem')
);

jest.mock('builder_platform_interaction/fieldInputMenuDataApi', () => {
    return {
        getObjectInfoApi: () => {
            return Promise.resolve(mockApiResponse);
        }
    };
});

jest.mock('../utils', () => {
    return {
        getObjectFieldsViewSections: jest.fn((apiData) =>
            jest.requireActual('../utils').getObjectFieldsViewSections(apiData)
        )
    };
});

const createComponentUnderTest = async (props) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
};

const selectors = {
    ul: 'ul'
};

describe('Field Input Menu Object Fields View Tests', () => {
    let cmp;
    let dom;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({ objectApiName: 'Account' });
        dom = lwcUtils.createDomProxy(cmp, selectors);
    });

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
        expect(getObjectFieldsViewSections).toHaveBeenCalledTimes(1);
        expect(dom.all.ul.length).toEqual(1);
    });

    it('utils > getObjectFieldsViewSections', async () => {
        expect(getObjectFieldsViewSections(mockApiResponse.data)).toMatchSnapshot();
    });
});

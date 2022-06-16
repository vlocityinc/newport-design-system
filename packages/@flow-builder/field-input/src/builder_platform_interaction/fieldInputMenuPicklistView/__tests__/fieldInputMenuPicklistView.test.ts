import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { getPicklistViewSection } from '../utils';

const tag = 'builder_platform_interaction-field-input-menu-picklist-view';

const apiData: GetPicklistValuesApiData = {
    values: [
        {
            label: 'Advertisement',
            value: 'Advertisement'
        },
        {
            label: 'Employee Referral',
            value: 'Employee Referral'
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
        getPicklistValuesApi: () => {
            return Promise.resolve(mockApiResponse);
        }
    };
});

jest.mock('../utils', () => {
    return {
        getPicklistViewSection: jest.fn((apiData) => jest.requireActual('../utils').getPicklistViewSection(apiData))
    };
});

const createComponentUnderTest = async (props) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
};

const selectors = {
    ul: 'ul'
};

describe('Field Input Menu Picklist View Tests', () => {
    let cmp;
    let dom;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({
            info: {
                recordTypeId: '012',
                fieldApiName: 'Account.Advertisement'
            }
        });
        dom = lwcUtils.createDomProxy(cmp, selectors);
    });

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
        expect(getPicklistViewSection).toHaveBeenCalledTimes(1);
        expect(dom.all.ul.length).toEqual(1);
    });

    it('utils > getPicklistViewSection', async () => {
        expect(getPicklistViewSection(mockApiResponse.data)).toMatchSnapshot();
    });
});

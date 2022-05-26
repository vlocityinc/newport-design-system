// @ts-nocheck
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/ruleLib');

    return {
        ...actual,
        getRulesForElementType: jest.fn(() => {
            return [];
        })
    };
});

const tag = 'builder_platform_interaction-field-input-menu-all-view';

const createComponentUnderTest = async (props) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
};

describe('Field Input Menu All View Tests', () => {
    let cmp;

    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
    });

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
    });
});

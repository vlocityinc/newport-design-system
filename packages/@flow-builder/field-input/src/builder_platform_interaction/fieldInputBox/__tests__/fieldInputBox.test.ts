import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';

const tag = 'builder_platform_interaction-field-input-box';

jest.mock('builder_platform_interaction/fieldInputBoxPill', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputBoxPill')
);

jest.mock('lightning/icon', () => jest.requireActual('lightning/icon'));

const createComponentUnderTest = async (props) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
};

const selectors = {
    fieldInput: '.slds-input',
    searchIcon: '.slds-icon'
};

describe('Field Input Box Tests', () => {
    let cmp;
    let dom;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
        dom = lwcUtils.createDomProxy(cmp, selectors);
    });

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
        expect(dom.fieldInput).not.toBeNull();
        expect(dom.searchIcon.iconName).toEqual('utility:search');
    });
});

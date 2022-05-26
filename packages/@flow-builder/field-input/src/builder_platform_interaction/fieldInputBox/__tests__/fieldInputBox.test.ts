// @ts-nocheck
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';

const tag = 'builder_platform_interaction-field-input-box';

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

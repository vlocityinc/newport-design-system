// @ts-nocheck
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';

const tag = 'builder_platform_interaction-field-input-menu-section';

const defaultProps = {
    section: { label: '', items: [] }
};

const createComponentUnderTest = async (props = defaultProps) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
};

describe('Field Input Menu Section Tests', () => {
    let cmp;

    beforeEach(async () => {
        cmp = await createComponentUnderTest();
    });

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
    });
});

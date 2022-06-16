import { createComponent } from 'builder_platform_interaction/builderTestUtils';

const tag = 'builder_platform_interaction-field-input-box-pill';

jest.mock('lightning/icon', () => jest.requireActual('lightning/icon'));

jest.mock('lightning/pill', () => jest.requireActual('lightning/pill'));

const createComponentUnderTest = async (props) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
};

describe('Field Input Box Pill Tests', () => {
    let cmp;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
    });

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
    });
});

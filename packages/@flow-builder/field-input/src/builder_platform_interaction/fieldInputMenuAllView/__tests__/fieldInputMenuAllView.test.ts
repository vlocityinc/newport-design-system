import { createComponent } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldInputMenuSectionItem', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputMenuSectionItem')
);

jest.mock('builder_platform_interaction/fieldInputUtils');

const tag = 'builder_platform_interaction-field-input-menu-all-view';

const config: FieldInput.MenuConfig = {
    sortField: 'label',
    activePicklistValues: [],
    traversalConfig: { isEnabled: true },
    filter: {
        includeNewResource: true,
        allowGlobalConstants: true,
        showSystemVariables: true,
        showGlobalVariables: true,
        shouldBeWritable: false
    }
} as const;

const defaultProps = { config };
const createComponentUnderTest = async (overrideProps) => {
    return createComponent(tag, defaultProps, overrideProps);
};

describe('Field Input Menu All View Tests', () => {
    let cmp;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
    });

    it('sanity', async () => {
        expect(cmp).toBeTruthy();
    });
});

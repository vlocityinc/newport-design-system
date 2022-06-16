import { createComponent, updateComponent } from 'builder_platform_interaction/builderTestUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { MOCK_BREADCRUMBS } from 'mock-data/fieldInputBreadcrumbData';
import { LABELS } from '../fieldInputMenuHeaderLabels';

jest.mock('builder_platform_interaction/sharedUtils', () =>
    jest.requireActual('builder_platform_interaction_mocks/sharedUtils')
);

jest.mock('builder_platform_interaction/fieldInputBreadcrumbs', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputBreadcrumbs')
);

const tag = 'builder_platform_interaction-field-input-menu-header';

const defaultProps = {
    mode: 'allResources'
};

const createComponentUnderTest = async (overrideProps = {}) => {
    return createComponent(tag, defaultProps, overrideProps);
};

function assertTextAndBreadcrumb(dom, { text, hasBreadcrumb }) {
    const breadcrumbs = dom.breadcrumbs;
    if (hasBreadcrumb) {
        expect(breadcrumbs).not.toBeNull();
    } else {
        expect(breadcrumbs).toBeNull();
    }

    if (text != null) {
        expect(dom.text.textContent).toEqual(text);
    } else {
        expect(dom.text).toBeNull();
    }
}

const selectors = {
    text: '.text',
    breadcrumbs: 'builder_platform_interaction-field-input-breadcrumbs'
};

async function updateComponentMode(cmp, mode) {
    let breadcrumbs;
    let info;

    switch (mode) {
        case 'traversal':
            breadcrumbs = MOCK_BREADCRUMBS;
            break;
        case 'resource':
            info = {
                label: 'Date/Time',
                name: 'Date/Time'
            };
            break;
        case 'entityFields':
            info = {
                label: 'Account',
                name: 'Account'
            };
            break;
        default:
    }

    return updateComponent(cmp, { mode, breadcrumbs, info });
}
describe('Field Input Menu Header Tests', () => {
    let cmp;
    let dom;

    beforeEach(async () => {
        cmp = await createComponentUnderTest();
        dom = lwcUtils.createDomProxy(cmp, selectors);
    });

    it('sanity', () => {
        expect(cmp).toBeTruthy();
        assertTextAndBreadcrumb(dom, { text: LABELS.allResources, hasBreadcrumb: false });
    });

    describe('having mode ', () => {
        it.each`
            mode              | expectText                                         | expectHasBreadcrumb
            ${'allResources'} | ${LABELS.allResources}                             | ${false}
            ${'traversal'}    | ${null}                                            | ${true}
            ${'resource'}     | ${'FlowBuilderFieldInput.resourceType(Date/Time)'} | ${false}
            ${'entityFields'} | ${'FlowBuilderFieldInput.entityFields(Account)'}   | ${false}
        `('$mode', async (params) => {
            const { mode, expectText, expectHasBreadcrumb } = params;
            await updateComponentMode(cmp, mode);
            assertTextAndBreadcrumb(dom, { text: expectText, hasBreadcrumb: expectHasBreadcrumb });
        });
    });
});

// @ts-nocheck
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { createComponent, updateComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { MOCK_BREADCRUMBS } from 'mock/fieldInputBreadcrumbData';
import { LABELS } from '../fieldInputMenuHeaderLabels';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const tag = 'builder_platform_interaction-field-input-menu-header';

const defaultProps = {
    mode: 'allResources'
};

const createComponentUnderTest = async (overrideProps) => {
    return createComponent(tag, defaultProps, overrideProps);
};

function assertTextAndBreadcrumb(dom, { text, hasBreadcrumb }) {
    if (hasBreadcrumb) {
        expect(dom.breadcrumb).not.toBeNull();
    } else {
        expect(dom.breadcrumb).toBeNull();
    }

    if (text != null) {
        expect(dom.text.textContent).toEqual(text);
    } else {
        expect(dom.text).toBeNull();
    }
}

const selectors = {
    text: '.text',
    breadcrumb: INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_BREADCRUMBS
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

// @ts-nocheck
import { setup } from '@sa11y/jest';
import { createComponent } from 'builder_platform_interaction/builderTestUtils';

const createComponentUnderTest = async () => {
    return createComponent('builder_platform_interaction-onboarding-manager-service');
};

describe('onboardingManagerService', () => {
    beforeAll(() => {
        setup();
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    test('renders', async () => {
        const cmp = await createComponentUnderTest();
        expect(cmp).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const cmp = await createComponentUnderTest();
        expect(cmp).toBeAccessible();
    });

    describe('implements required APIs', () => {
        it('getAppContainerId set', async () => {
            const service = await createComponentUnderTest();
            expect(service.getAppContainerId()).toBe('flowbuilder');
        });

        it('getPromptRegistrations set', async () => {
            const service = await createComponentUnderTest();
            expect(service.getPromptRegistrations()).toBeDefined();
        });
    });
});

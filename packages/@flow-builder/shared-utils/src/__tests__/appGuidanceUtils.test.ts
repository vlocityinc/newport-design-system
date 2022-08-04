// @ts-nocheck
import * as onboardingManagerLib from 'force/onboardingManagerLib';
import {
    getRegistrations,
    getRetiredPromptRegistrations,
    Prompts,
    showPrompt
} from '../appGuidanceUtils/appGuidanceUtils';

const showPrompt2Spy = jest.spyOn(onboardingManagerLib, 'showPrompt2');

describe('appGuidanceUtils', () => {
    afterEach(() => {
        showPrompt2Spy.mockClear();
    });

    describe('showPrompt', () => {
        it(`Shows ${Prompts.LeftPanelTogglePopover} prompt when showPrompt is called`, async () => {
            await showPrompt(Prompts.LeftPanelTogglePopover, 1);
            await Promise.resolve();
            expect(showPrompt2Spy).toHaveBeenCalledWith(Prompts.LeftPanelTogglePopover, expect.anything());
        });
    });

    describe('registrations', () => {
        it('getRegistrations does not include retired prompts', async () => {
            const registrations = getRegistrations();
            const retiredRegistrations = getRetiredPromptRegistrations();
            expect(registrations).toBeDefined();
            expect(retiredRegistrations).toBeDefined();
            registrations.forEach((registration) => {
                expect(retiredRegistrations.find((retired) => registration.id === retired.id)).toBeFalsy();
            });
        });
    });
});

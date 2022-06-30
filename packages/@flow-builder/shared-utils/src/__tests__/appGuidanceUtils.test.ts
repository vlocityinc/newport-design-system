// @ts-nocheck
import * as onboardingManagerLib from 'force/onboardingManagerLib';
import { Prompts, showPrompt } from '../appGuidanceUtils/appGuidanceUtils';

const showPrompt2Spy = jest.spyOn(onboardingManagerLib, 'showPrompt2');

describe('appGuidanceUtils', () => {
    afterEach(() => {
        showPrompt2Spy.mockClear();
    });

    describe('Prompts.LeftPanelTogglePopover', () => {
        it(`Shows ${Prompts.LeftPanelTogglePopover} prompt when X happens`, async () => {
            await showPrompt(Prompts.LeftPanelTogglePopover, 1);
            await Promise.resolve();
            expect(showPrompt2Spy).toHaveBeenCalledWith(Prompts.LeftPanelTogglePopover, expect.anything());
        });
    });
});

// @ts-nocheck
import * as onboardingManagerLib from 'force/onboardingManagerLib';
import { Prompts, showPrompt } from '../appGuidanceUtils';

const showPrompt2Spy = jest.spyOn(onboardingManagerLib, 'showPrompt2');

describe('appGuidanceUtils', () => {
    afterEach(() => {
        showPrompt2Spy.mockClear();
    });

    describe('Prompts.Exmaple', () => {
        it(`Shows ${Prompts.Example} prompt when X happens`, async () => {
            await showPrompt(Prompts.Example, 1);
            await Promise.resolve();
            expect(showPrompt2Spy).toHaveBeenCalledWith(Prompts.Example, expect.anything());
        });
    });
});

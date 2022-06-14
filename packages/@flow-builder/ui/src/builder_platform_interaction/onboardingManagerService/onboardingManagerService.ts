import { appGuidanceUtils } from 'builder_platform_interaction/sharedUtils';
import type { PromptRegistration } from 'force/onboardingManagerLib';
import { api, LightningElement } from 'lwc';
const { getRegistrations } = appGuidanceUtils;

const appContainerId = 'flowbuilder';

export default class OnboardingManagerService extends LightningElement {
    /**
     * Returns the identifier of this app container; must be a value from java enum ui.global.api.onboarding.Application.
     *
     * @returns app container identifier
     */
    @api
    getAppContainerId(): string {
        return appContainerId;
    }

    /**
     * Returns all programmatic prompts to be made available to the in-app guidance system.
     * Elements must be instances of the `PromptRegistration` class from `force/onboardingManagerLib`.
     *
     * @returns the programmatic prompts to be registered
     */
    @api
    getPromptRegistrations(): typeof PromptRegistration[] {
        return getRegistrations();
    }
}

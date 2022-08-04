import { PromptRegistration, showPrompt2, SingleUsePopover } from 'force/onboardingManagerLib';
import { LABELS } from './appGuidanceUtilsLabels';

export enum Prompts {
    LeftPanelTogglePopover = 'LeftPanelTogglePopover'
}

const featureKey = 'FlowBuilder';

class LeftPanelTogglePopover extends SingleUsePopover {
    constructor(id) {
        super(id, featureKey, Prompts.LeftPanelTogglePopover, {
            popoverText: LABELS.leftPanelTogglePopoverText,
            header: LABELS.leftPanelTogglePopoverHeader,
            nubinDirection: 'south',
            icon: null,
            closeOnClickOut: false,
            autoFocus: true
        });
    }
}

/**
 * @param promptId String name of the prompt class
 * @param referenceElement DOM element anchor to display prompt on
 */
export async function showPrompt(promptId: string, referenceElement: Element) {
    if (!referenceElement || !promptId) {
        return;
    }

    showPrompt2(promptId, {
        componentDefAttributes: {
            referenceElement
        }
    });
}

/**
 * Returns all programmatic prompts to be made available to the in-app guidance system.
 * Elements must be instances of the `PromptRegistration` class from `force/onboardingManagerLib`.
 *
 * @returns the programmatic prompts to be registered
 */
export function getRegistrations(): typeof PromptRegistration[] {
    return [];
}

/**
 * Returns all programmatic prompts that are no longer in use and should not be displayed to customers.
 * This may no longer be necessary when other prompts are introduced, but some tests rely on at least
 * one prompt class existing.
 *
 * @returns retired programmatic prompts
 */
export function getRetiredPromptRegistrations(): typeof PromptRegistration[] {
    return [
        new PromptRegistration(Prompts.LeftPanelTogglePopover, LeftPanelTogglePopover) // Retired in 242
    ];
}

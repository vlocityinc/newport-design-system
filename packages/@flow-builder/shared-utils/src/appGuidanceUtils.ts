import { PromptRegistration, showPrompt2, SingleUsePopover } from 'force/onboardingManagerLib';

const featureKey = 'FlowBuilder';

export const enum Prompts {
    Example = 'Example'
}

class Example extends SingleUsePopover {
    constructor(id) {
        super(id, featureKey, Prompts.Example, {
            popoverText: 'Example Text Label',
            header: 'Example Header Label',
            engagementDetectable: true,
            nubinDirection: 'south',
            icon: 'utility:prompt'
        });
    }
}

/**
 * @param promptId String name of the prompt class from prompts.ts
 * @param referenceElement DOM element anchor to display prompt on
 */
export async function showPrompt(promptId: string, referenceElement: Element) {
    if (!referenceElement || !promptId) {
        return;
    }

    switch (promptId) {
        case Prompts.Example: {
            showPrompt2(promptId, {
                componentDefAttributes: {
                    referenceElement
                }
            });
            break;
        }
        default:
    }
}

/**
 * Returns all programmatic prompts to be made available to the in-app guidance system.
 * Elements must be instances of the `PromptRegistration` class from `force/onboardingManagerLib`.
 *
 * @returns the programmatic prompts to be registered
 */
export function getRegistrations(): typeof PromptRegistration[] {
    return [new PromptRegistration(Prompts.Example, Example)];
}

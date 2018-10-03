import { createElement } from 'lwc';
import StepEditor from "../stepEditor";
import { getShadowRoot } from 'lwc-test-utils';

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-step-editor', { is: StepEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    BADGE_ICON: '.test-badge-icon',
    SECTION_HEADER: '.test-section-description'
};

const getLabelDescription = (stepEditor) => {
    return getShadowRoot(stepEditor).querySelector(selectors.LABEL_DESCRIPTION);
};

const getBadgeIcon = (stepEditor) => {
    return getShadowRoot(stepEditor).querySelector(selectors.BADGE_ICON);
};

const getSectionHeader = (stepEditor) => {
    return getShadowRoot(stepEditor).querySelector(selectors.SECTION_HEADER);
};

describe('Step-Editor', () => {
    let stepElement;

    describe('Edit an Existing Step', () => {
        let stepEditor;
        beforeEach(() => {
            stepElement = {
                "name": "myStepName",
                "label": "myStepLabel",
                "description": "myDescription",
                "processMetadataValues": [],
                "elementType": "STEP",
                "guid": "STEP_11",
                "isCanvasElement": true,
            };
            stepEditor = createComponentUnderTest(stepElement);
        });
        it('Label Description Component', () => {
            const labelDescription = getLabelDescription(stepEditor);
            expect(labelDescription).toBeDefined();
            expect(labelDescription.label).toBe(stepElement.label);
            expect(labelDescription.devName).toBe(stepElement.name);
            expect(labelDescription.description).toBe(stepElement.description);
        });
        it('Badge Icon Element Classes', () => {
            const badgeIcon = getBadgeIcon(stepEditor);
            expect(badgeIcon).toBeDefined();
            expect(badgeIcon.classList).toContain('slds-badge');
            expect(badgeIcon.classList).toContain('slds-text-title_caps');
            expect(badgeIcon.classList).toContain('slds-theme--warning');
        });
        it('Section Header Element Classes', () => {
            const sectionHeader = getSectionHeader(stepEditor);
            expect(sectionHeader).toBeDefined();
            expect(sectionHeader.classList).toContain('slds-text-color_weak');
            expect(sectionHeader.classList).toContain('slds-text-body_small');
            expect(sectionHeader.classList).toContain('slds-truncate');
        });
    });
});

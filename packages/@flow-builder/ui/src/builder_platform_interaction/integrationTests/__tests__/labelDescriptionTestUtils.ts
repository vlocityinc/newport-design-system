import { focusoutEvent, INTERACTION_COMPONENTS_SELECTORS, ticks } from 'builder_platform_interaction/builderTestUtils';
import LabelDescription from 'builder_platform_interaction/labelDescription';
import { TestComponent } from './testComponent';

const LABEL_DESCRIPTION_SELECTORS = {
    DEV_NAME: '.devName',
    LABEL: '.label'
};

export const getLabelDescriptionElement = (editor) => {
    return editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LABEL_DESCRIPTION);
};

export class LabelDescriptionComponentTest extends TestComponent<LabelDescription> {
    public getNameElement() {
        return this.element.shadowRoot!.querySelector(LABEL_DESCRIPTION_SELECTORS.DEV_NAME);
    }
    public getLabelElement() {
        return this.element.shadowRoot!.querySelector(LABEL_DESCRIPTION_SELECTORS.LABEL);
    }
    public async setName(value) {
        const nameElement = this.getNameElement();
        if (nameElement) {
            (nameElement as any).value = value;
            nameElement.dispatchEvent(focusoutEvent);
            await ticks(1);
        }
    }
    public async setLabel(value) {
        const labelElement = this.getLabelElement();
        if (labelElement) {
            (labelElement as any).value = value;
            labelElement.dispatchEvent(focusoutEvent);
            await ticks(1);
        }
    }
}

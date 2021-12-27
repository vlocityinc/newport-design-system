import { generateGuid } from 'builder_platform_interaction/storeLib';
import { api, LightningElement } from 'lwc';

export default class TestPanelBody extends LightningElement {
    @api testAssertionTrace;

    get textObj() {
        const textObject: any[] = [];
        if (this.testAssertionTrace) {
            for (const key of Object.keys(this.testAssertionTrace)) {
                const testAssertion = this.testAssertionTrace[key];
                const id = generateGuid();
                const subtitle = testAssertion.lines[0];
                const value = testAssertion.lines.filter((_, index) => index > 0).join(' ');
                const outcome = { id, subtitle, value };
                textObject.push(outcome);
            }
        }
        return textObject;
    }
}

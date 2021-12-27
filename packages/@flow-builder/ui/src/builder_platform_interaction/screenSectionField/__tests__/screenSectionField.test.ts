// @ts-nocheck
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import ScreenSectionField from 'builder_platform_interaction/screenSectionField';
import { createElement } from 'lwc';
const SELECTORS = {
    SCREEN_CANVAS: 'builder_platform_interaction-screen-canvas'
};

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-section-field', { is: ScreenSectionField });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

describe('Section with two columns', () => {
    let sectionCmp;
    beforeEach(() => {
        sectionCmp = createComponentForTest({
            section: {
                fields: [
                    {
                        name: { value: 'column1', error: null },
                        guid: 'column1',
                        fields: [],
                        inputParameters: [{ value: 7 }]
                    },
                    {
                        name: { value: 'column2', error: null },
                        guid: 'column2',
                        fields: [],
                        inputParameters: [{ value: 5 }]
                    }
                ]
            }
        });
    });
    it('should have two screen canvas children', async () => {
        await ticks(1);
        const columns = sectionCmp.shadowRoot.querySelectorAll(SELECTORS.SCREEN_CANVAS);
        expect(columns).toHaveLength(2);
        expect(columns[0].className).toContain('slds-size_7-of-12');
        expect(columns[1].className).toContain('slds-size_5-of-12');
    });
});

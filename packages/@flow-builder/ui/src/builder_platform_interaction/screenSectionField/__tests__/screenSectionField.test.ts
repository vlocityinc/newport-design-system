// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import ScreenSectionField from 'builder_platform_interaction/screenSectionField';
import { createElement } from 'lwc';
const SELECTORS = {
    SCREEN_CANVAS: 'builder_platform_interaction-screen-canvas',
    HEADING: 'span.slds-text-heading_small'
};
const SECTION_HEADER = 'Section Header';

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
                ],
                hasHeading: true,
                fieldText: { value: SECTION_HEADER, error: null }
            }
        });
    });
    it('should have two screen canvas children', () => {
        const columns = sectionCmp.shadowRoot.querySelectorAll(SELECTORS.SCREEN_CANVAS);
        expect(columns).toHaveLength(2);
        expect(columns[0].className).toContain('slds-size_7-of-12');
        expect(columns[1].className).toContain('slds-size_5-of-12');
    });
    it('should have heading when hasHeading is true and display section heading', () => {
        const header = sectionCmp.shadowRoot.querySelector(SELECTORS.HEADING);
        expect(header.textContent).toBe(SECTION_HEADER);
    });
    it('should not have heading when hasHeading is false', () => {
        const sectionCmpHeadingFalse = createComponentForTest({
            section: {
                fields: [
                    {
                        name: { value: 'column1', error: null },
                        guid: 'column1',
                        fields: [],
                        inputParameters: [{ value: 7 }]
                    }
                ],
                hasHeading: false,
                fieldText: { value: SECTION_HEADER }
            }
        });
        const header = sectionCmpHeadingFalse.shadowRoot.querySelector(SELECTORS.HEADING);
        expect(header).toBeNull();
    });
});

// @ts-nocheck
import PaletteItem from 'builder_platform_interaction/paletteItem';
import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const GUID = 'myGuid';
const LABEL = 'myLabel';
const ICON_SIZE = 'myIconSize';

const DEFAULT_OPTIONS = {
    guid: GUID,
    label: LABEL,
    iconSize: ICON_SIZE,
    elementType: ELEMENT_TYPE.SCREEN
};

const createComponentUnderTest = async (options) => {
    options = { ...DEFAULT_OPTIONS, ...(options || {}) };
    return createComponent('builder_platform_interaction-palette-item', PaletteItem, options);
};

const selectors = {
    elementIcon: 'builder_platform_interaction-element-icon',
    nonChildElementType: 'a',
    childElementType: 'span'
};

describe('PaletteItem', () => {
    describe('label', () => {
        it('renders a link when elementType is not a childElementType', async () => {
            const paletteItem = await createComponentUnderTest();
            let elementIcon = paletteItem.shadowRoot.querySelector(selectors.nonChildElementType);
            expect(elementIcon).toBeTruthy();
            elementIcon = paletteItem.shadowRoot.querySelector(selectors.childElementType);
            expect(elementIcon).toBeFalsy();
        });

        it('renders text when elementType is a childElementType', async () => {
            const paletteItem = await createComponentUnderTest({ elementType: ELEMENT_TYPE.OUTCOME });
            let elementIcon = paletteItem.shadowRoot.querySelector(selectors.nonChildElementType);
            expect(elementIcon).toBeFalsy();
            elementIcon = paletteItem.shadowRoot.querySelector(selectors.childElementType);
            expect(elementIcon).toBeTruthy();
        });
    });

    describe('elementIcon', () => {
        it('does not render elementIcon when the iconName is undefined', async () => {
            const paletteItem = await createComponentUnderTest({ iconName: undefined });
            const elementIcon = paletteItem.shadowRoot.querySelector(selectors.elementIcon);
            expect(elementIcon).toBeNull();
        });

        it('does not render elementIcon when the iconName is null', async () => {
            const paletteItem = await createComponentUnderTest({ iconName: null });
            const elementIcon = paletteItem.shadowRoot.querySelector(selectors.elementIcon);
            expect(elementIcon).toBeNull();
        });

        it('does not render elementIcon when the iconName is empty', async () => {
            const paletteItem = await createComponentUnderTest({ iconName: '' });
            const elementIcon = paletteItem.shadowRoot.querySelector(selectors.elementIcon);
            expect(elementIcon).toBeNull();
        });

        it('renders elementIcon when the iconName is non-empty', async () => {
            const paletteItem = await createComponentUnderTest({ iconName: 'iconName' });
            const elementIcon = paletteItem.shadowRoot.querySelector(selectors.elementIcon);
            expect(elementIcon).not.toBeNull();
        });
    });

    describe('dragImage', () => {
        it('returns undefined when dragImageSrc is undefined', async () => {
            const paletteItem = await createComponentUnderTest({ dragImageSrc: undefined });
            expect(paletteItem.dragImage).toBeUndefined();
        });

        it('returns undefined when dragImageSrc is null', async () => {
            const paletteItem = await createComponentUnderTest({ dragImageSrc: null });
            expect(paletteItem.dragImage).toBeUndefined();
        });

        it('returns undefined when dragImageSrc is empty', async () => {
            const paletteItem = await createComponentUnderTest({ dragImageSrc: '' });
            expect(paletteItem.dragImage).toBeUndefined();
        });

        it('returns an img element when dragImageSrc is non-empty', async () => {
            const dragImageSrc = '/flow/icons/large/assignment.png';
            const expected = expect.stringMatching(new RegExp(dragImageSrc + '$'));
            const paletteItem = await createComponentUnderTest({ dragImageSrc });
            const dragImage = paletteItem.dragImage;
            expect(dragImage).not.toBeUndefined();
            expect(dragImage.tagName).toEqual('IMG');
            expect(dragImage.src).toEqual(expected);
        });
    });
});

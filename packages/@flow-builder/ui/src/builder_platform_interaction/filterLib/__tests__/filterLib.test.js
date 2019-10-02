import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { labelFilter, resourceFilter, canvasElementFilter } from '../filterLib';
import { isAutomaticOutputElementWithoutChildren } from 'builder_platform_interaction/complexTypeLib';

jest.mock('builder_platform_interaction/complexTypeLib', () => {
    return {
        isAutomaticOutputElementWithoutChildren: jest
            .fn()
            .mockReturnValue(false)
    };
});

describe('labelFilter', () => {
    const element = { label: 'Alvin' };

    it('always includes objects when no pattern is provided', () => {
        const filter = labelFilter();
        expect(filter(element)).toEqual(true);
    });

    it('includes objects that contain the given pattern in their label', () => {
        const filter = labelFilter('v');
        expect(filter(element)).toEqual(true);
    });

    it('excludes objects that do not contain the given pattern in their label', () => {
        const filter = labelFilter('b');
        expect(filter(element)).toEqual(false);
    });
});

describe('canvasElementFilter', () => {
    it('excludes start elements', () => {
        const filter = canvasElementFilter();
        const element = {
            elementType: ELEMENT_TYPE.START_ELEMENT,
            isCanvasElement: true
        };
        expect(filter(element)).toEqual(false);
    });
    it('includes canvas elements', () => {
        const filter = canvasElementFilter();
        const element = {
            elementType: 'myElementType',
            isCanvasElement: true
        };
        expect(filter(element)).toEqual(true);
    });

    it('includes elements that contain the given pattern in their name', () => {
        const filter = canvasElementFilter('v');
        const element = {
            elementType: 'myElementType',
            isCanvasElement: true,
            name: 'Alvin'
        };
        expect(filter(element)).toEqual(true);
    });

    it('excludes elements that do not contain the given pattern in their label', () => {
        const filter = canvasElementFilter('b');
        const element = {
            elementType: 'myElementType',
            isCanvasElement: true,
            name: 'Alvin'
        };
        expect(filter(element)).toEqual(false);
    });
});

describe('resourceFilter', () => {
    it('excludes start elements', () => {
        const filter = resourceFilter();
        const element = {
            elementType: ELEMENT_TYPE.START_ELEMENT,
            isCanvasElement: true
        };
        expect(filter(element)).toEqual(false);
    });

    it('excludes canvas elements', () => {
        const filter = resourceFilter();
        const element = {
            elementType: 'myElementType',
            isCanvasElement: true
        };
        expect(filter(element)).toEqual(false);
    });

    it('includes elements in automatic output handling mode', () => {
        const filter = resourceFilter();
        const element = {
            elementType: 'myElementType',
            isCanvasElement: true,
            storeOutputAutomatically: true
        };
        expect(filter(element)).toEqual(true);
    });

    it('excludes elements in automatic output handling mode without children', () => {
        const filter = resourceFilter();
        isAutomaticOutputElementWithoutChildren.mockReturnValue(true);
        const element = {
            elementType: 'myElementType',
            isCanvasElement: true,
            storeOutputAutomatically: true
        };
        expect(filter(element)).toEqual(false);
    });

    it('includes elements that contain the given pattern in their name', () => {
        const filter = resourceFilter('v');
        const element = {
            elementType: 'myElementType',
            isCanvasElement: false,
            name: 'Alvin'
        };
        expect(filter(element)).toEqual(true);
    });

    it('excludes elements that do not contain the given pattern in their label', () => {
        const filter = resourceFilter('b');
        const element = {
            elementType: 'myElementType',
            isCanvasElement: false,
            name: 'Alvin'
        };
        expect(filter(element)).toEqual(false);
    });
});

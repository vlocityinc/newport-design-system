import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { labelFilter, resourceFilter } from '../filter-lib';

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

describe('resourceFilter', () => {
    it('excludes start elements', () => {
        const filter = resourceFilter(true);
        const element = {
            elementType: ELEMENT_TYPE.START_ELEMENT,
            isCanvasElement: true
        };
        expect(filter(element)).toEqual(false);
    });

    it('includes canvas elements when requested', () => {
        const filter = resourceFilter(true);
        const element = {
            elementType: 'myElementType',
            isCanvasElement: true
        };
        expect(filter(element)).toEqual(true);
    });

    it('excludes canvas elements when not requested', () => {
        const filter = resourceFilter(false);
        const element = {
            elementType: 'myElementType',
            isCanvasElement: true
        };
        expect(filter(element)).toEqual(false);
    });

    it('includes elements that contain the given pattern in their name', () => {
        const filter = resourceFilter(false, 'v');
        const element = {
            elementType: 'myElementType',
            isCanvasElement: false,
            name: 'Alvin'
        };
        expect(filter(element)).toEqual(true);
    });

    it('excludes elements that do not contain the given pattern in their label', () => {
        const filter = resourceFilter(false, 'b');
        const element = {
            elementType: 'myElementType',
            isCanvasElement: false,
            name: 'Alvin'
        };
        expect(filter(element)).toEqual(false);
    });
});
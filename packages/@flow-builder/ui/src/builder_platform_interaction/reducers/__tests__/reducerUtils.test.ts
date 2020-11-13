import { getSubElementGuids } from '../reducersUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

describe('getSubElementGuids', () => {
    const elements = {
        assignment: {
            guid: 'assignment',
            elementType: ELEMENT_TYPE.ASSIGNMENT
        },
        decision: {
            guid: 'decision',
            elementType: ELEMENT_TYPE.DECISION,
            childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }]
        },
        o1: { guid: 'o1' },
        o2: { guid: 'o2' },
        screen: {
            guid: 'screen',
            elementType: ELEMENT_TYPE.SCREEN,
            childReferences: [{ childReference: 'sf1' }, { childReference: 'sf2' }]
        },
        sf1: {
            guid: 'sf1',
            elementType: ELEMENT_TYPE.SCREEN_FIELD
        },
        sf2: {
            guid: 'sf2',
            elementType: ELEMENT_TYPE.SCREEN_FIELD,
            childReferences: [{ childReference: 'sf3' }]
        },
        sf3: {
            guid: 'sf3',
            elementType: ELEMENT_TYPE.SCREEN_FIELD
        }
    };

    it('no child references returns []', () => {
        const childGuids = getSubElementGuids(elements.assignment, elements);
        expect(childGuids).toEqual([]);
    });

    it('screens return all screen field children recursively', () => {
        const childGuids = getSubElementGuids(elements.screen, elements);
        expect(childGuids).toHaveLength(3);
        expect(childGuids).toEqual(expect.arrayContaining(['sf1', 'sf2', 'sf3']));
    });

    it('element with childReferences returns all children', () => {
        const childGuids = getSubElementGuids(elements.decision, elements);
        expect(childGuids).toHaveLength(2);
        expect(childGuids).toEqual(expect.arrayContaining(['o1', 'o2']));
    });
});

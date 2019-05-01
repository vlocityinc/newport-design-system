import { isElementOverlapWithBox } from '../marqueeSelectionLib';

const boxStartPoint = [20, 20];
const boxEndPoint = [30, 30];

describe('check if marquee selection box overlaps with element', () => {
    describe('selection box not overlaps with elements', () => {
        it('should return false if element is left outside of box', () => {
            const nodeStartPoint = [5, 20];
            const nodeEndPoint = [15, 25];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeFalsy();
        });

        it('should return false if element is top outside of box', () => {
            const nodeStartPoint = [20, 5];
            const nodeEndPoint = [25, 15];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeFalsy();
        });

        it('should return false if element is right outside of box', () => {
            const nodeStartPoint = [40, 25];
            const nodeEndPoint = [45, 30];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeFalsy();
        });

        it('should return false if element is bottom outside of box', () => {
            const nodeStartPoint = [20, 40];
            const nodeEndPoint = [25, 45];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeFalsy();
        });
    });

    describe('selection box overlaps with elements', () => {
        it('should return true if element is partly overlapped from left', () => {
            const nodeStartPoint = [5, 20];
            const nodeEndPoint = [25, 25];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeTruthy();
        });

        it('should return true if element is partly overlapped from top', () => {
            const nodeStartPoint = [20, 5];
            const nodeEndPoint = [25, 25];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeTruthy();
        });

        it('should return true if element is partly overlapped from right', () => {
            const nodeStartPoint = [25, 25];
            const nodeEndPoint = [40, 30];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeTruthy();
        });

        it('should return true if element is partly overlapped from bottom', () => {
            const nodeStartPoint = [25, 25];
            const nodeEndPoint = [28, 35];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeTruthy();
        });

        it('should return true if element is completely in the box', () => {
            const nodeStartPoint = [25, 25];
            const nodeEndPoint = [28, 28];
            expect(isElementOverlapWithBox(nodeStartPoint, nodeEndPoint, boxStartPoint, boxEndPoint)).toBeTruthy();
        });
    });
});
import { createElement } from 'lwc';
import ElementIcon from 'builder_platform_interaction/elementIcon';

const ICON_NAMES = {
    subflow: 'standard:flow',
    decision: 'standard:decision'
};

const CLASS_NAMES = {
    drag: 'drag-element',
    rotateContainer: 'rotate-icon-container',
    rotateDecision: 'non-canvas-decision-icon',
    rotateSvg: 'rotate-icon-svg'
};

const SELECTORS = {
    div: 'div',
    lightningIcon: 'lightning-icon'
};

function getContainer(elementIcon) {
    return elementIcon.shadowRoot.querySelector(SELECTORS.div);
}

function getLightningIcon(elementIcon) {
    return elementIcon.shadowRoot.querySelector(SELECTORS.lightningIcon);
}

const createComponentForTest = ({
    iconName,
    isDraggable,
    backgroundColor
} = {}) => {
    const el = createElement('builder_platform_interaction-element-icon', {
        is: ElementIcon
    });
    Object.assign(el, { iconName, isDraggable, backgroundColor });
    document.body.appendChild(el);
    return el;
};

describe('Element Icon', () => {
    describe('Specific css injected in lighting icon', () => {
        it('Should add the css class to rotate the container of decision elements', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.decision
            });
            const container = getContainer(elementIcon);
            expect(container.classList).toContain(CLASS_NAMES.rotateContainer);
            expect(container.classList).toContain(CLASS_NAMES.rotateDecision);
        });
        it('Should not add the css class to rotate the container when element is not a decision', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.subflow
            });
            const container = getContainer(elementIcon);
            expect(container.classList).not.toContain(
                CLASS_NAMES.rotateContainer
            );
            expect(container.classList).not.toContain(
                CLASS_NAMES.rotateDecision
            );
        });
        it('Should add the css class to rotate the decision element icon', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.decision
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).toContain(CLASS_NAMES.rotateSvg);
        });
        it('Should not add the css class to rotate the element icon when element is not a decision', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.subflow
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).not.toContain(
                CLASS_NAMES.rotateSvg
            );
        });
        it('Should add the css class to set the background color when backgroundColor is non-empty', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.subflow,
                backgroundColor: 'background-navy'
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).toContain('background-navy');
        });
        it('Should not add the css class to set the background color when backgroundColor is empty', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.subflow,
                backgroundColor: undefined
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).not.toContain(
                'background-undefined'
            );
        });
        it('Should add the drag css class when isDraggable is true', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.subflow,
                isDraggable: true
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).toContain(CLASS_NAMES.drag);
        });
        it('Should not add the drag css class when isDraggable is not true', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.subflow,
                isDraggable: false
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).not.toContain(CLASS_NAMES.drag);
        });
    });
});

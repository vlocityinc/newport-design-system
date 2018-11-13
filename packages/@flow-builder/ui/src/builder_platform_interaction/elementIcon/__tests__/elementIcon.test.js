import {createElement} from 'lwc';
import ElementIcon from "builder_platform_interaction/elementIcon";
import { getShadowRoot } from 'lwc-test-utils';

const ICON_NAMES =  {
    subflow: 'standard:flow',
    email: 'standard:email',
    coreActions : 'standard:custom_notification',
    decision : 'standard:decision'
};

const CLASS_NAMES =  {
    actions: 'action-icon',
};

const SELECTORS = {
    lightningIcon: 'lightning-icon'
};

function getLightningIcon(elementIcon) {
    return getShadowRoot(elementIcon).querySelector(SELECTORS.lightningIcon);
}

const createComponentForTest = ({  iconName } = {}) => {
    const el = createElement('builder_platform_interaction-element-icon', {is: ElementIcon});
    Object.assign(el, {iconName});
    document.body.appendChild(el);
    return el;
};

describe('Element Icon', () => {
    describe('Specific css injected in lighting icon', () => {
        it('Is action css specific class present for subfow node element icon', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.subflow
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).toContain(CLASS_NAMES.actions);
        });
        it('Is action css specific class present for email node element icon', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.email
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).toContain(CLASS_NAMES.actions);
        });
        it('Is action css specific class present for core action node element icon', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.coreActions
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).toContain(CLASS_NAMES.actions);
        });
        it('Is action css specific class absent for decision element icon', () => {
            const elementIcon = createComponentForTest({
                iconName: ICON_NAMES.decision
            });
            const lightningIcon = getLightningIcon(elementIcon);
            expect(lightningIcon.classList).not.toContain(CLASS_NAMES.actions);
        });
    });
});
// @ts-nocheck
import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';
import { CONTEXTUAL_MENU_MODE, ELEMENT_ACTION_CONFIG, getMenuConfiguration } from '../flcNodeMenuConfig';
import { LABELS } from '../flcNodeMenuLabels';

const getElementMetadata = (type, canHaveFaultConnector) => {
    const label = 'dummyLabel';
    const description = 'dummyDescription';

    return {
        label,
        description,
        type,
        canHaveFaultConnector
    };
};

describe('getMenuConfiguration tests', () => {
    describe('When contextualMode is BASE_ACTIONS_MODE', () => {
        describe('When elementType is not END_ELEMENT', () => {
            let configuration;
            beforeEach(() => {
                configuration = getMenuConfiguration(
                    getElementMetadata(ElementType.DEFAULT, true),
                    CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE
                );
            });

            it('Header should have the right label', () => {
                expect(configuration.header.label).toBe(getElementMetadata(ElementType.DEFAULT).label);
            });

            it('Header should have the right description', () => {
                expect(configuration.header.description).toBe(getElementMetadata(ElementType.DEFAULT).description);
            });

            it('Body should have the right actions', () => {
                expect(configuration.body.nodeActions).toEqual([
                    ELEMENT_ACTION_CONFIG.COPY_ACTION,
                    ELEMENT_ACTION_CONFIG.DELETE_ACTION,
                    ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION
                ]);
            });

            it('Copy Action should have the right icon', () => {
                expect(configuration.body.nodeActions[0].icon).toBe('utility:copy_to_clipboard');
            });

            it('Copy Action should have the right label', () => {
                expect(configuration.body.nodeActions[0].label).toBe(LABELS.copyActionLabel);
            });

            it('Delete Action should have the right icon', () => {
                expect(configuration.body.nodeActions[1].icon).toBe('utility:delete');
            });

            it('Delete Action should have the right label', () => {
                expect(configuration.body.nodeActions[1].label).toBe(LABELS.deleteActionLabel);
            });

            it('Add Fault Action should have the right icon', () => {
                expect(configuration.body.nodeActions[2].icon).toBe('utility:delete');
            });

            it('Add Fault should have the right label', () => {
                expect(configuration.body.nodeActions[2].label).toBe(LABELS.addFaultActionLabel);
            });

            it('Should have Footer', () => {
                expect(configuration.footer).toBeDefined();
            });

            it('Should have buttonIcon in the footer as the one set in EDIT_DETAILS_ACTION', () => {
                expect(configuration.footer.buttonIcon).toBe(ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonIcon);
            });

            it('Should have buttonIconPosition in the footer as the one set in EDIT_DETAILS_ACTION', () => {
                expect(configuration.footer.buttonIconPosition).toBe(
                    ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonIconPosition
                );
            });

            it('Should have buttonTextLabel in the footer as the one set in EDIT_DETAILS_ACTION', () => {
                expect(configuration.footer.buttonTextLabel).toBe(
                    ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonTextLabel
                );
            });

            it('Should have buttonTextTitle in the footer as the one set in EDIT_DETAILS_ACTION', () => {
                expect(configuration.footer.buttonTextTitle).toBe(
                    ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonTextTitle
                );
            });

            it('Should have buttonVariant in the footer as the one set in EDIT_DETAILS_ACTION', () => {
                expect(configuration.footer.buttonVariant).toBe(
                    ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonVariant
                );
            });
        });

        describe('When elementType is END_ELEMENT', () => {
            let configuration;
            beforeEach(() => {
                configuration = getMenuConfiguration(
                    getElementMetadata(ElementType.END, true),
                    CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE
                );
            });

            it('Body should have the right actions', () => {
                expect(configuration.body.nodeActions).toEqual([ELEMENT_ACTION_CONFIG.DELETE_END_ELEMENT_ACTION]);
            });

            it('Should not have Footer', () => {
                expect(configuration.footer).toBeUndefined();
            });
        });
    });

    describe('When contextualMode is DELETE_BRANCH_ELEMENT_MODE', () => {
        let configuration;
        beforeEach(() => {
            configuration = getMenuConfiguration(
                getElementMetadata(ElementType.BRANCH, true),
                CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE
            );
        });

        it('Should have Footer', () => {
            expect(configuration.footer).toBeDefined();
        });

        it('Should have buttonIcon in the footer as the one set in DELETE_BRANCH_ELEMENT_ACTION', () => {
            expect(configuration.footer.buttonIcon).toBe(ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION.buttonIcon);
        });

        it('Should have buttonIconPosition in the footer as the one set in DELETE_BRANCH_ELEMENT_ACTION', () => {
            expect(configuration.footer.buttonIconPosition).toBe(
                ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION.buttonIconPosition
            );
        });

        it('Should have buttonTextLabel in the footer as the one set in DELETE_BRANCH_ELEMENT_ACTION', () => {
            expect(configuration.footer.buttonTextLabel).toBe(
                ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION.buttonTextLabel
            );
        });

        it('Should have buttonTextTitle in the footer as the one set in DELETE_BRANCH_ELEMENT_ACTION', () => {
            expect(configuration.footer.buttonTextTitle).toBe(
                ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION.buttonTextTitle
            );
        });

        it('Should have buttonVariant in the footer as the one set in DELETE_BRANCH_ELEMENT_ACTION', () => {
            expect(configuration.footer.buttonVariant).toBe(
                ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION.buttonVariant
            );
        });
    });
});

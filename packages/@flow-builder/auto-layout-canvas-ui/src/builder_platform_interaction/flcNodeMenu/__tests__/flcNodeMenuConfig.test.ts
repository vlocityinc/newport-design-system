// @ts-nocheck
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
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
        let configuration;
        beforeEach(() => {
            configuration = getMenuConfiguration(
                getElementMetadata(NodeType.DEFAULT, true),
                CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE,
                false,
                false
            );
        });

        it('Header should have the right label', () => {
            expect(configuration.header.label).toBe(getElementMetadata(NodeType.DEFAULT, true).label);
        });

        it('Header should have the right description', () => {
            expect(configuration.header.description).toBe(getElementMetadata(NodeType.DEFAULT, true).description);
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

        it('Delete Action should have the right icon variant', () => {
            expect(configuration.body.nodeActions[1].iconVariant).toBe('error');
        });

        it('Delete Action should have the right label', () => {
            expect(configuration.body.nodeActions[1].label).toBe(LABELS.deleteActionLabel);
        });

        it('Add Fault Action should have the right icon', () => {
            expect(configuration.body.nodeActions[2].icon).toBe('utility:level_down');
        });

        it('Add Fault should have the right label', () => {
            expect(configuration.body.nodeActions[2].label).toBe(LABELS.addFaultActionLabel);
        });

        it('Delete Fault Action should have the right icon', () => {
            configuration = getMenuConfiguration(
                getElementMetadata(NodeType.DEFAULT, true),
                CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE,
                true,
                false
            );
            expect(configuration.body.nodeActions[2].icon).toBe('utility:level_down');
        });

        it('Delete Fault Action should have the right icon variant', () => {
            configuration = getMenuConfiguration(
                getElementMetadata(NodeType.DEFAULT, true),
                CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE,
                true,
                false
            );
            expect(configuration.body.nodeActions[2].iconVariant).toBe('error');
        });

        it('Delete Fault should have the right label', () => {
            configuration = getMenuConfiguration(
                getElementMetadata(NodeType.DEFAULT, true),
                CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE,
                true,
                false
            );
            expect(configuration.body.nodeActions[2].label).toBe(LABELS.deleteFaultActionLabel);
        });

        it.each`
            canHaveFaultConnector | elementHasFault | faultAction
            ${false}              | ${false}        | ${undefined}
            ${false}              | ${true}         | ${ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION}
            ${true}               | ${false}        | ${ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION}
            ${true}               | ${true}         | ${ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION}
        `(
            'should have faultAction set to $faultAction, when chfc: $canHaveFaultConnector, ehf: $elementHasFault',
            async ({ canHaveFaultConnector, elementHasFault, faultAction }) => {
                configuration = getMenuConfiguration(
                    getElementMetadata(NodeType.DEFAULT, canHaveFaultConnector),
                    CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE,
                    elementHasFault,
                    false
                );
                if (faultAction) {
                    expect(configuration.body.nodeActions).toEqual([
                        ELEMENT_ACTION_CONFIG.COPY_ACTION,
                        ELEMENT_ACTION_CONFIG.DELETE_ACTION,
                        faultAction
                    ]);
                } else {
                    expect(configuration.body.nodeActions).toEqual([
                        ELEMENT_ACTION_CONFIG.COPY_ACTION,
                        ELEMENT_ACTION_CONFIG.DELETE_ACTION
                    ]);
                }
            }
        );

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
            expect(configuration.footer.buttonVariant).toBe(ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonVariant);
        });
    });

    describe('When contextualMode is DELETE_BRANCH_ELEMENT_MODE', () => {
        let configuration;
        beforeEach(() => {
            configuration = getMenuConfiguration(
                getElementMetadata(NodeType.BRANCH, true),
                CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE,
                false,
                false
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

    describe('When deletion of elements is disabled', () => {
        let configuration;
        beforeEach(() => {
            configuration = getMenuConfiguration(
                getElementMetadata(NodeType.DEFAULT, true),
                CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE,
                false,
                true
            );
        });

        it('Body should have the right actions', () => {
            expect(configuration.body.nodeActions).toEqual([
                ELEMENT_ACTION_CONFIG.COPY_ACTION,
                ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION
            ]);
        });
    });
});

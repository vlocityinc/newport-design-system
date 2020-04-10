import { CONTEXTUAL_MENU_MODE, ELEMENT_ACTION_CONFIG, getMenuConfiguration } from '../flcNodeMenuConfig';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const getElementMetadata = elementType => {
    const label = 'dummyLabel';
    const description = 'dummyDescription';

    return {
        label,
        description,
        elementType
    };
};

describe('getMenuConfiguration tests', () => {
    describe('When contextualMode is BASE_ACTIONS_MODE', () => {
        describe('When elementType is not END_ELEMENT', () => {
            let configuration;
            beforeEach(() => {
                configuration = getMenuConfiguration(
                    getElementMetadata(ELEMENT_TYPE.ASSIGNMENT),
                    CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE
                );
            });

            it('Header should have the right label', () => {
                expect(configuration.header.label).toBe(getElementMetadata(ELEMENT_TYPE.ASSIGNMENT).label);
            });

            it('Header should have the right description', () => {
                expect(configuration.header.description).toBe(getElementMetadata(ELEMENT_TYPE.ASSIGNMENT).description);
            });

            it('Body should have the 2 nodeActions', () => {
                expect(configuration.body.nodeActions).toHaveLength(2);
            });

            it('Body should have COPY_ACTION as the first action', () => {
                expect(configuration.body.nodeActions[0]).toBe(ELEMENT_ACTION_CONFIG.COPY_ACTION);
            });

            it('Body should have DELETE_ACTION as the second action', () => {
                expect(configuration.body.nodeActions[1]).toBe(ELEMENT_ACTION_CONFIG.DELETE_ACTION);
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

            it('Should have buttonText in the footer as the one set in EDIT_DETAILS_ACTION', () => {
                expect(configuration.footer.buttonText).toBe(ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonText);
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
                    getElementMetadata(ELEMENT_TYPE.END_ELEMENT),
                    CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE
                );
            });

            it('Body should have the 1 nodeAction', () => {
                expect(configuration.body.nodeActions).toHaveLength(1);
            });

            it('Body should have DELETE_END_ELEMENT_ACTION as the second action', () => {
                expect(configuration.body.nodeActions[0]).toBe(ELEMENT_ACTION_CONFIG.DELETE_END_ELEMENT_ACTION);
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
                getElementMetadata(ELEMENT_TYPE.DECISION),
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

        it('Should have buttonText in the footer as the one set in DELETE_BRANCH_ELEMENT_ACTION', () => {
            expect(configuration.footer.buttonText).toBe(ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION.buttonText);
        });

        it('Should have buttonVariant in the footer as the one set in DELETE_BRANCH_ELEMENT_ACTION', () => {
            expect(configuration.footer.buttonVariant).toBe(
                ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION.buttonVariant
            );
        });
    });
});

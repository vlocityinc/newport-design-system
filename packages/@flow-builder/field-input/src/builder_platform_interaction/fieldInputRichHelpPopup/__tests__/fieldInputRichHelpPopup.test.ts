import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { LABELS } from '../fieldInputRichHelpPopupLabels';

const createComponentUnderTest = (props) => {
    return createComponent(INTERACTION_COMPONENTS_SELECTORS.FIELD_INPUT_RICH_HELP_POPUP, props);
};

const selectors = {
    popupSource: LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_POPUP_SOURCE,
    popupSourceIcon: `${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_POPUP_SOURCE} ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_ICON}`,
    popupBody: '.slds-popover__body',
    descriptionSection: '.test-description-section',
    descriptionValue: '.test-description-section span.slds-text-body_regular',
    apiNameSection: '.test-api-name-section',
    apiNameHeading: '.test-api-name-section b',
    apiNameValue: '.test-api-name-section span.slds-text-body_regular',
    labelSection: '.test-label-section',
    labelHeading: '.test-label-section b',
    labelValue: '.test-label-section span.slds-text-body_regular',
    resourceTypeSection: '.test-resource-type-section',
    resourceTypeHeading: '.test-resource-type-section b',
    resourceTypeIcon: `.test-resource-type-section ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON}`,
    resourceTypeValue: '.test-resource-type-section span.slds-text-body_regular',
    dataTypeSection: '.test-data-type-section',
    dataTypeHeading: '.test-data-type-section b',
    dataTypeIcon: `.test-data-type-section ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON}`,
    dataTypeValue: '.test-data-type-section span.slds-text-body_regular'
};

describe('Rich Help Popup Tests', () => {
    let cmp;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
    });

    it('sanity', () => {
        expect(cmp).toBeTruthy();
    });

    it('Should have a popup source', () => {
        const popupSource = cmp.shadowRoot.querySelector(selectors.popupSource);
        expect(popupSource).not.toBeNull();
    });

    it('Should have a popup source icon', () => {
        const popupSourceIcon = cmp.shadowRoot.querySelector(selectors.popupSourceIcon);
        expect(popupSourceIcon).not.toBeNull();
    });

    it('Popup source icon should have the right name', () => {
        const popupSourceIcon = cmp.shadowRoot.querySelector(selectors.popupSourceIcon);
        expect(popupSourceIcon.iconName).toBe('utility:info');
    });

    it('Popup source icon should have the right size', () => {
        const popupSourceIcon = cmp.shadowRoot.querySelector(selectors.popupSourceIcon);
        expect(popupSourceIcon.size).toBe('medium');
    });

    it('Popup source icon should have the right alternative text', () => {
        const popupSourceIcon = cmp.shadowRoot.querySelector(selectors.popupSourceIcon);
        expect(popupSourceIcon.alternativeText).toBe('Additional Information');
    });

    it('Popup source icon should have the right variant', () => {
        const popupSourceIcon = cmp.shadowRoot.querySelector(selectors.popupSourceIcon);
        expect(popupSourceIcon.variant).toBe('bare');
    });

    it('Open function should be fired when mouse enters the source icon', () => {
        const popupSource = cmp.shadowRoot.querySelector(selectors.popupSource);
        popupSource.open = jest.fn();
        const popupSourceIcon = cmp.shadowRoot.querySelector(selectors.popupSourceIcon);
        popupSourceIcon.dispatchEvent(new CustomEvent('mouseenter', {}));
        expect(popupSource.open).toHaveBeenCalled();
    });

    it('Close function should be fired when mouse leaves the source icon', () => {
        const popupSource = cmp.shadowRoot.querySelector(selectors.popupSource);
        popupSource.close = jest.fn();
        const popupSourceIcon = cmp.shadowRoot.querySelector(selectors.popupSourceIcon);
        popupSourceIcon.dispatchEvent(new CustomEvent('mouseleave', {}));
        expect(popupSource.close).toHaveBeenCalled();
    });

    it('Should have a popup body', () => {
        const popupBody = cmp.shadowRoot.querySelector(selectors.popupBody);
        expect(popupBody).not.toBeNull();
    });

    it('Should not have descriptionSection when popupData has not description', async () => {
        cmp.popupData = {
            apiName: 'Users_from_Get_Account_Owners',
            label: 'Users from Get Account Owners',
            resourceType: 'Collection',
            resourceTypeIcon: 'utility:connected_apps',
            dataType: 'Record',
            dataTypeIcon: 'utility:connected_apps',
            subtype: 'User'
        };
        await ticks(1);
        const descriptionSection = cmp.shadowRoot.querySelector(selectors.descriptionSection);
        expect(descriptionSection).toBeNull();
    });

    it('Should have descriptionSection when popupData has description', () => {
        const descriptionSection = cmp.shadowRoot.querySelector(selectors.descriptionSection);
        expect(descriptionSection).not.toBeNull();
    });

    it('Should have the right descriptionValue when popupData has description', () => {
        const descriptionValue = cmp.shadowRoot.querySelector(selectors.descriptionValue);
        expect(descriptionValue.textContent).toBe(cmp.popupData.description);
    });

    it('Should have apiNameSection when showLabel is false', () => {
        const apiNameSection = cmp.shadowRoot.querySelector(selectors.apiNameSection);
        expect(apiNameSection).not.toBeNull();
    });

    it('Should not have labelSection when showLabel is false', () => {
        const labelSection = cmp.shadowRoot.querySelector(selectors.labelSection);
        expect(labelSection).toBeNull();
    });

    it('apiNameSection should have the right heading', () => {
        const apiNameHeading = cmp.shadowRoot.querySelector(selectors.apiNameHeading);
        expect(apiNameHeading.textContent).toBe(LABELS.apiNameHeading);
    });

    it('apiNameSection should have the right value', () => {
        const apiNameValue = cmp.shadowRoot.querySelector(selectors.apiNameValue);
        expect(apiNameValue.textContent).toBe(cmp.popupData.apiName);
    });

    it('Should have labelSection when showLabel is true', async () => {
        cmp.showLabel = true;
        await ticks(1);
        const labelSection = cmp.shadowRoot.querySelector(selectors.labelSection);
        expect(labelSection).not.toBeNull();
    });

    it('Should not have apiNameSection when showLabel is true', async () => {
        cmp.showLabel = true;
        await ticks(1);
        const apiNameSection = cmp.shadowRoot.querySelector(selectors.apiNameSection);
        expect(apiNameSection).toBeNull();
    });

    it('labelSection should have the right heading', async () => {
        cmp.showLabel = true;
        await ticks(1);
        const labelHeading = cmp.shadowRoot.querySelector(selectors.labelHeading);
        expect(labelHeading.textContent).toBe(LABELS.labelHeading);
    });

    it('labelSection should have the right value', async () => {
        cmp.showLabel = true;
        await ticks(1);
        const labelValue = cmp.shadowRoot.querySelector(selectors.labelValue);
        expect(labelValue.textContent).toBe(cmp.popupData.label);
    });

    it('Should have resourceTypeSection', () => {
        const resourceTypeSection = cmp.shadowRoot.querySelector(selectors.resourceTypeSection);
        expect(resourceTypeSection).not.toBeNull();
    });

    it('resourceTypeSection should have the right heading', () => {
        const resourceTypeHeading = cmp.shadowRoot.querySelector(selectors.resourceTypeHeading);
        expect(resourceTypeHeading.textContent).toBe(LABELS.resourceTypeHeading);
    });

    it('resourceTypeSection should have the right icon', () => {
        const resourceTypeIcon = cmp.shadowRoot.querySelector(selectors.resourceTypeIcon);
        expect(resourceTypeIcon.iconName).toBe(cmp.popupData.resourceTypeIcon);
    });

    it('resourceTypeSection should have the right value', () => {
        const resourceTypeValue = cmp.shadowRoot.querySelector(selectors.resourceTypeValue);
        expect(resourceTypeValue.textContent).toBe(cmp.popupData.resourceType);
    });

    it('Should have dataTypeSection', () => {
        const dataTypeSection = cmp.shadowRoot.querySelector(selectors.dataTypeSection);
        expect(dataTypeSection).not.toBeNull();
    });

    it('dataTypeSection should have the right heading', () => {
        const dataTypeHeading = cmp.shadowRoot.querySelector(selectors.dataTypeHeading);
        expect(dataTypeHeading.textContent).toBe(LABELS.dataTypeHeading);
    });

    it('dataTypeSection should have the right icon', () => {
        const dataTypeIcon = cmp.shadowRoot.querySelector(selectors.dataTypeIcon);
        expect(dataTypeIcon.iconName).toBe(cmp.popupData.dataTypeIcon);
    });

    it('dataTypeSection should have the right value when subtype is defined', () => {
        const dataTypeValue = cmp.shadowRoot.querySelector(selectors.dataTypeValue);
        expect(dataTypeValue.textContent).toBe(`${cmp.popupData.dataType} (${cmp.popupData.subtype})`);
    });

    it('dataTypeSection should have the right value when subtype is not defined', async () => {
        cmp.popupData = {
            description: 'Description for Global Variables',
            apiName: 'Users_from_Get_Account_Owners',
            label: 'Users from Get Account Owners',
            resourceType: 'Collection',
            resourceTypeIcon: 'utility:connected_apps',
            dataType: 'Record',
            dataTypeIcon: 'utility:connected_apps'
        };
        await ticks(1);
        const dataTypeValue = cmp.shadowRoot.querySelector(selectors.dataTypeValue);
        expect(dataTypeValue.textContent).toBe(cmp.popupData.dataType);
    });
});

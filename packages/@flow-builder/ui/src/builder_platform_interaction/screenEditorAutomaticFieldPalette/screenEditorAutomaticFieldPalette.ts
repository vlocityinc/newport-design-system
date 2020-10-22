import { LightningElement, track, api } from 'lwc';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { format } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './screenEditorAutomaticFieldPlaletteLabels';
import { containsMatcher } from 'builder_platform_interaction/filterLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const SUPPORTED_DATATYPES = [
    FLOW_DATA_TYPE.STRING.value,
    FLOW_DATA_TYPE.NUMBER.value,
    FLOW_DATA_TYPE.DATE_TIME.value,
    FLOW_DATA_TYPE.DATE.value,
    FLOW_DATA_TYPE.BOOLEAN.value
];

type FieldDefinition = {
    dataType: string;
    editable: boolean;
    creatable: boolean;
    apiName: string;
    required: boolean;
    label: string;
    relationshipName: string;
};

type PaletteItem = {
    description: string;
    guid: string;
    iconName: string;
    iconBackgroundColor: string;
    label: string;
    fieldTypeName: string;
    elementType: string;
};

type PaletteSection = {
    guid: string;
    label: string;
    _children: PaletteItem[];
};

export default class ScreenEditorAutomaticFieldPalette extends LightningElement {
    sobjectCollectionCriterion = SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT;
    showNoItemsIllustration = true;
    sobjectPickerErrorMessage = '';
    entityName = '';
    showErrorMessageRelatedToFieldFetching = false;
    labels = LABELS;

    @track
    state = {
        recordVariable: '',
        entityFields: {}
    };

    get searchInputPlaceholder(): String {
        return format(LABELS.filterFieldsPlaceHolderLabel, this.entityName);
    }

    @api
    paletteData: PaletteSection[] = [];

    @api
    get showNoItemIllustrationContainer() {
        return this.showNoItemsIllustration;
    }

    @api
    get recordVariable() {
        return this.state.recordVariable;
    }

    @api
    get entityFields() {
        return this.state.entityFields;
    }

    /**
     * Handler for "SObjectReference" element property changes
     * @param {object} event
     */
    handleSObjectReferenceChangedEvent(event: CustomEvent) {
        event.stopPropagation();
        if (this.state.recordVariable !== event.detail.value) {
            this.state.recordVariable = event.detail.value;
            this.sobjectPickerErrorMessage = event.detail.error;
            if (this.state.recordVariable !== '') {
                this.updateFields();
                this.showNoItemsIllustration = false;
            } else {
                this.showNoItemsIllustration = true;
            }
        }
    }

    /**
     * Get the fields of the selected entity and set the state accordingly
     */
    updateFields() {
        this.state.entityFields = {};
        if (this.state.recordVariable) {
            const resource = getElementByGuid(this.state.recordVariable);
            this.entityName = resource.subtype;
            fetchFieldsForEntity(this.entityName)
                .then((fields) => {
                    this.state.entityFields = fields;
                    this.showErrorMessageRelatedToFieldFetching = false;
                    this.buildModel('');
                })
                .catch(() => {
                    this.showErrorMessageRelatedToFieldFetching = true;
                });
        }
    }

    /**
     * Populate section/items data for inner palette component
     */
    buildModel(fieldNamePattern: String) {
        const sections: PaletteSection[] = [];
        const requiredSection: PaletteSection = {
            guid: generateGuid(),
            label: LABELS.paletteSectionRequiredFieldsLabel,
            _children: []
        };
        const optionalSection: PaletteSection = {
            guid: generateGuid(),
            label: LABELS.paletteSectionOptionalFieldsLabel,
            _children: []
        };
        const fieldsArray: Array<FieldDefinition> = Object.values(this.state.entityFields);
        const filteredFields: Array<FieldDefinition> = fieldsArray.filter(
            (field) =>
                (field.editable || field.creatable) &&
                SUPPORTED_DATATYPES.includes(field.dataType) &&
                field.relationshipName == null &&
                (fieldNamePattern ? containsMatcher(field, 'label', fieldNamePattern) : true)
        );
        filteredFields.forEach((myField) => {
            const guid = generateGuid();
            const item: PaletteItem = {
                description: myField.label,
                elementType: guid,
                guid,
                iconName: 'utility:rows',
                iconBackgroundColor: '',
                label: myField.label,
                fieldTypeName: ''
            };
            if (myField.required) {
                requiredSection._children.push(item);
            } else {
                optionalSection._children.push(item);
            }
        });
        this.pushSectionIfNotEmpty(sections, requiredSection);
        this.pushSectionIfNotEmpty(sections, optionalSection);
        this.paletteData = sections;
    }

    /**
     * Add a section to an array of palette section if the section is not empty
     * @param {PaletteSection[]} sectionArray array of section to push into
     * @param {PaletteSection} paletteSection palette section to add
     */
    pushSectionIfNotEmpty(sectionArray: PaletteSection[], paletteSection: PaletteSection) {
        if (paletteSection._children.length > 0) {
            sectionArray.push(paletteSection);
        }
    }

    /**
     * Rebuild palette data when a new search term is given as input
     */
    handleSearch(event) {
        const filterValue = event.target.value;
        const pattern = filterValue ? filterValue.trim() : undefined;
        this.buildModel(pattern);
    }
}

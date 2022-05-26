import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './fieldInputMenuHeaderLabels';
const { format } = commonUtils;

/**
 * The header component for the field input menu
 */
export default class FieldInputMenuHeader extends LightningElement {
    labels = LABELS;

    /**
     * The mode of the header
     */
    @api mode: FieldInput.MenuHeaderMode = 'allResources';

    /**
     * The label/name info for the header text
     */
    @api info?: UI.LabelName;

    /**
     * The breadcrumbs, if any.
     */
    @api breadcrumbs?: FieldInput.Breadcrumb[] = [];

    get text() {
        switch (this.mode) {
            case 'allResources':
                return this.labels.allResources;
            case 'traversal':
                return null;
            case 'resource':
                return this.info ? format(this.labels.resourceType, this.info.label) : this.labels.resourceType;
            case 'entityFields':
                return this.info ? format(this.labels.entityFields, this.info.label) : this.labels.entityFields;
            default:
        }

        return null;
    }

    get showBreadcrumbs() {
        return this.mode === 'traversal';
    }

    get showSettings() {
        // don't show until 240
        return false;
    }
}

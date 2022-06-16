import { getObjectInfoApi } from 'builder_platform_interaction/fieldInputMenuDataApi';
import FieldInputMenuView from 'builder_platform_interaction/fieldInputMenuView';
import { api } from 'lwc';
import { LABELS } from './fieldInputMenuObjectFieldsViewLabels';
import { getObjectFieldsViewSections } from './utils';

/**
 * Field Input Menu View for the fields of an SObject
 */
export default class FieldInputMenuObjectFieldsView extends FieldInputMenuView<GetObjectInfoApiData> {
    labels = LABELS;

    _objectApiName!: string;

    @api set objectApiName(objectApiName: string) {
        this._objectApiName = objectApiName;

        getObjectInfoApi({ objectApiName }).then((apiResponse) => {
            this.updateSections(apiResponse);
        });
    }

    get objectApiName() {
        return this._objectApiName;
    }

    // Uncomment to use LDS with @wire instead of the get/set above
    // @api objectApiName;
    // @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    // handleApiResult(apiResult) { this.updateSections(apiResult); }

    override updateSectionsWithData(data: GetObjectInfoApiData): void {
        this.sections = getObjectFieldsViewSections(data);
    }
}

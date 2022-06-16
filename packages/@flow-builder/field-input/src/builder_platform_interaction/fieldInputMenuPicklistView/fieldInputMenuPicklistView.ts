import { getPicklistValuesApi } from 'builder_platform_interaction/fieldInputMenuDataApi';
import FieldInputMenuView from 'builder_platform_interaction/fieldInputMenuView';
import { api } from 'lwc';
import { LABELS } from './fieldInputMenuPicklistViewLabels';
import { getPicklistViewSection } from './utils';

type Props = {
    recordTypeId: string;
    fieldApiName: string;
};

/**
 * Field Input Menu View for the values of a Picklist field
 */
export default class FieldInputMenuPicklistView extends FieldInputMenuView<GetPicklistValuesApiData> {
    labels = LABELS;

    _info!: Props;

    @api set info(info: Props) {
        this._info = info;
        const { recordTypeId, fieldApiName } = info;
        getPicklistValuesApi({ recordTypeId, fieldApiName }).then((apiResponse) => {
            this.updateSections(apiResponse);
        });
    }

    get info(): Props {
        return this._info;
    }

    override updateSectionsWithData(data: GetPicklistValuesApiData): void {
        this.sections = [getPicklistViewSection(data)];
    }
}

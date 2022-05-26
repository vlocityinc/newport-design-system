import FieldInputMenuView from 'builder_platform_interaction/fieldInputMenuView';
import { getViewAllSections } from './utils';

/**
 * Top level Field Input Menu View
 */
export default class FieldInputMenuAllView extends FieldInputMenuView<undefined> {
    connectedCallback(): void {
        this.updateSectionsWithData();
    }

    override updateSectionsWithData(): void {
        this.sections = getViewAllSections();
    }
}

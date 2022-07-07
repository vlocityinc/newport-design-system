import FieldInputMenuView from 'builder_platform_interaction/fieldInputMenuView';
import { api } from 'lwc';
import { getViewAllSections } from './utils';

/**
 * Top level Field Input Menu View
 */
export default class FieldInputMenuAllView extends FieldInputMenuView<undefined> {
    _rules?: RuleMap;
    _config?: FieldInput.MenuConfig;
    _context: FieldInput.Context = {
        flowElements: []
    };

    /* allow params rules */
    @api set rules(rules: RuleMap | undefined) {
        this._rules = rules;
        this.updateSectionsWithData();
    }

    get rules() {
        return this._rules;
    }

    /* menu config */
    @api set config(config: FieldInput.MenuConfig | undefined) {
        this._config = config;
        this.updateSectionsWithData();
    }

    get config() {
        return this._config;
    }

    /* the field input context */
    @api set context(context: FieldInput.Context) {
        this._context = context;
        this.updateSectionsWithData();
    }

    get context() {
        return this._context;
    }

    override updateSectionsWithData(): void {
        if (this._context != null && this._config != null) {
            this.sections = getViewAllSections(this._context.flowElements, this._config, this._rules);
        }
    }
}

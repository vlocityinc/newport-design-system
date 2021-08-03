import {
    clickEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import FieldToFerovExpressionBuilder from 'builder_platform_interaction/fieldToFerovExpressionBuilder';
import RecordInputOutputAssignments from 'builder_platform_interaction/recordInputOutputAssignments';
import { ExpressionBuilderComponentTest } from './expressionBuilderTestUtils';
import { TestComponent } from './testComponent';

export class RecordInputOutputAssignmentsComponentTest extends TestComponent<RecordInputOutputAssignments> {
    public async clickAddFieldButton() {
        const addFieldButton = this.deepQuerySelector([
            INTERACTION_COMPONENTS_SELECTORS.LIST,
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON
        ]);
        addFieldButton.dispatchEvent(clickEvent());
        await ticks(1);
    }

    public getFieldToFerovExpressionBuilders() {
        return Array.from(
            this.element.shadowRoot!.querySelectorAll(
                INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER
            )
        ).map((element) => new ExpressionBuilderComponentTest(element as FieldToFerovExpressionBuilder & HTMLElement));
    }
}

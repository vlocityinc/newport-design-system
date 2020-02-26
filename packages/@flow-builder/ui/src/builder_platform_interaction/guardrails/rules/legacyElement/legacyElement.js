import { Rule, Result } from 'analyzer_framework/api';
import { METADATA_KEY } from 'builder_platform_interaction/flowMetadata';

export class LegacyElement extends Rule {
    invoke(context) {
        const flow = context.getData();
        if (flow.hasOwnProperty(METADATA_KEY.APEX_PLUGIN_CALLS) && flow[METADATA_KEY.APEX_PLUGIN_CALLS].length !== 0) {
            const apexElements = flow[METADATA_KEY.APEX_PLUGIN_CALLS];
            apexElements.forEach(apexElement => {
                context.report(new Result(apexElement, [apexElement.label]));
            });
        }
    }
}

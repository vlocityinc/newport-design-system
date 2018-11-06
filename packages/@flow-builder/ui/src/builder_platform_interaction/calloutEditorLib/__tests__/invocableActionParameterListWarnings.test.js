import { LABELS } from "../../invocableActionEditor/invocableActionEditorLabels";
import { MERGE_WARNING_TYPE, getParameterItemWarning } from 'builder_platform_interaction/calloutEditorLib';

describe('apexPlugin ParameterList warnings', () => {
    describe('getParameterItemWarning', () => {
        describe('parameter is not available in invocable apex', () => {
            let warning;
            beforeAll(() => {
                warning = getParameterItemWarning([MERGE_WARNING_TYPE.NOT_AVAILABLE], LABELS);
            });
            it('should be deleted', () => {
                expect(warning.shouldBeDeleted).toBe(true);
            });
            it('should have no icon', () => {
                expect(warning.hideIcon).toBe(true);
            });
            it('should have "will cause errors" badge', () => {
                expect(warning.warningBadge).toEqual('FlowBuilderInvocableActionEditor.badgeWillCauseErrors');
            });
            it('should have a warning message', () => {
                expect(warning.warningMessage).toEqual('FlowBuilderInvocableActionEditor.warningNotAvailable');
            });
        });
        describe('Duplicates', () => {
            it('should be deleted, have an icon and have no badge and warning message', () => {
                const warning = getParameterItemWarning([MERGE_WARNING_TYPE.DUPLICATE], LABELS);
                expect(warning).toEqual({ "grayPill": false, "shouldBeDeleted": true, "hideIcon" : false });
            });
            it('should have a badge and warning message if there is another warning for the same parameter', () => {
                const warning = getParameterItemWarning([MERGE_WARNING_TYPE.DUPLICATE, MERGE_WARNING_TYPE.NOT_AVAILABLE], LABELS);
                expect(warning).toEqual({ "grayPill": false, "shouldBeDeleted": true, "hideIcon" : true, "warningBadge": "FlowBuilderInvocableActionEditor.badgeWillCauseErrors", "warningMessage": "FlowBuilderInvocableActionEditor.warningNotAvailable" });
            });
        });
    });
});
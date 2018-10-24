import { LABELS } from "../../subflowEditor/subflowEditorLabels";
import { MERGE_WARNING_TYPE, getParameterItemWarning } from 'builder_platform_interaction/calloutEditorLib';

describe('subflow ParameterList warnings', () => {
    describe('getParameterItemWarning', () => {
        describe('Duplicates', () => {
            it('should be deleted, have an icon and have no badge and warning message', () => {
                const warning = getParameterItemWarning([MERGE_WARNING_TYPE.DUPLICATE], LABELS);
                expect(warning).toEqual({ "shouldBeDeleted": true, "hideIcon" : false });
            });
            it('should have a badge and warning message if there is another warning for the same assignment', () => {
                const warning = getParameterItemWarning([MERGE_WARNING_TYPE.DUPLICATE, MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_LATEST], LABELS);
                expect(warning).toEqual({ "shouldBeDeleted": true, "hideIcon" : false, "warningBadge": "FlowBuilderSubflowEditor.badgeDebugOnly", "warningMessage": "FlowBuilderSubflowEditor.warningLatestOnly" });
            });
        });
        describe('assignment using variable not available in subflow', () => {
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
                expect(warning.warningBadge).toEqual('FlowBuilderSubflowEditor.badgeWillCauseErrors');
            });
            it('should have a warning message', () => {
                expect(warning.warningMessage).toEqual('FlowBuilderSubflowEditor.warningNotAvailable');
            });
        });
        describe('assignment with a variable for which datatype changed between active and latest', () => {
            let warning;
            beforeAll(() => {
                warning = getParameterItemWarning([MERGE_WARNING_TYPE.DATA_TYPE_CHANGED], LABELS);
            });
            it('should not be deleted', () => {
                expect(warning.shouldBeDeleted).toBe(false);
            });
            it('should have an icon', () => {
                expect(warning.hideIcon).toBe(false);
            });
            it('should not have a badge', () => {
                expect(warning.warningBadge).toBeUndefined();
            });
            it('should have a warning message', () => {
                expect(warning.warningMessage).toEqual('FlowBuilderSubflowEditor.warningDataTypeChanged');
            });
        });
        describe('assignment with a variable only available in latest version', () => {
            let warning;
            beforeAll(() => {
                warning = getParameterItemWarning([MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_LATEST], LABELS);
            });
            it('should not be deleted', () => {
                expect(warning.shouldBeDeleted).toBe(false);
            });
            it('should have an icon', () => {
                expect(warning.hideIcon).toBe(false);
            });
            it('should not have a badge', () => {
                expect(warning.warningBadge).toEqual('FlowBuilderSubflowEditor.badgeDebugOnly');
            });
            it('should have a warning message', () => {
                expect(warning.warningMessage).toEqual('FlowBuilderSubflowEditor.warningLatestOnly');
            });
        });
        describe('assignment with a variable only available in active version', () => {
            let warning;
            beforeAll(() => {
                warning = getParameterItemWarning([MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_ACTIVE], LABELS);
            });
            it('should not be deleted', () => {
                expect(warning.shouldBeDeleted).toBe(false);
            });
            it('should have an icon', () => {
                expect(warning.hideIcon).toBe(false);
            });
            it('should not have a badge', () => {
                expect(warning.warningBadge).toBeUndefined();
            });
            it('should have a warning message', () => {
                expect(warning.warningMessage).toEqual('FlowBuilderSubflowEditor.warningActiveOnly');
            });
        });
    });
});
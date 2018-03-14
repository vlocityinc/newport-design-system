import {
    mutateEditorElement,
    removeEditorElementMutation
} from "../propertyEditorDataMutation";
import { ELEMENT_TYPE } from "builder_platform_interaction-constant";

jest.mock("../assignmentEditorDataMutation", () => {
    return {
        mutateAssignment: assignment => {
            assignment.name = "mutated";
        },
        deMutateAssignment: assignment => {
            assignment.name = "demutated";
        }
    };
});

describe("mutateEditorElement function", () => {
    it("should mutate assignment element", () => {
        expect(
            mutateEditorElement({
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                name: "beforeMutation"
            })
        ).toEqual({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            name: "mutated"
        });
    });
});

describe("deMutateEditorElement function", () => {
    it("should demutate assignment element", () => {
        expect(
            removeEditorElementMutation({
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                name: "beforeDemutation"
            })
        ).toEqual({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            name: "demutated"
        });
    });
});

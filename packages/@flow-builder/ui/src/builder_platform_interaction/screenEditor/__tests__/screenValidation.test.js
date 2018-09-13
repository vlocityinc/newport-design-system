import { screenValidation } from "../screenValidation";
import { LABELS } from "builder_platform_interaction/validationRules";

describe('when props set to NUMBER', () => {
    it('and when valid scale is passed should return - null', () => {
        expect(screenValidation.validateProperty('fields[type.name="Number"].scale', "0")).toBeNull();
    });
    it('and when negative scale is passed, we should get a positive integer error', () => {
        expect(screenValidation.validateProperty('fields[type.name="Number"].scale', "-1")).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
    });
});

describe('when props set to CURRENCY', () => {
    it('and when valid scale is passed should return - null', () => {
        expect(screenValidation.validateProperty('fields[type.name="Currency"].scale', "0")).toBeNull();
    });
    it('and when negative scale is passed, we should get a positive integer error', () => {
        expect(screenValidation.validateProperty('fields[type.name="Currency"].scale', "-1")).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
    });
});
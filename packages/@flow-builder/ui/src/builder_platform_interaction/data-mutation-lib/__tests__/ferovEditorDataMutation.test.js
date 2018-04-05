import { FEROV_DATA_TYPE } from "builder_platform_interaction-data-type-lib";
import { mutateFEROV, deMutateFEROV } from "../ferovEditorDataMutation";

describe("mutateFerov function", () => {
    it("should mutate ferov with string value", () => {
        const ferov = { stringValue: "abc" };
        const item = {};
        mutateFEROV(item, ferov);
        expect(item.rightHandSide).toEqual("abc");
        expect(item.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.STRING);
    });

    it("should mutate ferov with number value", () => {
        const ferov = { numberValue: 123 };
        const item = {};
        mutateFEROV(item, ferov);
        expect(item.rightHandSide).toEqual(123);
        expect(item.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.NUMBER);
    });

    it("should mutate ferov with date value", () => {
        const ferov = { dateValue: "05-24-1983" };
        const item = {};
        mutateFEROV(item, ferov);
        expect(item.rightHandSide).toEqual("05-24-1983");
        expect(item.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.DATE);
    });

    it("should mutate ferov with datetime value", () => {
        const ferov = { dateTimeValue: "05-24-1983 12:00" };
        const item = {};
        mutateFEROV(item, ferov);
        expect(item.rightHandSide).toEqual("05-24-1983 12:00");
        expect(item.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.DATETIME);
    });

    it("should mutate ferov with boolean value", () => {
        const ferov = { booleanValue: true };
        const item = {};
        mutateFEROV(item, ferov);
        expect(item.rightHandSide).toEqual(true);
        expect(item.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.BOOLEAN);
    });

    it("should mutate ferov with reference value", () => {
        const ferov = { elementReference: "myVariable" };
        const item = {};
        mutateFEROV(item, ferov);
        expect(item.rightHandSide).toEqual("myVariable");
        expect(item.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
    });

    it("should mutate ferov with null string value", () => {
        const ferov = { stringValue: null };
        const item = {};
        mutateFEROV(item, ferov);
        expect(item.rightHandSide).toEqual(null);
        expect(item.rightHandSideDataType).toEqual(FEROV_DATA_TYPE.STRING);
    });

    it("should not blow up with empty ferov", () => {
        const ferov = {};
        const item = {};
        mutateFEROV(item, ferov);
        expect(item.rightHandSide).toBeUndefined();
        expect(item.rightHandSideDataType).toBeUndefined();
    });
});

describe("deMutateFerov function", () => {
    it("should demutate ferov with string value", () => {
        const item = {
            rightHandSide: "abc",
            rightHandSideDataType: FEROV_DATA_TYPE.STRING
        };
        const ferov = {};
        deMutateFEROV(item, ferov);
        expect(ferov.stringValue).toEqual("abc");
    });

    it("should demutate ferov with number value", () => {
        const item = {
            rightHandSide: 123,
            rightHandSideDataType: FEROV_DATA_TYPE.NUMBER
        };
        const ferov = {};
        deMutateFEROV(item, ferov);
        expect(ferov.numberValue).toEqual(123);
    });

    it("should demutate ferov with date value", () => {
        const item = {
            rightHandSide: "05-24-1983",
            rightHandSideDataType: FEROV_DATA_TYPE.DATE
        };
        const ferov = {};
        deMutateFEROV(item, ferov);
        expect(ferov.dateValue).toEqual("05-24-1983");
    });

    it("should demutate ferov with dateTime value", () => {
        const item = {
            rightHandSide: "05-24-1983 12:00",
            rightHandSideDataType: FEROV_DATA_TYPE.DATETIME
        };
        const ferov = {};
        deMutateFEROV(item, ferov);
        expect(ferov.dateTimeValue).toEqual("05-24-1983 12:00");
    });

    it("should demutate ferov with boolean value", () => {
        const item = {
            rightHandSide: true,
            rightHandSideDataType: FEROV_DATA_TYPE.BOOLEAN
        };
        const ferov = {};
        deMutateFEROV(item, ferov);
        expect(ferov.booleanValue).toEqual(true);
    });

    it("should demutate ferov with reference value", () => {
        const item = {
            rightHandSide: "myVariable",
            rightHandSideDataType: FEROV_DATA_TYPE.REFERENCE
        };
        const ferov = {};
        deMutateFEROV(item, ferov);
        expect(ferov.elementReference).toEqual("myVariable");
    });
});

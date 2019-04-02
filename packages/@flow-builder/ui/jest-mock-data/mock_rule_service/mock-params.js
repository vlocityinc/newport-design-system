/**
 * The rules service uses objects like these to describe what can be on
 * the left & right hand sides of expressions. Here, some of these params
 * are standing alone, for testing functions that operate on params instead
 * of full rules.
 */

const allElements = ['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'];

export const dateParam = {
    paramType:'Data',
    dataType: 'Date',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const datetimeParam = {
    paramType:'Data',
    dataType: 'DateTime',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const dateCollectionParam = {
    paramType:'Data',
    dataType: 'Date',
    collection:true,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const stringParam = {
    paramType:'Data',
    dataType: 'String',
    collection:false,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const numberParamMustBeField = {
    paramType:'Data',
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'MustBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const numberParamCannotBeField = {
    paramType:'Data',
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const numberParamCanBeAnything = {
    paramType:'Data',
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const numberParamCannotBeProperty = {
    paramType:'Data',
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CannotBe',
};

export const numberParamMustBeProperty = {
    paramType:'Data',
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'MustBe',
};

export const stageCollectionParam = {
    paramType:'Element',
    elementType:'STAGE',
    collection:true,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
    cannotBeElements: allElements,
};

export const stageParam = {
    paramType:'Element',
    elementType:'STAGE',
    collection:false,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
    cannotBeElements: allElements,
};

export const booleanParam = {
    paramType:'Data',
    dataType:'Boolean',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const sobjectParam = {
    paramType: 'Data',
    dataType: 'SObject',
    collection: false,
    canBeSobjectField: 'CanBe',
    canBeSystemVariable: 'CanBe',
    canBeApexProperty:'CanBe',
};

export const apexParam = {
    paramType: 'Data',
    dataType: 'Apex',
    collection: false,
    canBeSobjectField: 'CannotBe',
    canBeSystemVariable: 'CannotBe',
    canBeApexProperty:'CanBe',
};

export const accountParam = {
    Account: [sobjectParam],
};

export const apexClassParam = {
    apexClass: [apexParam],
};

export const datetimeParamTypes = {
    Date: [dateParam],
    DateTime: [datetimeParam],
};

// these params deal with hypothetical situations that we account for but don't exist right now
export const dateParamMissingCollection = {
    paramType:'Data',
    dataType: 'Date',
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

export const dateParamMustBeElements = {
    paramType:'Data',
    dataType: 'Date',
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
    mustBeElements: allElements,
};

export const dateParamCannotBeElements = {
    paramType:'Data',
    dataType: 'Date',
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
    cannotBeElements: allElements,
};

export const dateParamNoElementsList = {
    paramType:'Data',
    dataType: 'Date',
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeApexProperty:'CanBe',
};

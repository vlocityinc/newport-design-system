/**
 * The rules service uses objects like these to describe what can be on
 * the left & right hand sides of expressions. Here, some of these params
 * are standing alone, for testing functions that operate on params instead
 * of full rules.
 */

const allElements = ['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'];

export const dateParam = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Date',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeElements: allElements,
};

export const dateCollectionParam = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Date',
    collection:true,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeElements: allElements,
};

export const stringParam = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'String',
    collection:false,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    canBeElements: allElements,
};

export const numberParamMustBeField = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'MustBe',
    canBeSystemVariable:'CanBe',
    canBeElements: allElements,
};
export const numberParamCannotBeField = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    canBeElements: allElements,
};

export const numberParamCanBeField = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeElements: allElements,
};

export const stageCollectionParam = {
    paramType:'Element',
    paramIndex:1,
    elementType:'STAGE',
    collection:true,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    cannotBeElements: allElements,
};

export const stageParam = {
    paramType:'Element',
    paramIndex:1,
    elementType:'STAGE',
    collection:false,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    cannotBeElements: allElements,
};

// these params deal with hypothetical situations that we account for but don't exist right now
export const dateParamMissingCollection = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Date',
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeElements: allElements,
};

export const dateParamMustBeElements = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Date',
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    mustBeElements: allElements,
};

export const dateParamCannotBeElements = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Date',
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    cannotBeElements: allElements,
};

export const dateParamNoElementsList = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Date',
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
};

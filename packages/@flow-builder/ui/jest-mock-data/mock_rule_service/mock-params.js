/**
 * The rules service uses objects like these to describe what can be on
 * the left & right hand sides of expressions. Here, some of these params
 * are standing alone, for testing functions that operate on params instead
 * of full rules.
 */

export const dateParam = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Date',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeElements: ['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
};

export const dateCollectionParam = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Date',
    collection:true,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeElements: ['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
};

export const stringParam = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'String',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeElements: ['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
};

export const numberParam = {
    paramType:'Data',
    paramIndex:1,
    dataType: 'Number',
    collection:false,
    canBeSobjectField:'CanBe',
    canBeSystemVariable:'CanBe',
    canBeElements: ['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
};

export const stageCollectionParam = {
    paramType:'Element',
    paramIndex:1,
    elementType:'STAGE',
    collection:true,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    cannotBeElements: ['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
};

export const stageParam = {
    paramType:'Element',
    paramIndex:1,
    elementType:'STAGE',
    collection:false,
    canBeSobjectField:'CannotBe',
    canBeSystemVariable:'CanBe',
    cannotBeElements: ['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
};

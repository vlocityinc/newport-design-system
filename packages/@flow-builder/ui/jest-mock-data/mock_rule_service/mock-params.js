/**
 * The rules service uses objects like these to describe what can be on
 * the left & right hand sides of expressions. Here, some of these params
 * are standing alone, for testing functions that operate on params instead
 * of full rules.
 */

export const dateParam = {
    paramType:'Data',
    paramIndex:1,
    dataType:{
        _value_:'Date'
    },
    isCollection:false,
    canBeField:'CanBe',
    canBeSysVar:'CanBe'
};

export const stringParam = {
    paramType:'Data',
    paramIndex:1,
    dataType:{
        _value_:'String'
    },
    isCollection:false,
    canBeField:'CanBe',
    canBeSysVar:'CanBe'
};

export const numberParam = {
    paramType:'Data',
    paramIndex:1,
    dataType:{
        _value_:'Number'
    },
    isCollection:false,
    canBeField:'CanBe',
    canBeSysVar:'CanBe'
};

export const stageParam = {
    paramType:'Element',
    paramIndex:1,
    elemType:'STAGE',
    isCollection:true,
    canBeField:'CannotBe',
    canBeSysVar:'MustBe'
};


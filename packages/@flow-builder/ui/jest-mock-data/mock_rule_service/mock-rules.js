export const mockRules =
[
    {
        ruleType:'assignment',
        left:{
            paramType:'Data',
            paramIndex:1,
            dataType: 'Date',
            collection:false,
            canBeSobjectField:'CanBe',
            canBeSystemVariable:'CanBe',
            canBeElements:['VARIABLE'],
            cannotBeElements:['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD']
        },
        operator:'Assign',
        rhsParams:[
            {
                paramType:'Data',
                paramIndex:1,
                dataType: 'Date',
                collection:false,
                canBeSobjectField:'CanBe',
                canBeSystemVariable:'CanBe',
                canBeElements:['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
            },
            {
                paramType:'Data',
                paramIndex:1,
                dataType: 'DateTime',
                collection:false,
                canBeSobjectField:'CanBe',
                canBeSystemVariable:'CanBe',
                canBeElements:['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
            }
        ],
    },
    {
        ruleType:'assignment',
        left:{
            paramType:'Data',
            paramIndex:1,
            dataType: 'DateTime',
            collection:false,
            canBeSobjectField:'CanBe',
            canBeSystemVariable:'CanBe',
            canBeElements:['VARIABLE'],
            cannotBeElements:['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD']
        },
        operator:'Assign',
        rhsParams:[
            {
                paramType:'Data',
                paramIndex:1,
                dataType: 'Date',
                collection:false,
                canBeSobjectField:'CanBe',
                canBeSystemVariable:'CanBe',
                canBeElements:['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
            },
            {
                paramType:'Data',
                paramIndex:1,
                dataType: 'DateTime',
                collection:false,
                canBeSobjectField:'CanBe',
                canBeSystemVariable:'CanBe',
                canBeElements:['CHOICE', 'CHOICELOOKUP', 'CONSTANT', 'FORMULA', 'SCREENFIELD', 'VARIABLE'],
            }
        ],
        excludeElems: ['ASSIGNMENT'],
    },
    {
        ruleType:'assignment',
        left:{
            paramType:'Element',
            paramIndex:1,
            elementType:'STAGE',
            collection:true,
            canBeSobjectField:'CannotBe',
            canBeSystemVariable:'MustBe'
        },
        operator:'Equals',
        rhsParams:[
            {
                paramType:'Element',
                paramIndex:1,
                elementType:'STAGE',
                collection:false,
                canBeSobjectField:'CannotBe',
                canBeSystemVariable:'CanBe'
            }
        ]
    },
    {
        ruleType:'comparison',
        left:{
            paramType:'Element',
            paramIndex:1,
            elementType:'STAGE',
            collection:false,
            canBeSobjectField:'CannotBe',
            canBeSystemVariable:'MustBe'
        },
        operator:'Equals',
        rhsParams:[
            {
                paramType:'Element',
                paramIndex:1,
                elementType:'STAGE',
                collection:false,
                canBeSobjectField:'CannotBe',
                canBeSystemVariable:'CanBe'
            }
        ],
        excludeElems:['DECISION']
    },
    // duplicate rule needed for testing removal of duplicates.
    // there will never be a direct copy of a rule, just duplicates on LHS or Operator
    {
        ruleType:'comparison',
        left:{
            paramType:'Element',
            paramIndex:1,
            elementType:'STAGE',
            collection:false,
            canBeSobjectField:'CannotBe',
            canBeSystemVariable:'MustBe'
        },
        operator:'Equals',
        rhsParams:[
            {
                paramType:'Element',
                paramIndex:1,
                dataType:'DateTime',
                collection:false,
                canBeSobjectField:'CannotBe',
                canBeSystemVariable:'CanBe'
            }
        ]
    },
    {
        ruleType:'assignment',
        left:{
            paramType:'Data',
            paramIndex:1,
            dataType: 'SObject',
            collection:false,
            canBeSobjectField:'CannotBe',
            canBeSystemVariable:'CanBe'
        },
        operator:'Assign',
        rhsParams:[
            {
                paramType:'Data',
                paramIndex:1,
                dataType: 'SObject',
                collection:false,
                canBeSobjectField:'CanBe',
                canBeSystemVariable:'CanBe'
            }
        ]
    },
    {
        ruleType:'comparison',
        left:{
            paramType:'Element',
            paramIndex:1,
            elementType:'STAGE',
            collection:false,
            canBeSobjectField:'CannotBe',
            canBeSystemVariable:'MustBe'
        },
        operator:'Equals',
        rhsParams:[
            {
                paramType:'Element',
                paramIndex:1,
                dataType: 'DateTime',
                collection:false,
                canBeSobjectField:'CannotBe',
                canBeSystemVariable:'CanBe'
            }
        ],
    },
];

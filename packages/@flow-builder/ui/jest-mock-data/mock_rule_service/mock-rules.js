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
    {
        ruleType:'comparison',
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
                dataType: 'DateTime',
                collection:true,
                canBeSobjectField:'CannotBe',
                canBeSystemVariable:'CanBe'
            }
        ],
    },
];

// all rules, as returned by FlowBuilderController
export const mockAllRules = [
    {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "MustBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": false,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "TEXTTEMPLATE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "MustBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": true,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "MustBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": true,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": [
          "SUBFLOW"
        ]
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Assign"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "TEXTTEMPLATE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Add"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Subtract"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Subtract"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "Subtract"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddItem"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAfterFirst"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "TEXTTEMPLATE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveAll"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "TEXTTEMPLATE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "MustBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": true,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemovePosition"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveBeforeFirst"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "TEXTTEMPLATE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AddAtStart"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "TEXTTEMPLATE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "MustBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": true,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveFirst"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "TEXTTEMPLATE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE",
            "STAGE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "RemoveUncommon"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "MustBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": true,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "assignment",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "TEXTTEMPLATE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": null,
        "assignmentOperator": {
          "value": "AssignCount"
        },
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "MustBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": true,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "MustBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": false,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "TEXTTEMPLATE"
          ],
          "collection": false,
          "elementType": "TEXTTEMPLATE"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "TEXTTEMPLATE"
            ],
            "collection": false,
            "elementType": "TEXTTEMPLATE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "ACTIONCALL"
          ],
          "collection": false,
          "elementType": "ACTIONCALL"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "APEXPLUGIN"
          ],
          "collection": false,
          "elementType": "APEXPLUGIN"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDCREATE"
          ],
          "collection": false,
          "elementType": "RECORDCREATE"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDDELETE"
          ],
          "collection": false,
          "elementType": "RECORDDELETE"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDQUERY"
          ],
          "collection": false,
          "elementType": "RECORDQUERY"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDUPDATE"
          ],
          "collection": false,
          "elementType": "RECORDUPDATE"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "MustBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": true,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "EqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "MustBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": false,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "TEXTTEMPLATE"
          ],
          "collection": false,
          "elementType": "TEXTTEMPLATE"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "TEXTTEMPLATE"
            ],
            "collection": false,
            "elementType": "TEXTTEMPLATE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "ACTIONCALL"
          ],
          "collection": false,
          "elementType": "ACTIONCALL"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "APEXPLUGIN"
          ],
          "collection": false,
          "elementType": "APEXPLUGIN"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDCREATE"
          ],
          "collection": false,
          "elementType": "RECORDCREATE"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDDELETE"
          ],
          "collection": false,
          "elementType": "RECORDDELETE"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDQUERY"
          ],
          "collection": false,
          "elementType": "RECORDQUERY"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDUPDATE"
          ],
          "collection": false,
          "elementType": "RECORDUPDATE"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "MustBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": true,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "NotEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": true,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "GreaterThan"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "GreaterThan"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "GreaterThan"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "GreaterThan"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "GreaterThanOrEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "GreaterThanOrEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "GreaterThanOrEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "GreaterThanOrEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "LessThan"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "LessThan"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "LessThan"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "LessThan"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "LessThanOrEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "LessThanOrEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "LessThanOrEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "LessThanOrEqualTo"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "StartsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "StartsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "StartsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "MustBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "StartsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "CHOICE"
          ],
          "collection": false,
          "elementType": "CHOICE"
        },
        "comparisonOperator": {
          "value": "StartsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "CHOICELOOKUP"
          ],
          "collection": false,
          "elementType": "CHOICELOOKUP"
        },
        "comparisonOperator": {
          "value": "StartsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "TEXTTEMPLATE"
          ],
          "collection": false,
          "elementType": "TEXTTEMPLATE"
        },
        "comparisonOperator": {
          "value": "StartsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "TEXTTEMPLATE"
            ],
            "collection": false,
            "elementType": "TEXTTEMPLATE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "MustBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "CHOICE"
          ],
          "collection": false,
          "elementType": "CHOICE"
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "CHOICELOOKUP"
          ],
          "collection": false,
          "elementType": "CHOICELOOKUP"
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "TEXTTEMPLATE"
          ],
          "collection": false,
          "elementType": "TEXTTEMPLATE"
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "TEXTTEMPLATE"
            ],
            "collection": false,
            "elementType": "TEXTTEMPLATE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EndsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EndsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EndsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "MustBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "EndsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "CHOICE"
          ],
          "collection": false,
          "elementType": "CHOICE"
        },
        "comparisonOperator": {
          "value": "EndsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "CHOICELOOKUP"
          ],
          "collection": false,
          "elementType": "CHOICELOOKUP"
        },
        "comparisonOperator": {
          "value": "EndsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "TEXTTEMPLATE"
          ],
          "collection": false,
          "elementType": "TEXTTEMPLATE"
        },
        "comparisonOperator": {
          "value": "EndsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CannotBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "TEXTTEMPLATE"
            ],
            "collection": false,
            "elementType": "TEXTTEMPLATE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": false,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "StartsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": false,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "EndsWith"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Date",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "DateTime",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Currency",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Number",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "SObject",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "MustBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "Contains"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "String",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Multipicklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Picklist",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA"
            ],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          },
          {
            "paramType": "Element",
            "paramIndex": 1,
            "dataType": null,
            "canBeSobjectField": "CannotBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [],
            "cannotBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "mustBeElements": [
              "STAGE"
            ],
            "collection": false,
            "elementType": "STAGE"
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": true,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CONSTANT",
            "CHOICELOOKUP"
          ],
          "mustBeElements": [],
          "collection": true,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STAGE"
          ],
          "collection": false,
          "elementType": "STAGE"
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [
            "CONSTANT",
            "CHOICELOOKUP"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": "WARNING",
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "CanBe",
          "canBeSystemVariable": "CanBe",
          "canBeElements": [
            "CHOICE",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "cannotBeElements": [],
          "mustBeElements": [
            "CONSTANT",
            "CHOICELOOKUP"
          ],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "IsNull"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "ASSIGNMENT"
          ],
          "collection": false,
          "elementType": "ASSIGNMENT"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "APEXPLUGIN"
          ],
          "collection": false,
          "elementType": "APEXPLUGIN"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "DECISION"
          ],
          "collection": false,
          "elementType": "DECISION"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDCREATE"
          ],
          "collection": false,
          "elementType": "RECORDCREATE"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDQUERY"
          ],
          "collection": false,
          "elementType": "RECORDQUERY"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDUPDATE"
          ],
          "collection": false,
          "elementType": "RECORDUPDATE"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "RECORDDELETE"
          ],
          "collection": false,
          "elementType": "RECORDDELETE"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "SUBFLOW"
          ],
          "collection": false,
          "elementType": "SUBFLOW"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "STEP"
          ],
          "collection": false,
          "elementType": "STEP"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "SCREEN"
          ],
          "collection": false,
          "elementType": "SCREEN"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "LOOP"
          ],
          "collection": false,
          "elementType": "LOOP"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "ACTIONCALL"
          ],
          "collection": false,
          "elementType": "ACTIONCALL"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "WAIT"
          ],
          "collection": false,
          "elementType": "WAIT"
        },
        "comparisonOperator": {
          "value": "WasVisited"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "String",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Date",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "DateTime",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Number",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Currency",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Boolean",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "SObject",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Picklist",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Data",
          "paramIndex": 1,
          "dataType": "Multipicklist",
          "canBeSobjectField": "MustBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE",
            "CHOICE",
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA"
          ],
          "mustBeElements": [],
          "collection": false,
          "elementType": null
        },
        "comparisonOperator": {
          "value": "WasSet"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": null,
        "excludeElems": ["RECORDDELETE"]
      },
      {
        "ruleType": "comparison",
        "validationType": null,
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICELOOKUP",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "CHOICE"
          ],
          "collection": false,
          "elementType": "CHOICE"
        },
        "comparisonOperator": {
          "value": "WasSelected"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      },
      {
        "ruleType": "comparison",
        "validationType": "WARNING",
        "left": {
          "paramType": "Element",
          "paramIndex": 1,
          "dataType": null,
          "canBeSobjectField": "CannotBe",
          "canBeSystemVariable": "CannotBe",
          "canBeElements": [],
          "cannotBeElements": [
            "CHOICE",
            "CONSTANT",
            "FORMULA",
            "SCREENFIELD",
            "VARIABLE"
          ],
          "mustBeElements": [
            "CHOICELOOKUP"
          ],
          "collection": false,
          "elementType": "CHOICELOOKUP"
        },
        "comparisonOperator": {
          "value": "WasSelected"
        },
        "assignmentOperator": null,
        "rhsParams": [
          {
            "paramType": "Data",
            "paramIndex": 1,
            "dataType": "Boolean",
            "canBeSobjectField": "CanBe",
            "canBeSystemVariable": "CanBe",
            "canBeElements": [
              "CHOICE",
              "CHOICELOOKUP",
              "CONSTANT",
              "FORMULA",
              "SCREENFIELD",
              "VARIABLE"
            ],
            "cannotBeElements": [],
            "mustBeElements": [],
            "collection": false,
            "elementType": null
          }
        ],
        "includeElems": [
          "DECISION"
        ],
        "excludeElems": null
      }
    ];
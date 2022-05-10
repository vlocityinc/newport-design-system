// To update recommendationFlowUIModel from recommendationFlow.json, run flowTranslator.test.js and follow instructions
export const recommendationFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            description: '',
            locationX: 50,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'None',
            filterLogic: 'and',
            object: '',
            objectIndex: '4c1d2c56-9528-42a8-9de2-9bdf12e87a1b',
            filters: [
                {
                    rowIndex: '703162a5-d48f-40b6-b52e-ec4e1944ba34',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false,
            childReferences: [],
            availableConnections: [],
            shouldSupportScheduledPaths: false
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'Assign_apex_collection',
            description: '',
            label: 'Assign apex collection',
            locationX: 176,
            locationY: 1118,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignmentItems: [
                {
                    rowIndex: 'fc408daa-3152-46bf-8733-c1083018292b',
                    leftHandSide: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964.myString',
                    rightHandSide: 'Test',
                    rightHandSideDataType: 'String',
                    operator: 'Assign'
                },
                {
                    rowIndex: '6d690706-908c-4d94-9513-1b219301b4c5',
                    leftHandSide: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
                    rightHandSide: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
                    rightHandSideDataType: 'reference',
                    operator: 'Add'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'e682f03e-925a-4d84-adc3-f1c5ceea0201': {
            guid: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
            name: 'Assign_text',
            description: '',
            label: 'Assign text',
            locationX: 264,
            locationY: 1478,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignmentItems: [
                {
                    rowIndex: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
                    leftHandSide: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    rightHandSide: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab': {
            guid: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            name: 'Assign_Text_Collection',
            description: '',
            label: 'Assign Text Collection',
            locationX: 176,
            locationY: 878,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignmentItems: [
                {
                    rowIndex: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
                    leftHandSide: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
                    rightHandSide: 'foo',
                    rightHandSideDataType: 'String',
                    operator: 'Add'
                },
                {
                    rowIndex: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
                    leftHandSide: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
                    rightHandSide: 'bar',
                    rightHandSideDataType: 'String',
                    operator: 'Add'
                },
                {
                    rowIndex: '4968239c-5e3d-45ee-9339-f575c917e223',
                    leftHandSide: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
                    rightHandSide: 'woo',
                    rightHandSideDataType: 'String',
                    operator: 'Add'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        '0ecd3000-0adc-4d34-bdc1-acd331740de0': {
            guid: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
            name: 'Assign_text_from_account_billing_city',
            description: '',
            label: 'Assign text from account billing city',
            locationX: 264,
            locationY: 1814,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignmentItems: [
                {
                    rowIndex: '7f4ddba5-e41b-456b-b686-94b257cc9914',
                    leftHandSide: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    rightHandSide: '013c0515-5f96-493f-bf5b-3d261350a4e6.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        '53329036-32e6-4965-a1d2-b12cd0344f99': {
            guid: '53329036-32e6-4965-a1d2-b12cd0344f99',
            name: 'Assign_to_outputRecommendations',
            description: '',
            label: 'Assign to outputRecommendations',
            locationX: 176,
            locationY: 518,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignmentItems: [
                {
                    rowIndex: '04e1c283-fc0b-4928-a495-89d956368769',
                    leftHandSide: 'a8368340-a386-4406-9118-02389237ad54',
                    rightHandSide: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        '41c6da8a-c6e0-418b-8b23-9906b4adab11': {
            guid: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
            name: 'apexCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: 'a35e28e0-3d3b-44b1-9638-9caba6ef3820',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1'
        },
        '3f1c4d9a-ea88-4c6c-85ac-6aa009601964': {
            guid: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
            name: 'apexVar',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: '2f00ca0d-743f-4639-a084-272bbc548f8b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'a18b3d06-504c-4e47-9f44-6663c42703cf'
        },
        '5383bf9b-8314-42bd-a51e-cbee56ec3570': {
            guid: '5383bf9b-8314-42bd-a51e-cbee56ec3570',
            name: 'currentItem_Accounts_to_Recommendations',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: true,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '787fd564-24db-448c-ba59-ef88c8a5cbd9'
        },
        'cc44cf67-84c7-4dc5-b851-44d57be8fa66': {
            guid: 'cc44cf67-84c7-4dc5-b851-44d57be8fa66',
            name: 'currentItem_Filter_Apex_collection',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: 'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c'
        },
        '86f9f34d-e2e4-45e3-a574-78ddcd669ebf': {
            guid: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf',
            name: 'currentItem_Filter_Get_Accounts_By_Conditions',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3e57f4c5-fecd-4be0-83a2-3238cdda979c'
        },
        '7ab29c0c-3dbf-4f99-a94c-311ef891973f': {
            guid: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            name: 'currentItem_Filter_Get_Accounts_By_Formula',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '85d76151-9bec-4869-b691-791baf964b4f',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'bb597c66-db1e-4636-85b6-31f89b320bd4'
        },
        '700b8f1c-98eb-48ea-90f0-35e1a864a1a8': {
            guid: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
            name: 'currentItem_Filter_text_collection',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'e653d56e-898d-4e69-87c3-07338d100647',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '956ee0bf-ff21-44f4-9917-65676160e094'
        },
        '69030d84-1e7f-49c3-ad89-ddc4db69050a': {
            guid: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
            name: 'currentItem_Modify_recommendations',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: true,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Recommendation',
            subtypeIndex: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2'
        },
        'a8368340-a386-4406-9118-02389237ad54': {
            guid: 'a8368340-a386-4406-9118-02389237ad54',
            name: 'outputRecommendations',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: true,
            dataType: 'SObject',
            subtype: 'Recommendation',
            subtypeIndex: '2bf626b1-9430-49ca-ad02-a75241931b16',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6e77e9cf-2492-44ca-a088-ee4b8159d478'
        },
        '90da6513-4272-44d6-9f80-4cfc29acc5a3': {
            guid: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            name: 'recordId',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: true,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '5c075fad-735a-4628-9e51-495d3292d153'
        },
        'd1fda889-4f3a-48cd-ba79-be4fbca04da2': {
            guid: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            name: 'textVar',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '40c11213-36c0-451e-a5aa-8790aee02559',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e62ce284-ccf2-46af-8446-c0a110a4bba0'
        },
        '34ff5f58-8d99-470d-a755-a2aa0dc69f59': {
            guid: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            name: 'vTextCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6cb9b58e-4246-44c0-85a9-8f7d32172da6'
        },
        'a733e74b-1a25-43dc-b43c-d126c849023d': {
            guid: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            name: 'Get_Accounts',
            description: '',
            label: 'Get Accounts',
            locationX: 176,
            locationY: 158,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: null,
            sortOrder: 'NotSorted',
            sortField: '',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: 'be979456-fe7c-4fa6-be9f-e388ea78dd33',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'automatic'
        },
        '65909adb-0efe-4743-b4a7-ca6e93d71c92': {
            guid: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            name: 'Loop_filter_text_collection',
            description: '',
            label: 'Loop filter text collection',
            locationX: 176,
            locationY: 1358,
            isCanvasElement: true,
            connectorCount: 2,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'd66cf236-ca0a-4351-952d-b12df4abdaf8',
            collectionReference: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            collectionReferenceIndex: '2e02687e-41a2-42eb-ba74-81c130218b86',
            iterationOrder: 'Asc',
            maxConnections: 2,
            availableConnections: [],
            elementType: 'Loop',
            storeOutputAutomatically: true,
            dataType: 'String',
            subtype: null
        },
        '013c0515-5f96-493f-bf5b-3d261350a4e6': {
            guid: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            name: 'Loop_on_filter_accounts',
            description: '',
            label: 'Loop on filter accounts',
            locationX: 176,
            locationY: 1694,
            isCanvasElement: true,
            connectorCount: 2,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '201c3554-f05a-4fff-8482-1495f16e2f8b',
            collectionReference: '02504510-b361-4fb3-878e-81925a76160f',
            collectionReferenceIndex: 'cf176378-9ab0-436f-a161-079057c789f4',
            iterationOrder: 'Asc',
            maxConnections: 2,
            availableConnections: [],
            elementType: 'Loop',
            storeOutputAutomatically: true,
            dataType: 'SObject',
            subtype: 'Account'
        },
        '34eaa6ff-765e-4c12-8635-b00f6c7f2c34': {
            guid: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            name: 'Accounts_to_Recommendations',
            description: '',
            label: 'Accounts to Recommendations',
            locationX: 176,
            locationY: 278,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'RecommendationMapCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            collectionProcessorType: 'RecommendationMapCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: null,
            mapItems: [
                {
                    rowIndex: 'ba8a8e41-3944-4099-9655-065f054e811f',
                    leftHandSide: 'Recommendation.AcceptanceLabel',
                    rightHandSide: 'Accept',
                    rightHandSideDataType: 'String',
                    operator: 'Assign'
                },
                {
                    rowIndex: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
                    leftHandSide: 'Recommendation.ActionReference',
                    rightHandSide: 'action',
                    rightHandSideDataType: 'String',
                    operator: 'Assign'
                },
                {
                    rowIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7',
                    leftHandSide: 'Recommendation.Description',
                    rightHandSide: '5383bf9b-8314-42bd-a51e-cbee56ec3570.Description',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                },
                {
                    rowIndex: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
                    leftHandSide: 'Recommendation.Name',
                    rightHandSide: '5383bf9b-8314-42bd-a51e-cbee56ec3570.Name',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                },
                {
                    rowIndex: '56095468-2459-481d-b084-04a05babcb22',
                    leftHandSide: 'Recommendation.RejectionLabel',
                    rightHandSide: 'Reject',
                    rightHandSideDataType: 'String',
                    operator: 'Assign'
                },
                {
                    rowIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9',
                    leftHandSide: 'Recommendation.ExternalId',
                    rightHandSide: '5383bf9b-8314-42bd-a51e-cbee56ec3570.AccountSource',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            assignNextValueToReference: '5383bf9b-8314-42bd-a51e-cbee56ec3570',
            outputSObjectType: 'Recommendation',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Recommendation',
            storeOutputAutomatically: true
        },
        '0883ba56-46a4-4420-8105-c9d17ad0183b': {
            guid: '0883ba56-46a4-4420-8105-c9d17ad0183b',
            name: 'Filter_Apex_collection',
            description: '',
            label: 'Filter Apex collection',
            locationX: 176,
            locationY: 1238,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'FilterCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
            collectionProcessorType: 'FilterCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: null,
            assignNextValueToReference: 'cc44cf67-84c7-4dc5-b851-44d57be8fa66',
            conditions: [
                {
                    rowIndex: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d',
                    leftHandSide: 'cc44cf67-84c7-4dc5-b851-44d57be8fa66.myString',
                    rightHandSide: 'Test',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            conditionLogic: 'and',
            dataType: 'Apex',
            subtype: 'MyApexClass',
            isCollection: true,
            formula: null,
            storeOutputAutomatically: true
        },
        '02504510-b361-4fb3-878e-81925a76160f': {
            guid: '02504510-b361-4fb3-878e-81925a76160f',
            name: 'Filter_Get_Accounts_By_Conditions',
            description: '',
            label: 'Filter Get Accounts by conditions',
            locationX: 176,
            locationY: 638,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'FilterCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            collectionProcessorType: 'FilterCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: null,
            assignNextValueToReference: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf',
            conditions: [
                {
                    rowIndex: '26b1d461-e66e-41c7-bb0e-5c86b04280db',
                    leftHandSide: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf.Name',
                    rightHandSide: 'Test',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
                    leftHandSide: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf.BillingAddress',
                    rightHandSide: 'My address',
                    rightHandSideDataType: 'String',
                    operator: 'NotEqualTo'
                }
            ],
            conditionLogic: 'and',
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: true,
            formula: null,
            storeOutputAutomatically: true
        },
        '41a189ff-01f4-4018-b75c-3f363b65cc42': {
            guid: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            name: 'Filter_Get_Accounts_By_Formula',
            description: '',
            label: 'Filter Get Accounts By Formula',
            locationX: 176,
            locationY: 758,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'FilterCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            collectionProcessorType: 'FilterCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: null,
            assignNextValueToReference: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            conditions: [],
            conditionLogic: 'formula_evaluates_to_true',
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: true,
            formula: "BEGINS({!7ab29c0c-3dbf-4f99-a94c-311ef891973f.Name}, 'Test')",
            storeOutputAutomatically: true
        },
        'b3a76739-4414-41d2-984e-e44bca6402c6': {
            guid: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            name: 'Filter_text_collection',
            description: '',
            label: 'Filter text collection',
            locationX: 176,
            locationY: 998,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'FilterCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            collectionProcessorType: 'FilterCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: null,
            assignNextValueToReference: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
            conditions: [
                {
                    rowIndex: '6160bbc3-c247-458e-b1b8-abc60b4d3d39',
                    leftHandSide: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
                    rightHandSide: 'oo',
                    rightHandSideDataType: 'String',
                    operator: 'Contains'
                }
            ],
            conditionLogic: 'and',
            dataType: 'String',
            subtype: null,
            isCollection: true,
            formula: null,
            storeOutputAutomatically: true
        },
        '458ac1c7-23e7-49cc-a518-5eaf4f218a49': {
            guid: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            name: 'Modify_recommendations',
            description: '',
            label: 'Modify recommendations',
            locationX: 176,
            locationY: 398,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'RecommendationMapCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            collectionProcessorType: 'RecommendationMapCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: null,
            mapItems: [
                {
                    rowIndex: '5e2803c7-a184-465c-92e3-1d29634f2114',
                    leftHandSide: 'Recommendation.AcceptanceLabel',
                    rightHandSide: 'Yes, thanks',
                    rightHandSideDataType: 'String',
                    operator: 'Assign'
                },
                {
                    rowIndex: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
                    leftHandSide: 'Recommendation.RejectionLabel',
                    rightHandSide: 'No, thanks',
                    rightHandSideDataType: 'String',
                    operator: 'Assign'
                }
            ],
            assignNextValueToReference: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
            outputSObjectType: 'Recommendation',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Recommendation',
            storeOutputAutomatically: true
        },
        '2d1ada73-88e9-4cf4-a814-dcba8d517104': {
            guid: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
            name: 'Sort_Apex_Collection',
            description: '',
            label: 'Sort Apex Collection',
            locationX: 176,
            locationY: 2270,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'SortCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
            collectionProcessorType: 'SortCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: null,
            sortOptions: [
                {
                    sortField: 'myString',
                    sortOrder: 'Asc',
                    doesPutEmptyStringAndNullFirst: false,
                    rowIndex: '76bbf8c2-9a5e-4a03-a84f-a518866d7963'
                }
            ]
        },
        'f08f384a-8e8f-40d3-8009-f8e1fb16eac4': {
            guid: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            name: 'Sort_Get_Accounts',
            description: '',
            label: 'Sort Get Accounts',
            locationX: 176,
            locationY: 2030,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'SortCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            collectionProcessorType: 'SortCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: '10',
            sortOptions: [
                {
                    sortField: 'AnnualRevenue',
                    sortOrder: 'Asc',
                    doesPutEmptyStringAndNullFirst: false,
                    rowIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db'
                },
                {
                    sortField: 'BillingCity',
                    sortOrder: 'Asc',
                    doesPutEmptyStringAndNullFirst: true,
                    rowIndex: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7'
                },
                {
                    sortField: 'Name',
                    sortOrder: 'Asc',
                    doesPutEmptyStringAndNullFirst: false,
                    rowIndex: 'fcf61595-af2e-4982-9607-5de1c2819fab'
                }
            ]
        },
        '1283ede6-414b-45a2-851a-1b113f26bffd': {
            guid: '1283ede6-414b-45a2-851a-1b113f26bffd',
            name: 'Sort_Text_Collection',
            description: '',
            label: 'Sort Text Collection',
            locationX: 176,
            locationY: 2150,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: 'SortCollectionProcessor',
            canHaveFaultConnector: false,
            collectionReference: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            collectionProcessorType: 'SortCollectionProcessor',
            elementType: 'CollectionProcessor',
            maxConnections: 1,
            limit: null,
            sortOptions: [
                {
                    sortOrder: 'Asc',
                    doesPutEmptyStringAndNullFirst: false,
                    rowIndex: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc'
                }
            ]
        }
    },
    connectors: [
        {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: null,
            target: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '90246d76-2818-4059-b0fd-425e241f8708',
            source: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            childSource: null,
            target: '0883ba56-46a4-4420-8105-c9d17ad0183b',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '2e01b9c4-5144-4db2-9543-7899c5c34329',
            source: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
            childSource: null,
            target: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            source: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            childSource: null,
            target: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
            source: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
            childSource: null,
            target: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
            source: '53329036-32e6-4965-a1d2-b12cd0344f99',
            childSource: null,
            target: '02504510-b361-4fb3-878e-81925a76160f',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'b93ea139-c9df-49cb-a42e-52c5f496ab07',
            source: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            childSource: null,
            target: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
            source: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            childSource: null,
            target: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
            label: 'FlowBuilderConnectorLabels.loopNextConnectorLabel',
            type: 'LOOP_NEXT',
            config: {
                isSelected: false
            }
        },
        {
            guid: '52bc2460-8775-417b-a692-f72725a8f6b0',
            source: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            childSource: null,
            target: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            label: 'FlowBuilderConnectorLabels.loopEndConnectorLabel',
            type: 'LOOP_END',
            config: {
                isSelected: false
            }
        },
        {
            guid: '27cfbe21-2aa1-4503-aa13-3677c687153d',
            source: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            childSource: null,
            target: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
            label: 'FlowBuilderConnectorLabels.loopNextConnectorLabel',
            type: 'LOOP_NEXT',
            config: {
                isSelected: false
            }
        },
        {
            guid: '583e40d5-e735-4d8c-8f30-097d48de7ec8',
            source: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            childSource: null,
            target: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            label: 'FlowBuilderConnectorLabels.loopEndConnectorLabel',
            type: 'LOOP_END',
            config: {
                isSelected: false
            }
        },
        {
            guid: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            source: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            childSource: null,
            target: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '42afe63b-0744-4dec-a7e6-20c67691dd81',
            source: '0883ba56-46a4-4420-8105-c9d17ad0183b',
            childSource: null,
            target: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
            source: '02504510-b361-4fb3-878e-81925a76160f',
            childSource: null,
            target: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '796969f1-a892-4b16-836e-209180057a2b',
            source: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            childSource: null,
            target: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '38f77648-3c7e-4431-8403-239492238623',
            source: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            childSource: null,
            target: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
            source: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            childSource: null,
            target: '53329036-32e6-4965-a1d2-b12cd0344f99',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
            source: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            childSource: null,
            target: '1283ede6-414b-45a2-851a-1b113f26bffd',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f',
            source: '1283ede6-414b-45a2-851a-1b113f26bffd',
            childSource: null,
            target: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        'a4451815-988d-4f17-883d-64b6ad9fab7e',
        'e682f03e-925a-4d84-adc3-f1c5ceea0201',
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
        '0ecd3000-0adc-4d34-bdc1-acd331740de0',
        '53329036-32e6-4965-a1d2-b12cd0344f99',
        'a733e74b-1a25-43dc-b43c-d126c849023d',
        '65909adb-0efe-4743-b4a7-ca6e93d71c92',
        '013c0515-5f96-493f-bf5b-3d261350a4e6',
        '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
        '0883ba56-46a4-4420-8105-c9d17ad0183b',
        '02504510-b361-4fb3-878e-81925a76160f',
        '41a189ff-01f4-4018-b75c-3f363b65cc42',
        'b3a76739-4414-41d2-984e-e44bca6402c6',
        '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
        '2d1ada73-88e9-4cf4-a814-dcba8d517104',
        'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
        '1283ede6-414b-45a2-851a-1b113f26bffd'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300xx000000brO5AAI',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'recommendationFlow {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'recommendationFlow',
        lastModifiedBy: 'User User',
        lastModifiedDate: '2021-10-20T09:37:24.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'recommendationFlow',
        processType: 'RecommendationStrategy',
        runInMode: null,
        status: 'Active',
        versionNumber: 1,
        apiVersion: 54,
        isAutoLayoutCanvas: true,
        isOverridable: false,
        overriddenFlow: null,
        sourceTemplate: null,
        migratedFromWorkflowRuleName: null,
        environments: ['Default']
    }
};

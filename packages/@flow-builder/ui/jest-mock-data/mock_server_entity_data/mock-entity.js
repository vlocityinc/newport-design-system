export const mockEntities = [
    {
        "apiName":"AcceptedEventRelation",
        "deletable":false,
        "queryable":true,
        "updateable":false,
        "createable":false,
        "entityLabel": "Accepted Event Relation",
        "entityLabelPlural": "Accepted Event Relations",
    },
    {
        "apiName":"Account",
        "deletable":true,
        "queryable":true,
        "updateable":false,
        "createable":false,
        "entityLabel": "Account",
        "entityLabelPlural": "Accounts",        
    },
    {
        "apiName":"Contact",
        "deletable":false,
        "queryable":false,
        "updateable":true,
        "createable":false,
        "entityLabel": "Contact",
        "entityLabelPlural": "Contacts",        
    },
    {
        "apiName":"Case",
        "deletable":true,
        "queryable":true,
        "updateable":false,
        "createable":true,
        "entityLabel": "Case",
        "entityLabelPlural": "Cases",        
    },
    {
        "apiName":"Contract",
        "deletable":false,
        "queryable":false,
        "updateable":true,
        "createable":false,
        "entityLabel": "Contract",
        "entityLabelPlural": "Contracts",        
    },
];

export const mockEntitiesWithNoLabel = [
    {
        "apiName":"AcceptedEventRelation",
        "deletable":false,
        "queryable":true,
        "updateable":false,
        "createable":false,
    },
];

export const mockAccountFieldWithPicklist = {
    'AccountSource': {
        "filteredLookupInfo":null,
        "length":40,
        "editable":true,
        "nameField":false,
        "sortable":true,
        "filterable":true,
        "sobjectName":"Account",
        "picklistValues":[
            {
                "value":"Advertisement",
                "label":"Advertisement",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Employee Referral",
                "label":"Employee Referral",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"External Referral",
                "label":"External Referral",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Partner",
                "label":"Partner",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Public Relations",
                "label":"Public Relations",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Seminar - Internal",
                "label":"Seminar - Internal",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Seminar - Partner",
                "label":"Seminar - Partner",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Trade Show",
                "label":"Trade Show",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Web",
                "label":"Web",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Word of mouth",
                "label":"Word of mouth",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Other",
                "label":"Other",
                "validFor":null,
                "defaultValue":false,
                "active":true
            }
        ],
        "creatable":true,
        "compound":false,
        "calculated":false,
        "picklist":true,
        "controllerName":null,
        "relationshipName":null,
        "referenceToNames":[

        ],
        "extraTypeInfo":null,
        "activePicklistValues":[
            {
                "value":"Advertisement",
                "label":"Advertisement",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Employee Referral",
                "label":"Employee Referral",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"External Referral",
                "label":"External Referral",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Partner",
                "label":"Partner",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Public Relations",
                "label":"Public Relations",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Seminar - Internal",
                "label":"Seminar - Internal",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Seminar - Partner",
                "label":"Seminar - Partner",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Trade Show",
                "label":"Trade Show",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Web",
                "label":"Web",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Word of mouth",
                "label":"Word of mouth",
                "validFor":null,
                "defaultValue":false,
                "active":true
            },
            {
                "value":"Other",
                "label":"Other",
                "validFor":null,
                "defaultValue":false,
                "active":true
            }
        ],
        "htmlformula":false,
        "unique":false,
        "externalId":false,
        "autoNumber":false,
        "createdBy":false,
        "lastModifiedBy":false,
        "defaultedOnCreate":false,
        "currencyIsoCode":false,
        "highScaleNumber":false,
        "referenceTargetField":null,
        "inlineHelpText":null,
        "calculatedFormula":null,
        "relationshipOrder":null,
        "reference":false,
        "label":"Account Source",
        "required":false,
        "compoundFieldName":null,
        "scale":0,
        "dataType":"Picklist",
        "apiName":"AccountSource",
        "precision":0,
        "custom":false,
        "collection":false,
    },
}

export const mockAccountFields = {
    "LastModifiedDate": {
        "label": "Last Modified Date",
        "apiName": "LastModifiedDate",
        "sortable": true,
        "filterable": true,
        "dataType": "DateTime",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "ShippingLatitude": {
        "label": "Shipping Latitude",
        "apiName": "ShippingLatitude",
        "sortable": true,
        "filterable": true,
        "dataType": "Number",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "Description": {
        "label": "Account Description",
        "apiName": "Description",
        "sortable": false,
        "filterable": false,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "BillingCity": {
        "label": "Billing City",
        "apiName": "BillingCity",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "JigsawCompanyId": {
        "label": "Jigsaw Company ID",
        "apiName": "JigsawCompanyId",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "Website": {
        "label": "Website",
        "apiName": "Website",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "LastReferencedDate": {
        "label": "Last Referenced Date",
        "apiName": "LastReferencedDate",
        "sortable": true,
        "filterable": true,
        "dataType": "DateTime",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "BillingLatitude": {
        "label": "Billing Latitude",
        "apiName": "BillingLatitude",
        "sortable": true,
        "filterable": true,
        "dataType": "Number",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
    },
    "NumberOfEmployees": {
        "label": "Employees",
        "apiName": "NumberOfEmployees",
        "sortable": true,
        "filterable": true,
        "dataType": "Number",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "Name": {
        "label": "Account Name",
        "apiName": "Name",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "BillingAddress": {
        "label": "Billing Address",
        "apiName": "BillingAddress",
        "sortable": false,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "Industry": {
        "label": "Industry",
        "apiName": "Industry",
        "sortable": true,
        "filterable": true,
        "dataType": "Picklist",
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
        "activePicklistValues": [
            {
                "value": "Agriculture",
                "label": "Agriculture",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Apparel",
                "label": "Apparel",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Banking",
                "label": "Banking",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Biotechnology",
                "label": "Biotechnology",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Chemicals",
                "label": "Chemicals",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Communications",
                "label": "Communications",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Construction",
                "label": "Construction",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Consulting",
                "label": "Consulting",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Education",
                "label": "Education",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Electronics",
                "label": "Electronics",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Energy",
                "label": "Energy",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Engineering",
                "label": "Engineering",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Entertainment",
                "label": "Entertainment",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Environmental",
                "label": "Environmental",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Finance",
                "label": "Finance",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Food & Beverage",
                "label": "Food & Beverage",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Government",
                "label": "Government",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Healthcare",
                "label": "Healthcare",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Hospitality",
                "label": "Hospitality",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Insurance",
                "label": "Insurance",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Machinery",
                "label": "Machinery",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Manufacturing",
                "label": "Manufacturing",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Media",
                "label": "Media",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Not For Profit",
                "label": "Not For Profit",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Other",
                "label": "Other",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Recreation",
                "label": "Recreation",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Retail",
                "label": "Retail",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Shipping",
                "label": "Shipping",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Technology",
                "label": "Technology",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Telecommunications",
                "label": "Telecommunications",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Transportation",
                "label": "Transportation",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Utilities",
                "label": "Utilities",
                "validFor": null,
                "active": true,
                "defaultValue": false
            }
        ]
    },
    "CreatedById": {
        "label": "Created By ID",
        "apiName": "CreatedById",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "OwnerId": {
        "label": "Owner ID",
        "apiName": "OwnerId",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "BillingLongitude": {
        "label": "Billing Longitude",
        "apiName": "BillingLongitude",
        "sortable": true,
        "filterable": true,
        "dataType": "Number",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "Phone": {
        "label": "Account Phone",
        "apiName": "Phone",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "AccountSource": {
        "collection":false,
        "label": "Account Source",
        "apiName": "AccountSource",
        "sortable": true,
        "filterable": true,
        "dataType": "Picklist",
        "sobjectName": "Account",
        "editable": false,
        "creatable": false,
        "activePicklistValues": [
            {
                "value": "Advertisement",
                "label": "Advertisement",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Employee Referral",
                "label": "Employee Referral",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "External Referral",
                "label": "External Referral",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Partner",
                "label": "Partner",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Public Relations",
                "label": "Public Relations",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Seminar - Internal",
                "label": "Seminar - Internal",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Seminar - Partner",
                "label": "Seminar - Partner",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Trade Show",
                "label": "Trade Show",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Web",
                "label": "Web",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Word of mouth",
                "label": "Word of mouth",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Other",
                "label": "Other",
                "validFor": null,
                "active": true,
                "defaultValue": false
            }
        ]
    },
    "BillingGeocodeAccuracy": {
        "collection":false,
        "label": "Billing Geocode Accuracy",
        "apiName": "BillingGeocodeAccuracy",
        "sortable": true,
        "filterable": true,
        "dataType": "Picklist",
        "editable": false,
        "creatable": true,
        "activePicklistValues": [
            {
                "value": "Address",
                "label": "Address",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "NearAddress",
                "label": "NearAddress",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Block",
                "label": "Block",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Street",
                "label": "Street",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "ExtendedZip",
                "label": "ExtendedZip",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Zip",
                "label": "Zip",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Neighborhood",
                "label": "Neighborhood",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "City",
                "label": "City",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "County",
                "label": "County",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "State",
                "label": "State",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Unknown",
                "label": "Unknown",
                "validFor": null,
                "active": true,
                "defaultValue": false
            }
        ]
    },
    "ShippingCountry": {
        "label": "Shipping Country",
        "apiName": "ShippingCountry",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "BillingPostalCode": {
        "label": "Billing Zip/Postal Code",
        "apiName": "BillingPostalCode",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "editable": false,
        "creatable": true,
    },
    "ShippingCity": {
        "label": "Shipping City",
        "apiName": "ShippingCity",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "PhotoUrl": {
        "label": "Photo URL",
        "apiName": "PhotoUrl",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "MasterRecordId": {
        "label": "Master Record ID",
        "apiName": "MasterRecordId",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "ParentId": {
        "label": "Parent Account ID",
        "apiName": "ParentId",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "IsDeleted": {
        "label": "Deleted",
        "apiName": "IsDeleted",
        "sortable": true,
        "filterable": true,
        "dataType": "Boolean",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "LastViewedDate": {
        "label": "Last Viewed Date",
        "apiName": "LastViewedDate",
        "sortable": true,
        "filterable": true,
        "dataType": "DateTime",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "ShippingGeocodeAccuracy": {
        "collection":false,
        "label": "Shipping Geocode Accuracy",
        "apiName": "ShippingGeocodeAccuracy",
        "sortable": true,
        "filterable": true,
        "dataType": "Picklist",
        "sobjectName": "Account",
        "editable": false,
        "creatable": true,
        "activePicklistValues": [
            {
                "value": "Address",
                "label": "Address",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "NearAddress",
                "label": "NearAddress",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Block",
                "label": "Block",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Street",
                "label": "Street",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "ExtendedZip",
                "label": "ExtendedZip",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Zip",
                "label": "Zip",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Neighborhood",
                "label": "Neighborhood",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "City",
                "label": "City",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "County",
                "label": "County",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "State",
                "label": "State",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Unknown",
                "label": "Unknown",
                "validFor": null,
                "active": true,
                "defaultValue": false
            }
        ]
    },
    "ShippingStreet": {
        "label": "Shipping Street",
        "apiName": "ShippingStreet",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "SystemModstamp": {
        "label": "System Modstamp",
        "apiName": "SystemModstamp",
        "sortable": true,
        "filterable": true,
        "dataType": "DateTime",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "Type": {
        "collection":false,
        "label": "Account Type",
        "apiName": "Type",
        "sortable": true,
        "filterable": true,
        "dataType": "Picklist",
        "sobjectName": "Account",
        "editable": false,
        "creatable": true,
        "activePicklistValues": [
            {
                "value": "Analyst",
                "label": "Analyst",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Competitor",
                "label": "Competitor",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Customer",
                "label": "Customer",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Integrator",
                "label": "Integrator",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Investor",
                "label": "Investor",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Partner",
                "label": "Partner",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Press",
                "label": "Press",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Prospect",
                "label": "Prospect",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Reseller",
                "label": "Reseller",
                "validFor": null,
                "active": true,
                "defaultValue": false
            },
            {
                "value": "Other",
                "label": "Other",
                "validFor": null,
                "active": true,
                "defaultValue": false
            }
        ]
    },
    "BillingCountry": {
        "label": "Billing Country",
        "apiName": "BillingCountry",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "BillingStreet": {
        "label": "Billing Street",
        "apiName": "BillingStreet",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "ShippingAddress": {
        "label": "Shipping Address",
        "apiName": "ShippingAddress",
        "sortable": false,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "ShippingPostalCode": {
        "label": "Shipping Zip/Postal Code",
        "apiName": "ShippingPostalCode",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "CreatedDate": {
        "label": "Created Date",
        "apiName": "CreatedDate",
        "sortable": true,
        "filterable": true,
        "dataType": "DateTime",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "LastActivityDate": {
        "label": "Last Activity",
        "apiName": "LastActivityDate",
        "sortable": true,
        "filterable": true,
        "dataType": "Date",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "ShippingState": {
        "label": "Shipping State/Province",
        "apiName": "ShippingState",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "Id": {
        "label": "Account ID",
        "apiName": "Id",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "SicDesc": {
        "label": "SIC Description",
        "apiName": "SicDesc",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "Fax": {
        "label": "Account Fax",
        "apiName": "Fax",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "LastModifiedById": {
        "label": "Last Modified By ID",
        "apiName": "LastModifiedById",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": true,
        "creatable": true,
    },
    "AnnualRevenue": {
        "label": "Annual Revenue",
        "apiName": "AnnualRevenue",
        "sortable": true,
        "filterable": true,
        "dataType": "Currency",
        "sobjectName": "Account",
        "activePicklistValues": null,
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "BillingState": {
        "label": "Billing State/Province",
        "apiName": "BillingState",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "ShippingLongitude": {
        "label": "Shipping Longitude",
        "apiName": "ShippingLongitude",
        "sortable": true,
        "filterable": true,
        "dataType": "Number",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    },
    "Jigsaw": {
        "label": "Data.com Key",
        "apiName": "Jigsaw",
        "sortable": true,
        "filterable": true,
        "dataType": "String",
        "activePicklistValues": null,
        "sobjectName": "Account",
        "collection":false,
        "editable": false,
        "creatable": true,
    }
};
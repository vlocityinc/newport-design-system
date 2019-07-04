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

// as returned by getEntityFields
export const mockAccountFields = {
    "AccountSource": {
      "filterable": true,
      "apiName": "AccountSource",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Picklist",
      "label": "Account Source",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [
        {
          "label": "Advertisement",
          "value": "Advertisement"
        },
        {
          "label": "Employee Referral",
          "value": "Employee Referral"
        },
        {
          "label": "External Referral",
          "value": "External Referral"
        },
        {
          "label": "Partner",
          "value": "Partner"
        },
        {
          "label": "Public Relations",
          "value": "Public Relations"
        },
        {
          "label": "Seminar - Internal",
          "value": "Seminar - Internal"
        },
        {
          "label": "Seminar - Partner",
          "value": "Seminar - Partner"
        },
        {
          "label": "Trade Show",
          "value": "Trade Show"
        },
        {
          "label": "Web",
          "value": "Web"
        },
        {
          "label": "Word of mouth",
          "value": "Word of mouth"
        },
        {
          "label": "Other",
          "value": "Other"
        }
      ],
      "isPolymorphic": false,
      "isCustom": false
    },
    "AnnualRevenue": {
      "filterable": true,
      "apiName": "AnnualRevenue",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Currency",
      "label": "Annual Revenue",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingAddress": {
      "filterable": true,
      "apiName": "BillingAddress",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "String",
      "label": "Billing Address",
      "sortable": false,
      "creatable": false,
      "isCompound": true,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingCity": {
      "filterable": true,
      "apiName": "BillingCity",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Billing City",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingCountry": {
      "filterable": true,
      "apiName": "BillingCountry",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Billing Country",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingGeocodeAccuracy": {
      "filterable": true,
      "apiName": "BillingGeocodeAccuracy",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Picklist",
      "label": "Billing Geocode Accuracy",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [
        {
          "label": "Address",
          "value": "Address"
        },
        {
          "label": "NearAddress",
          "value": "NearAddress"
        },
        {
          "label": "Block",
          "value": "Block"
        },
        {
          "label": "Street",
          "value": "Street"
        },
        {
          "label": "ExtendedZip",
          "value": "ExtendedZip"
        },
        {
          "label": "Zip",
          "value": "Zip"
        },
        {
          "label": "Neighborhood",
          "value": "Neighborhood"
        },
        {
          "label": "City",
          "value": "City"
        },
        {
          "label": "County",
          "value": "County"
        },
        {
          "label": "State",
          "value": "State"
        },
        {
          "label": "Unknown",
          "value": "Unknown"
        }
      ],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingLatitude": {
      "filterable": true,
      "apiName": "BillingLatitude",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Number",
      "label": "Billing Latitude",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingLongitude": {
      "filterable": true,
      "apiName": "BillingLongitude",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Number",
      "label": "Billing Longitude",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingPostalCode": {
      "filterable": true,
      "apiName": "BillingPostalCode",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Billing Zip/Postal Code",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingState": {
      "filterable": true,
      "apiName": "BillingState",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Billing State/Province",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "BillingStreet": {
      "filterable": true,
      "apiName": "BillingStreet",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Billing Street",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "CloneSourceId": {
      "filterable": true,
      "apiName": "CloneSourceId",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "String",
      "label": "Clone Source",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": false,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "CreatedById": {
      "filterable": true,
      "apiName": "CreatedById",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": true,
      "editable": false,
      "dataType": "String",
      "label": "Created By ID",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": "CreatedBy",
      "isAvailableForMerge": true,
      "referenceToNames": [
        "User"
      ],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "CreatedDate": {
      "filterable": true,
      "apiName": "CreatedDate",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "DateTime",
      "label": "Created Date",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Description": {
      "filterable": false,
      "apiName": "Description",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Account Description",
      "sortable": false,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Fax": {
      "filterable": true,
      "apiName": "Fax",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Account Fax",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Id": {
      "filterable": true,
      "apiName": "Id",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "String",
      "label": "Account ID",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Industry": {
      "filterable": true,
      "apiName": "Industry",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Picklist",
      "label": "Industry",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [
        {
          "label": "Agriculture",
          "value": "Agriculture"
        },
        {
          "label": "Apparel",
          "value": "Apparel"
        },
        {
          "label": "Banking",
          "value": "Banking"
        },
        {
          "label": "Biotechnology",
          "value": "Biotechnology"
        },
        {
          "label": "Chemicals",
          "value": "Chemicals"
        },
        {
          "label": "Communications",
          "value": "Communications"
        },
        {
          "label": "Construction",
          "value": "Construction"
        },
        {
          "label": "Consulting",
          "value": "Consulting"
        },
        {
          "label": "Education",
          "value": "Education"
        },
        {
          "label": "Electronics",
          "value": "Electronics"
        },
        {
          "label": "Energy",
          "value": "Energy"
        },
        {
          "label": "Engineering",
          "value": "Engineering"
        },
        {
          "label": "Entertainment",
          "value": "Entertainment"
        },
        {
          "label": "Environmental",
          "value": "Environmental"
        },
        {
          "label": "Finance",
          "value": "Finance"
        },
        {
          "label": "Food & Beverage",
          "value": "Food & Beverage"
        },
        {
          "label": "Government",
          "value": "Government"
        },
        {
          "label": "Healthcare",
          "value": "Healthcare"
        },
        {
          "label": "Hospitality",
          "value": "Hospitality"
        },
        {
          "label": "Insurance",
          "value": "Insurance"
        },
        {
          "label": "Machinery",
          "value": "Machinery"
        },
        {
          "label": "Manufacturing",
          "value": "Manufacturing"
        },
        {
          "label": "Media",
          "value": "Media"
        },
        {
          "label": "Not For Profit",
          "value": "Not For Profit"
        },
        {
          "label": "Other",
          "value": "Other"
        },
        {
          "label": "Recreation",
          "value": "Recreation"
        },
        {
          "label": "Retail",
          "value": "Retail"
        },
        {
          "label": "Shipping",
          "value": "Shipping"
        },
        {
          "label": "Technology",
          "value": "Technology"
        },
        {
          "label": "Telecommunications",
          "value": "Telecommunications"
        },
        {
          "label": "Transportation",
          "value": "Transportation"
        },
        {
          "label": "Utilities",
          "value": "Utilities"
        }
      ],
      "isPolymorphic": false,
      "isCustom": false
    },
    "IsDeleted": {
      "filterable": true,
      "apiName": "IsDeleted",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "Boolean",
      "label": "Deleted",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": null,
      "isAvailableForMerge": false,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Jigsaw": {
      "filterable": true,
      "apiName": "Jigsaw",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Data.com Key",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "JigsawCompanyId": {
      "filterable": true,
      "apiName": "JigsawCompanyId",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "String",
      "label": "Jigsaw Company ID",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": "JigsawCompany",
      "isAvailableForMerge": false,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "LastActivityDate": {
      "filterable": true,
      "apiName": "LastActivityDate",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "Date",
      "label": "Last Activity",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "LastModifiedById": {
      "filterable": true,
      "apiName": "LastModifiedById",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": true,
      "editable": false,
      "dataType": "String",
      "label": "Last Modified By ID",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": "LastModifiedBy",
      "isAvailableForMerge": true,
      "referenceToNames": [
        "User"
      ],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "LastModifiedDate": {
      "filterable": true,
      "apiName": "LastModifiedDate",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "DateTime",
      "label": "Last Modified Date",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "LastReferencedDate": {
      "filterable": true,
      "apiName": "LastReferencedDate",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "DateTime",
      "label": "Last Referenced Date",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": false,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "LastViewedDate": {
      "filterable": true,
      "apiName": "LastViewedDate",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "DateTime",
      "label": "Last Viewed Date",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": false,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "MasterRecordId": {
      "filterable": true,
      "apiName": "MasterRecordId",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": true,
      "editable": false,
      "dataType": "String",
      "label": "Master Record ID",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": "MasterRecord",
      "isAvailableForMerge": false,
      "referenceToNames": [
        "Account"
      ],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Name": {
      "filterable": true,
      "apiName": "Name",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Account Name",
      "sortable": true,
      "creatable": true,
      "isCompound": true,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "NumberOfEmployees": {
      "filterable": true,
      "apiName": "NumberOfEmployees",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Number",
      "label": "Employees",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "OwnerId": {
      "filterable": true,
      "apiName": "OwnerId",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": true,
      "editable": true,
      "dataType": "String",
      "label": "Owner ID",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": "Owner",
      "isAvailableForMerge": true,
      "referenceToNames": [
        "User"
      ],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ParentId": {
      "filterable": true,
      "apiName": "ParentId",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": true,
      "editable": true,
      "dataType": "String",
      "label": "Parent Account ID",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": "Parent",
      "isAvailableForMerge": true,
      "referenceToNames": [
        "Account"
      ],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Phone": {
      "filterable": true,
      "apiName": "Phone",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Account Phone",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "PhotoUrl": {
      "filterable": true,
      "apiName": "PhotoUrl",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "String",
      "label": "Photo URL",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": false,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingAddress": {
      "filterable": true,
      "apiName": "ShippingAddress",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "String",
      "label": "Shipping Address",
      "sortable": false,
      "creatable": false,
      "isCompound": true,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingCity": {
      "filterable": true,
      "apiName": "ShippingCity",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Shipping City",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingCountry": {
      "filterable": true,
      "apiName": "ShippingCountry",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Shipping Country",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingGeocodeAccuracy": {
      "filterable": true,
      "apiName": "ShippingGeocodeAccuracy",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Picklist",
      "label": "Shipping Geocode Accuracy",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [
        {
          "label": "Address",
          "value": "Address"
        },
        {
          "label": "NearAddress",
          "value": "NearAddress"
        },
        {
          "label": "Block",
          "value": "Block"
        },
        {
          "label": "Street",
          "value": "Street"
        },
        {
          "label": "ExtendedZip",
          "value": "ExtendedZip"
        },
        {
          "label": "Zip",
          "value": "Zip"
        },
        {
          "label": "Neighborhood",
          "value": "Neighborhood"
        },
        {
          "label": "City",
          "value": "City"
        },
        {
          "label": "County",
          "value": "County"
        },
        {
          "label": "State",
          "value": "State"
        },
        {
          "label": "Unknown",
          "value": "Unknown"
        }
      ],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingLatitude": {
      "filterable": true,
      "apiName": "ShippingLatitude",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Number",
      "label": "Shipping Latitude",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingLongitude": {
      "filterable": true,
      "apiName": "ShippingLongitude",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Number",
      "label": "Shipping Longitude",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingPostalCode": {
      "filterable": true,
      "apiName": "ShippingPostalCode",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Shipping Zip/Postal Code",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingState": {
      "filterable": true,
      "apiName": "ShippingState",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Shipping State/Province",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "ShippingStreet": {
      "filterable": true,
      "apiName": "ShippingStreet",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Shipping Street",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "SicDesc": {
      "filterable": true,
      "apiName": "SicDesc",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "SIC Description",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "SystemModstamp": {
      "filterable": true,
      "apiName": "SystemModstamp",
      "isAvailableForFormulas": false,
      "isSpanningAllowed": false,
      "editable": false,
      "dataType": "DateTime",
      "label": "System Modstamp",
      "sortable": true,
      "creatable": false,
      "isCompound": false,
      "sobjectName": "Account",
      "required": true,
      "relationshipName": null,
      "isAvailableForMerge": false,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Type": {
      "filterable": true,
      "apiName": "Type",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "Picklist",
      "label": "Account Type",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [
        {
          "label": "Analyst",
          "value": "Analyst"
        },
        {
          "label": "Competitor",
          "value": "Competitor"
        },
        {
          "label": "Customer",
          "value": "Customer"
        },
        {
          "label": "Integrator",
          "value": "Integrator"
        },
        {
          "label": "Investor",
          "value": "Investor"
        },
        {
          "label": "Partner",
          "value": "Partner"
        },
        {
          "label": "Press",
          "value": "Press"
        },
        {
          "label": "Prospect",
          "value": "Prospect"
        },
        {
          "label": "Reseller",
          "value": "Reseller"
        },
        {
          "label": "Other",
          "value": "Other"
        }
      ],
      "isPolymorphic": false,
      "isCustom": false
    },
    "Website": {
      "filterable": true,
      "apiName": "Website",
      "isAvailableForFormulas": true,
      "isSpanningAllowed": false,
      "editable": true,
      "dataType": "String",
      "label": "Website",
      "sortable": true,
      "creatable": true,
      "isCompound": false,
      "sobjectName": "Account",
      "required": false,
      "relationshipName": null,
      "isAvailableForMerge": true,
      "referenceToNames": [],
      "activePicklistValues": [],
      "isPolymorphic": false,
      "isCustom": false
    }
  };

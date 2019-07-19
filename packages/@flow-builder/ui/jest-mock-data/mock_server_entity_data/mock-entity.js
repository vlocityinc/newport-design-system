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
      "editable": true,
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
      "dataType": "Picklist",
      "label": "Account Source",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "AnnualRevenue": {
      "filterable": true,
      "apiName": "AnnualRevenue",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "Currency",
      "label": "Annual Revenue",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "BillingAddress": {
      "filterable": true,
      "apiName": "BillingAddress",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Billing Address",
      "sortable": false,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "BillingCity": {
      "filterable": true,
      "apiName": "BillingCity",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Billing City",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "BillingCountry": {
      "filterable": true,
      "apiName": "BillingCountry",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Billing Country",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "BillingGeocodeAccuracy": {
      "filterable": true,
      "apiName": "BillingGeocodeAccuracy",
      "editable": true,
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
      "dataType": "Picklist",
      "label": "Billing Geocode Accuracy",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "BillingLatitude": {
      "filterable": true,
      "apiName": "BillingLatitude",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "Number",
      "label": "Billing Latitude",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "BillingLongitude": {
      "filterable": true,
      "apiName": "BillingLongitude",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "Number",
      "label": "Billing Longitude",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "BillingPostalCode": {
      "filterable": true,
      "apiName": "BillingPostalCode",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Billing Zip/Postal Code",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "BillingState": {
      "filterable": true,
      "apiName": "BillingState",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Billing State/Province",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "BillingStreet": {
      "filterable": true,
      "apiName": "BillingStreet",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Billing Street",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "CloneSourceId": {
      "filterable": true,
      "apiName": "CloneSourceId",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Clone Source",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "CreatedById": {
      "filterable": true,
      "apiName": "CreatedById",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Created By ID",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": true
    },
    "CreatedDate": {
      "filterable": true,
      "apiName": "CreatedDate",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "DateTime",
      "label": "Created Date",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": true
    },
    "Description": {
      "filterable": false,
      "apiName": "Description",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Account Description",
      "sortable": false,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "Fax": {
      "filterable": true,
      "apiName": "Fax",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Account Fax",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "Id": {
      "filterable": true,
      "apiName": "Id",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Account ID",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": true
    },
    "Industry": {
      "filterable": true,
      "apiName": "Industry",
      "editable": true,
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
      "dataType": "Picklist",
      "label": "Industry",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "IsDeleted": {
      "filterable": true,
      "apiName": "IsDeleted",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "Boolean",
      "label": "Deleted",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": true
    },
    "Jigsaw": {
      "filterable": true,
      "apiName": "Jigsaw",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Data.com Key",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "JigsawCompanyId": {
      "filterable": true,
      "apiName": "JigsawCompanyId",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Jigsaw Company ID",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "LastActivityDate": {
      "filterable": true,
      "apiName": "LastActivityDate",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "Date",
      "label": "Last Activity",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "LastModifiedById": {
      "filterable": true,
      "apiName": "LastModifiedById",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Last Modified By ID",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": true
    },
    "LastModifiedDate": {
      "filterable": true,
      "apiName": "LastModifiedDate",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "DateTime",
      "label": "Last Modified Date",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": true
    },
    "LastReferencedDate": {
      "filterable": true,
      "apiName": "LastReferencedDate",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "DateTime",
      "label": "Last Referenced Date",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "LastViewedDate": {
      "filterable": true,
      "apiName": "LastViewedDate",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "DateTime",
      "label": "Last Viewed Date",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "MasterRecordId": {
      "filterable": true,
      "apiName": "MasterRecordId",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Master Record ID",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "Name": {
      "filterable": true,
      "apiName": "Name",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Account Name",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": true
    },
    "NumberOfEmployees": {
      "filterable": true,
      "apiName": "NumberOfEmployees",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "Number",
      "label": "Employees",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "OwnerId": {
      "filterable": true,
      "apiName": "OwnerId",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Owner ID",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": true
    },
    "ParentId": {
      "filterable": true,
      "apiName": "ParentId",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Parent Account ID",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "Phone": {
      "filterable": true,
      "apiName": "Phone",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Account Phone",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "PhotoUrl": {
      "filterable": true,
      "apiName": "PhotoUrl",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Photo URL",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingAddress": {
      "filterable": true,
      "apiName": "ShippingAddress",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Shipping Address",
      "sortable": false,
      "creatable": false,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingCity": {
      "filterable": true,
      "apiName": "ShippingCity",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Shipping City",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingCountry": {
      "filterable": true,
      "apiName": "ShippingCountry",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Shipping Country",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingGeocodeAccuracy": {
      "filterable": true,
      "apiName": "ShippingGeocodeAccuracy",
      "editable": true,
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
      "dataType": "Picklist",
      "label": "Shipping Geocode Accuracy",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingLatitude": {
      "filterable": true,
      "apiName": "ShippingLatitude",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "Number",
      "label": "Shipping Latitude",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingLongitude": {
      "filterable": true,
      "apiName": "ShippingLongitude",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "Number",
      "label": "Shipping Longitude",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingPostalCode": {
      "filterable": true,
      "apiName": "ShippingPostalCode",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Shipping Zip/Postal Code",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingState": {
      "filterable": true,
      "apiName": "ShippingState",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Shipping State/Province",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "ShippingStreet": {
      "filterable": true,
      "apiName": "ShippingStreet",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Shipping Street",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "SicDesc": {
      "filterable": true,
      "apiName": "SicDesc",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "SIC Description",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "SystemModstamp": {
      "filterable": true,
      "apiName": "SystemModstamp",
      "editable": false,
      "activePicklistValues": [],
      "dataType": "DateTime",
      "label": "System Modstamp",
      "sortable": true,
      "creatable": false,
      "sobjectName": "Account",
      "required": true
    },
    "Type": {
      "filterable": true,
      "apiName": "Type",
      "editable": true,
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
      "dataType": "Picklist",
      "label": "Account Type",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    },
    "Website": {
      "filterable": true,
      "apiName": "Website",
      "editable": true,
      "activePicklistValues": [],
      "dataType": "String",
      "label": "Website",
      "sortable": true,
      "creatable": true,
      "sobjectName": "Account",
      "required": false
    }
  };
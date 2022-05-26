declare module 'builder_platform_interaction/alc*';

declare namespace FieldInput {
    interface MenuSection {
        key: string;
        // we don't have a label when we have only one section
        label?: string;
        items: MenuItem[];
    }

    type MenuItemCategory = string;

    interface MenuItem {
        name: string;
        label: string;
        description?: string;

        // the view type to transition to when clicking on the item
        viewType: MenuItemViewType;

        dataType?: UI.Datatype;
        subtype?: string;

        value: string;
        // TODO: FF this is denormalized from MenuSection, should remove
        category?: MenuItemCategory;

        isCollection?: boolean;

        iconName?: string;
        iconAlternativeText?: string;
        iconSize?: string;
        iconShape?: string;
        iconBackgroundColor?: string;
    }

    // MenuContextItem is undefined only for 'All Resources'
    type MenuContextItem = MenuItem | undefined;

    type MenuSelectItemEventDetail = {
        item: MenuItem;
    };

    type MenuSelectItemEvent = CustomEvent<FieldInput.MenuSelectItemEventDetail>;

    type BreadcrumbClickEventDetail = {
        // index of the current breadcrumb clicked (0 based)
        index: number;
    };

    type BreadcrumbClickEvent = CustomEvent<FieldInput.BreadcrumbClickEventDetail>;

    type MenuInputBoxConfig = {
        labels: {
            inputLabel?: string;
            inputPlaceholder?: string;
        };
    };

    type Category =
        | 'Action'
        | 'Assignment'
        | 'Variable'
        | 'Collection'
        | 'RecordVariable'
        | 'RecordCollection'
        | 'ApexVariable'
        | 'ApexCollection'
        | 'Decision'
        | 'Choice'
        | 'Constant'
        | 'Formula'
        | 'Stage'
        | 'TextTemplate'
        | 'Loop'
        | 'Outcome'
        | 'RecordCreate'
        | 'RecordDelete'
        | 'RecordLookup'
        | 'RecordUpdate'
        | 'RollBack'
        | 'Screen'
        | 'Subflow'
        | 'Wait'
        | 'WaitEvent'
        | 'ScreenField'
        | 'OrchestratedStage'
        | 'StageStep'
        | 'Sort'
        | 'Filter'
        | 'Map';

    type Breadcrumb = {
        label: string;
        name: string;
        id: string;
        tooltip?: string;
    };

    type MenuItemViewType = 'All' | 'ObjectFields' | 'PicklistValues' | 'FlowElement' | 'None' | 'MenuItemViewTypeTbd';
    type MenuViewProps = AllViewProps | ObjectFieldsViewProps | PicklistValuesViewProps | MissingViewProps;

    type ViewProps = {
        ariaLabel: string;
    };

    type AllViewProps = {
        isAllView: true;
    } & ViewProps;

    type ObjectFieldsViewProps = {
        isObjectFieldsView: true;
        objectApiName: string;
    } & ViewProps;

    type PicklistValuesViewProps = {
        isPicklistValuesView: true;
        fieldApiName: string;
        recordTypeId: string;
    } & ViewProps;

    type MissingViewProps = {
        missingViewType: MenuItemViewType;
    };

    type MenuHeaderMode = 'allResources' | 'traversal' | 'resource' | 'entityFields';

    type IconSize = 'small' | 'x-small';

    type MenuItemIconInfo = {
        iconName?: string;
        iconAlternativeText?: string;
        iconSize?: IconSize; // do we need icon size?
        iconBackgroundColor?: string;
        iconShape?: string;
    };

    type EventType = {
        dataType: string;
        isRequired: boolean;
        label: string;
        qualifiedApiName: string;
    };

    type CategoryConfig = {
        label: string;
        isElementCategory?: boolean;
        hideFromFirstLevel?: boolean;
    };

    // from systemvariablesconstantlib
    type SystemAndGlobalVariableName =
        | '$Api'
        | '$Label'
        | '$Organization'
        | '$Permission'
        | '$Profile'
        | '$Setup'
        | '$System'
        | '$User'
        | '$UserRole'
        | '$Flow'
        | '$Client'
        | '$Orchestration'
        | '$Record'
        | '$Record__Prior';

    // from where?
    type GlobalConstantsName = '$GlobalConstant.True' | '$GlobalConstant.False' | '$GlobalConstant.EmptyString';
}

// TODO: define proper types here
// Should have the same shape as the ui-api's response
type GetObjectInfoApiData = {
    fields: [
        {
            label: string;
            apiName: string;
            dataType: string;
        }
    ];
};

// Should have the same shape as the ui-api's response
type GetPicklistValuesApiData = {
    values: [
        {
            label: string;
            value: string;
        }
    ];
};

type GetPicklistValuesApiConfig = {
    recordTypeId: string;
    fieldApiName: string;
};

type GetObjectInfoApiConfig = {
    objectApiName: string;
};

type ApiResponse<T> = { data?: T; error?: any };
type WirePromise<T> = Promise<ApiResponse<T>>;

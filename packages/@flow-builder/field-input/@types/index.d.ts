declare module 'builder_platform_interaction/alc*';

declare namespace FieldInput {
    interface MenuSection {
        key: string;
        // we don't have a label when we have only one section
        label?: string;
        items: MenuItem[];
    }

    type MenuItemCategory = string;

    interface MenuContextItem extends MenuItemView {
        label?: string;
        name?: string;
    }

    interface MenuItem<V extends MenuItemView | undefined = MenuItemView> {
        name: string;
        label: string;
        description?: string;

        // TODO: try to get rid of these 3 fields
        dataType?: UI.Datatype;
        subtype?: string;
        value: string;

        // TODO: FF this is denormalized from MenuSection, should remove
        category?: MenuItemCategory;

        // TODO: try to get rid of this
        isCollection?: boolean;

        iconName?: string;
        iconAlternativeText?: string;
        iconSize?: string;
        iconShape?: IconShape;
        iconBackgroundColor?: string;

        // the view to transition to when clicking on the item, or undefined if none
        view?: V;
    }

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
        id: string;
        label: string;
        tooltip?: string;
    };

    type MenuItemViewType = 'All' | 'ObjectFields' | 'PicklistValues' | 'FlowElement' | 'MenuItemViewTypeTbd';
    interface MenuItemView {
        type: MenuItemViewType;
    }

    interface MenuItemViewAll extends MenuItemView {
        type: 'All';
    }

    interface MenuItemViewTBD extends MenuItemView {
        type: 'MenuItemViewTypeTbd';
    }

    interface MenuItemViewFlowElement extends MenuItemView {
        type: 'FlowElement';
    }

    interface MenuItemViewObjectFields extends MenuItemView {
        type: 'ObjectFields';
        objectApiName: string;
    }

    interface MenuItemViewPicklistValues extends MenuItemView {
        type: 'PicklistValues';
        fieldApiName: string;
        recordTypeId: string;
    }

    type MenuHeaderMode = 'allResources' | 'traversal' | 'resource' | 'entityFields';
    type IconShape = string;

    type IconSize = 'small' | 'x-small';

    type MenuItemIconInfo = {
        iconName?: string;
        iconAlternativeText?: string;
        iconSize?: IconSize; // do we need icon size?
        iconBackgroundColor?: string;
        iconShape?: IconShape;
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
    type GlobalConstantsName =
        | '$GlobalConstant.True'
        | '$GlobalConstant.False'
        | '$GlobalConstant.EmptyString'
        | '$GlobalConstant.Null';
}

// TODO: define proper types here
// Should have the same shape as the ui-api's response
type GetObjectInfoApiData = {
    fields: {
        label: string;
        apiName: string;
        dataType: string;
    }[];
};

// Should have the same shape as the ui-api's response
type GetPicklistValuesApiData = {
    values: {
        label: string;
        value: string;
    }[];
};

type GetPicklistValuesApiConfig = {
    recordTypeId: string;
    fieldApiName: string;
};

type GetObjectInfoApiConfig = {
    objectApiName: string;
};

// shape returned by @wire decorators
type WireResponse<T> = { data: T | null; error?: any };

type WirePromise<T> = Promise<WireResponse<T>>;

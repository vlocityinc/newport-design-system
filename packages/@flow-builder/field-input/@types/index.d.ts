declare module 'builder_platform_interaction/alc*';

declare namespace FieldInput {
    type SortField = 'label' | 'name';

    type Option = UI.Option;
    type Options = UI.Options;

    type MenuConfig = Readonly<{
        newResourceTypeLabel?: string | null;
        traversalConfig?: MenuTraversalConfig;
        // the picklist values that will be appended to the menu data if picklist values are allowed
        activePicklistValues?: Options;
        filter: MenuFilter;
        sortField: SortField;
    }>;

    type MenuSection = Readonly<{
        name: Category | 'PicklistValues' | 'GlobalResources' | 'GlobalValues' | 'Constants' | 'ObjectFields';
        // we don't have a label when we only have one section
        label?: string;
        items: MenuItem[];
    }>;

    type MenuItemCategory = string;

    interface MenuContextItem extends MenuItemView {
        readonly label?: string;
        readonly name: string;
    }

    type MenuItem<V extends MenuItemView | undefined = MenuItemView> = Readonly<
        {
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

            // the view to transition to when clicking on the item, or undefined if none
            view?: V;
        } & MenuItemIconInfo
    >;

    type MenuInputBoxConfig = Readonly<{
        labels: Readonly<{
            inputLabel?: string;
            inputPlaceholder?: string;
        }>;
    }>;

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

    type Breadcrumb = Readonly<{
        id: string;
        label: string;
        tooltip?: string;
    }>;

    type MenuItemViewType =
        | 'All'
        | 'ObjectFields'
        | 'PicklistValues'
        | 'FlowElement'
        | 'Resources.Flow'
        | 'Resources.Organization'
        | 'Resources.Setup'
        | 'Resources.User'
        | 'Resources.UserRole'
        | 'Resources.Profile'
        | 'Resources.Api'
        | 'Resources.System'
        | 'Resources.Labels'
        | 'MenuItemViewTypeTbd';

    interface MenuItemView {
        readonly type: MenuItemViewType;
    }

    interface MenuItemViewAll extends MenuItemView {
        readonly type: 'All';
    }

    interface MenuItemViewTBD extends MenuItemView {
        readonly type: 'MenuItemViewTypeTbd';
    }

    interface MenuItemViewFlowElement extends MenuItemView {
        readonly type: 'FlowElement';
    }

    interface MenuItemViewObjectFields extends MenuItemView {
        readonly type: 'ObjectFields';
        objectApiName: string;
    }

    interface MenuItemViewPicklistValues extends MenuItemView {
        readonly type: 'PicklistValues';
        readonly fieldApiName: string;
        readonly recordTypeId: string;
    }

    type MenuHeaderMode = 'allResources' | 'traversal' | 'resource' | 'entityFields';
    type IconShape = string;

    type IconSize = 'small' | 'x-small';

    type MenuItemIconInfo = Readonly<
        IconInfo & {
            iconAlternativeText?: string;
            iconBackgroundColor?: string;
            iconShape?: IconShape;
        }
    >;

    type EventType = Readonly<{
        dataType: string;
        isRequired: boolean;
        label: string;
        qualifiedApiName: string;
    }>;

    type CategoryConfig = Readonly<{
        name: Category;
        label: string;
        isElementCategory?: boolean;
        hideFromFirstLevel?: boolean;
    }>;

    // from systemvariablesconstantlib
    type SystemAndGlobalVariableName =
        | '$Api'
        | '$Label'
        | '$Organization'
        //        | '$Permission'
        | '$Profile'
        | '$Setup'
        | '$System'
        | '$User'
        | '$UserRole'
        | '$Flow'
        //        | '$Client'
        //        | '$Orchestration';
        | '$Record'
        | '$Record__Prior';

    // from where?
    type GlobalConstantsName =
        | '$GlobalConstant.True'
        | '$GlobalConstant.False'
        | '$GlobalConstant.EmptyString'
        | '$GlobalConstant.Null';

    type FlowElement = UI.Element;
    type FlowElements = FlowElement[];

    type Context = Readonly<{
        flowElements: FlowElements;
    }>;

    type ShowMenuEventDetail = Readonly<{
        show: boolean;
    }>;

    type ShowMenuEvent = CustomEvent<ShowMenuEventDetail>;

    type MenuSelectItemEventDetail = Readonly<{
        item: MenuItem;
    }>;

    type MenuSelectItemEvent = CustomEvent<FieldInput.MenuSelectItemEventDetail>;

    type BreadcrumbClickEventDetail = {
        // index of the current breadcrumb clicked (0 based)
        index: number;
    };

    type BreadcrumbClickEvent = CustomEvent<FieldInput.BreadcrumbClickEventDetail>;
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

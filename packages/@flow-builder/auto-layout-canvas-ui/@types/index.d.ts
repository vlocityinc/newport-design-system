interface ConnectorMenuMetadata {
    menuComponent?: string;
    elementTypes: Set<string>;
    isSearchEnabled: boolean;
    isLoading: boolean;
    menuItems: ConnectorMenuItem[];
}

interface ConnectorMenuItem {
    guid: string;
    description: string;
    label: string;
    elementType: string;
    actionType: string;
    actionName: string;
    actionIsStandard: boolean;
    icon: string;
    iconSrc: string;
    iconContainerClass: string;
    iconClass: string;
    iconSize: string;
    iconVariant: string;
    rowClass: string;
    elementSubtype: string | null;
    tooltip: string;
    flowName: string;
}

interface MenuItem {
    guid: string;
    icon: string;
    iconContainerClass: string;
    iconClass: string;
    iconSize: string;
    iconVariant: string;
    label: string;
    elementType: string;
    rowClass: string;
    value?: string;
    dataType?: string;
    description?: string;

    // TODO: get rid of this
    actionType?: string;
    actionName?: string;
    elementSubtype?: string;
    tooltip?: string;
}

interface MenuSection {
    guid: string;
    heading: string | null;

    items: MenuItem[];
    label: string;

    // TODO: what is this?
    separator: boolean;
}

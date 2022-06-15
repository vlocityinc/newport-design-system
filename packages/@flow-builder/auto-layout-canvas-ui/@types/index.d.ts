interface ConnectorMenuMetadata {
    menuComponent?: string;
    elementTypes: Set<string>;
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
}

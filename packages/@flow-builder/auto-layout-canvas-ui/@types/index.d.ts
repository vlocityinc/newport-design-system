type Labels<T> = Record<keyof T, string>;

interface ConnectorMenuMetadata {
    menuComponent?: string;
    elementTypes: Set<string>;
}
interface MenuConstructor<T extends LightningElement> {
    new (): T;
    className: string;
}

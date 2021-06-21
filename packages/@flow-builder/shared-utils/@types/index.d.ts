declare module 'aura';

interface InvokeModalData {
    modalClass?: string;
    bodyClass?: string;
    footerClass?: string;
    headerClass?: string;
    flavor?: string;
    headerData: HeaderData;
    bodyData: BodyData;
    footerData: FooterData;
    closeCallback?: () => {};
}

interface HeaderData {
    headerTitle: string;
    headerVariant?: string;
}

interface BodyData {
    bodyTextOne: string;
    bodyVariant?: any;
    bodyTextTwo?: string;
    listSectionHeader?: string;
    listSectionItems?: any;
    listWarningItems?: any;
    showBodyTwoVariant?: string;
}

interface FooterData {
    buttonOne?: ModalButton;
    buttonTwo?: ModalButton;
    footerVariant?: string;
}

interface ModalButton {
    buttonLabel: string;
    buttonCallback?: () => void;
    buttonVariant?: string;
}

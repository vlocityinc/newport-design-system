import { LightningElement, api, track } from 'lwc';

import { LABELS } from './paletteLabels';

import AccordionSection from 'lightning/accordionSection';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';

const selectors = {
    accordionSection: 'lightning-accordion-section'
};
export default class Palette extends LightningElement {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api iconSize;
    @api showLocatorIcon;

    @api
    // eslint-disable-next-line @lwc/lwc/valid-api
    get data() {
        return this.original;
    }

    set data(items) {
        this.original = items;
        this.init();
    }

    @api
    get itemsDraggable() {
        return this.draggableItems;
    }

    set itemsDraggable(value) {
        this.draggableItems = `${value}` === 'true';
    }

    @api
    get detailsButton() {
        return this.showResourceDetails;
    }

    set detailsButton(value) {
        this.showResourceDetails = `${value}` === 'true';
    }

    get enableLocator() {
        return this.showLocatorIcon && this.showResourceDetails;
    }

    @track draggableItems = false;
    @track showResourceDetails = false;
    @track original = [];
    @track sections: any[] = [];
    @track activeSections: string[] = [];

    labels = LABELS;

    newSections: string[] = [];

    init() {
        this.activeSections = [...this.activeSections];
        this.sections = this.original.map((section) => this.augmentSection(section));
    }

    /**
     * Augments the section information
     *
     * @param section - A section
     * @returns the augmented section
     */
    augmentSection(section) {
        const visibleItems = section._children.length;

        const augmentedSection = {
            ...section,
            // TODO: fix using label as guid by changing resourceLib.getElementSectionsFromElementMap so that it returns a stable
            // guid for a section. Right now it changes on each render.
            guid: section.label,
            // TODO: Might not be good for i18n.
            label: section.label + ' (' + visibleItems + ')'
        };

        // initially display sections in the open state
        const isNewSection = !this.sections.find((existingSection) => existingSection.guid === augmentedSection.guid);

        if (isNewSection) {
            this.activeSections.push(augmentedSection.guid);
            this.newSections.push(augmentedSection.guid);
        }

        return augmentedSection;
    }

    /**
     * Opens sections that have been added since the last render
     */
    openNewSections() {
        // @W-10154226: Ugly shadowRoot workaround to open sections added dynamically.
        // The lightning-accordion component doesn't currently support that via its api.
        // (lightning-accordion-section.test.ts tests this dependency)
        this.dom.all.accordionSection
            .filter((section: AccordionSection) => this.newSections.find((name) => name === section.name))
            .forEach((section: AccordionSection) => section.shadowRoot.querySelector('button.section-control').click());

        this.newSections = [];
    }

    renderedCallback() {
        this.openNewSections();
    }

    /**
     * Handler for the sectiontoggle event
     *
     * @param event - The accordion sectiontoggle event
     */
    handleSectionToggle(event: CustomEvent) {
        const openSections = event.detail.openSections;
        this.activeSections = [...openSections];
    }
}

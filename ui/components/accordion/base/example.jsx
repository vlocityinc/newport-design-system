// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import {
  Section,
  SectionContent,
  SectionTitle,
  SectionTitleAction
} from '../../expandable-section/base/example';

const referenceId01 = 'accordion-details-01';
const referenceId02 = 'accordion-details-02';
const referenceId03 = 'accordion-details-03';

let Accordion = props => (
  <ul className={classNames('nds-accordion', props.className)}>
    {props.children}
  </ul>
);

let AccordionSection = props => (
  <li className="nds-accordion__list-item">
    <section
      className={classNames(
        'nds-accordion__section',
        props.isOpen ? 'nds-is-open' : null
      )}
    >
      <div className={classNames('nds-accordion__summary', props.className)}>
        <h3
          className={classNames(
            'nds-text-heading_small nds-accordion__summary-heading',
            props.className
          )}
        >
          <button
            aria-controls={props.referenceId}
            aria-expanded={props.isOpen}
            className="nds-button nds-button_reset nds-accordion__summary-action"
          >
            <SvgIcon
              className="nds-accordion__summary-action-icon nds-button__icon nds-button__icon_left"
              sprite="utility"
              symbol="switch"
            />
            <span className="nds-truncate" title={props.summary}>
              {props.summary}
            </span>
          </button>
        </h3>
        <button
          className="nds-button nds-button_icon nds-button_icon-border-filled nds-button_icon-x-small nds-shrink-none"
          aria-haspopup="true"
        >
          <SvgIcon
            className="nds-button__icon"
            sprite="utility"
            symbol="down"
          />
          <span className="nds-assistive-text">More Options</span>
        </button>
      </div>
      <div
        aria-hidden={!props.isOpen}
        className={classNames('nds-accordion__content', props.className)}
        id={props.referenceId}
      >
        {props.children}
      </div>
    </section>
  </li>
);

export default (
  <Accordion>
    <AccordionSection
      summary="Accordion summary"
      isOpen
      referenceId={referenceId01}
    >
      Accordion details - A
    </AccordionSection>
    <AccordionSection
      summary="Accordion summary"
      isOpen={false}
      referenceId={referenceId02}
    >
      Accordion details - B
    </AccordionSection>
    <AccordionSection
      summary="Accordion summary"
      isOpen={false}
      referenceId={referenceId03}
    >
      Accordion details - C
    </AccordionSection>
  </Accordion>
);

export let states = [
  {
    id: 'section-one-open',
    label: 'Section one open',
    element: (
      <Accordion>
        <AccordionSection
          summary="Accordion summary"
          isOpen
          referenceId={referenceId01}
        >
          Accordion details - A
        </AccordionSection>
        <AccordionSection
          summary="Accordion summary"
          isOpen={false}
          referenceId={referenceId02}
        >
          Accordion details - B
        </AccordionSection>
        <AccordionSection
          summary="Accordion summary"
          isOpen={false}
          referenceId={referenceId03}
        >
          Accordion details - C
        </AccordionSection>
      </Accordion>
    )
  },
  {
    id: 'section-two-open',
    label: 'Section two open',
    element: (
      <Accordion>
        <AccordionSection
          summary="Accordion summary"
          isOpen={false}
          referenceId={referenceId01}
        >
          Accordion details - A
        </AccordionSection>
        <AccordionSection
          summary="Accordion summary"
          isOpen
          referenceId={referenceId02}
        >
          Accordion details - B
        </AccordionSection>
        <AccordionSection
          summary="Accordion summary"
          isOpen={false}
          referenceId={referenceId03}
        >
          Accordion details - C
        </AccordionSection>
      </Accordion>
    )
  },
  {
    id: 'section-three-open',
    label: 'Section three open',
    element: (
      <Accordion>
        <AccordionSection
          summary="Accordion summary"
          isOpen={false}
          referenceId={referenceId01}
        >
          Accordion details - A
        </AccordionSection>
        <AccordionSection
          summary="Accordion summary"
          isOpen={false}
          referenceId={referenceId02}
        >
          Accordion details - B
        </AccordionSection>
        <AccordionSection
          summary="Accordion summary"
          isOpen
          referenceId={referenceId03}
        >
          Accordion details - C
        </AccordionSection>
      </Accordion>
    )
  },
  {
    id: 'styled',
    label: 'Styled',
    element: (
      <div className="nds-card">
        <Accordion>
          <AccordionSection
            summary="Accordion summary"
            isOpen
            referenceId={referenceId01}
          >
            Accordion details - A
          </AccordionSection>
          <AccordionSection
            summary="Accordion summary"
            isOpen={false}
            referenceId={referenceId02}
          >
            Accordion details - B
          </AccordionSection>
          <AccordionSection
            summary="Accordion summary"
            isOpen={false}
            referenceId={referenceId03}
          >
            Accordion details - C
          </AccordionSection>
        </Accordion>
      </div>
    )
  }
];

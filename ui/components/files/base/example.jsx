// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonGroup } from '../../button-groups/base/example';
import { ButtonIcon } from '../../button-icons/base/example';
import classNames from 'classnames';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

let ActionsMenu = props => {
  let buttonIconClassName;
  if (props.whiteIcons) {
    buttonIconClassName = 'nds-button_icon-inverse';
  }

  return (
    <div className="nds-file__actions-menu">
      <ButtonGroup className={props.className}>
        <ButtonIcon
          className={classNames(
            'nds-button_icon nds-button_icon-x-small',
            buttonIconClassName
          )}
          symbol="download"
          assistiveText="Download"
          title="Download"
        />
        <ButtonIcon
          className={classNames(
            'nds-button_icon nds-button_icon-x-small',
            buttonIconClassName
          )}
          symbol="down"
          aria-haspopup="true"
          assistiveText="More Actions"
          title="More Actions"
        />
      </ButtonGroup>
    </div>
  );
};

let ActionsConditional = props =>
  props.scrim ? (
    <div className="nds-file__title nds-file__title_scrim">
      <ActionsMenu whiteIcons={props.whiteIcons} />
    </div>
  ) : (
    <ActionsMenu whiteIcons={props.whiteIcons} />
  );

export let ExternalIcon = props => (
  <div className="nds-file__external-icon">
    <span
      className="nds-file__icon nds-icon_container"
      title={'salesforce1' || props.symbol}
    >
      <SvgIcon
        className="nds-icon nds-icon-text-default"
        sprite="utility"
        symbol={'salesforce1' || props.symbol}
      />
      <span className="nds-assistive-text">
        Data provided by: {'salesforce1' || props.symbol}
      </span>
    </span>
  </div>
);

export let File = props => (
  <div className={classNames('nds-file', props.className)}>
    <figure>
      <a
        href="javascript:void(0);"
        className={classNames('nds-file__crop', props.cropClass)}
      >
        {props.overlay ? <div className="nds-file_overlay" /> : null}
        {props.image ? (
          <img
            src="/assets/images/placeholder-img@16x9.jpg"
            alt="Description of the image"
          />
        ) : (
          <span
            className="nds-file__icon nds-icon_container"
            title={props.symbol || 'unknown file type'}
          >
            <SvgIcon
              className={classNames('nds-icon', props.iconType)}
              sprite={props.sprite || 'doctype'}
              symbol={props.symbol || 'unknown'}
            />
            <span className="nds-assistive-text">
              {props.title || 'Image Title'}
            </span>
          </span>
        )}
      </a>
      {!props.noCaption ? (
        <figcaption
          className={classNames('nds-file__title', props.titleClass, {
            'nds-file-has-actions': props.actions
          })}
        >
          <div className="nds-media nds-media_small nds-media_center">
            <div className="nds-media__figure nds-line-height_reset">
              {props.symbol ? (
                <span
                  className="nds-icon_container"
                  title={props.symbol || 'unknown file type'}
                >
                  <SvgIcon
                    className="nds-icon nds-icon_x-small"
                    sprite="doctype"
                    symbol={props.symbol || 'unknown'}
                  />
                  <span className="nds-assistive-text">
                    {props.symbol || 'unknown file type'}
                  </span>
                </span>
              ) : null}
            </div>
            <div className="nds-media__body">
              <span
                className="nds-file__text nds-truncate"
                title={props.title || 'Image Title'}
              >
                {props.title || 'Image Title'}
                {props.overlay ? (
                  <span className="nds-assistive-text">more files</span>
                ) : null}
              </span>
            </div>
          </div>
        </figcaption>
      ) : null}
    </figure>
    {props.externalSource ? <ExternalIcon /> : null}
    {props.actions ? (
      <ActionsConditional scrim={props.scrim} whiteIcons={props.whiteIcons} />
    ) : null}
  </div>
);

export let AttachmentLink = props => (
  <a
    href="javascript:void(0);"
    className="nds-media nds-box nds-grow nds-text-link_reset"
  >
    <div className="nds-media__figure nds-medium-show">
      <div className="nds-file nds-size_small">
        <div className="nds-file__crop nds-file__crop_16-by-9">
          <img
            src="/assets/images/placeholder-img@16x9.jpg"
            alt={props.title || 'Image Title'}
          />
        </div>
      </div>
    </div>
    <div className="nds-media__body">
      <h3 className="nds-text-heading_small">
        {props.articleTitle || 'Article Title'}
      </h3>
      <p>{props.articleDescription || 'Article Description'}</p>
      <span className="nds-text-body_small">
        {props.articleTitle || 'http://www.linkurl.com'}
      </span>
    </div>
  </a>
);

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <div style={{ width: '20rem' }}>
    <File
      className="nds-file_card"
      titleClass="nds-file__title_card"
      symbol="pdf"
      title="Proposal.pdf"
      image
    />
  </div>
);

export let examples = [
  {
    id: 'attachment-file-no-image',
    label: 'File with no image',
    element: (
      <div style={{ width: '20rem' }}>
        <File
          className="nds-file_card"
          titleClass="nds-file__title_card"
          symbol="image"
          title="Image Title"
        />
      </div>
    )
  },
  {
    id: 'attachment-file-no-title',
    label: 'File with no title',
    element: (
      <div style={{ width: '20rem' }}>
        <File className="nds-file_card" noCaption symbol="pdf" image />
      </div>
    )
  },
  {
    id: 'attachment-file-with-actions',
    label: 'File with actions',
    element: (
      <div style={{ width: '20rem' }}>
        <File
          className="nds-file_card"
          titleClass="nds-file__title_card"
          symbol="pdf"
          title="Proposal.pdf"
          actions
          image
        />
      </div>
    )
  },
  {
    id: 'attachment-file-with-no-title-actions',
    label: 'File with no title + actions',
    element: (
      <div style={{ width: '20rem' }}>
        <File
          className="nds-file_card"
          symbol="pdf"
          title="Proposal.pdf"
          actions
          whiteIcons
          scrim
          noCaption
          image
        />
      </div>
    )
  },
  {
    id: 'attachment-file-external-icon',
    label: 'File with external icon',
    element: (
      <div style={{ width: '20rem' }}>
        <File
          className="nds-file_card"
          titleClass="nds-file__title_card"
          symbol="pdf"
          title="Proposal.pdf"
          externalSource
        />
      </div>
    )
  },
  {
    id: 'attachment-file-loading-no-title',
    label: 'File in loading state with title',
    element: (
      <div style={{ width: '20rem' }}>
        <File
          className="nds-file_card"
          titleClass="nds-file__title_card"
          iconType="nds-file__loading-icon nds-icon_large"
          sprite="utility"
          symbol="image"
        />
      </div>
    )
  },
  {
    id: 'attachment-file-loading',
    label: 'File in loading state without title',
    element: (
      <div style={{ width: '20rem' }}>
        <File
          className="nds-file_card nds-file_center-icon"
          iconType="nds-file__loading-icon nds-icon_large"
          sprite="utility"
          symbol="image"
          noCaption
        />
      </div>
    )
  },
  {
    id: 'multi-attachments',
    label: '< 3 file attachments',
    element: (
      <ul className="nds-grid nds-grid_pull-padded">
        <li className="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
          <File
            className="nds-file_card"
            titleClass="nds-file__title_card"
            symbol="pdf"
            title="Proposal.pdf"
            image
          />
        </li>
        <li className="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
          <File
            className="nds-file_card"
            titleClass="nds-file__title_card"
            symbol="pdf"
            title="Proposal.pdf"
          />
        </li>
      </ul>
    )
  },
  {
    id: 'multi-attachments-overflow',
    label: '> 3 file attachments',
    element: (
      <ul className="nds-grid nds-grid_pull-padded">
        <li className="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
          <File
            className="nds-file_card"
            titleClass="nds-file__title_card"
            symbol="pdf"
            title="Proposal.pdf"
            image
          />
        </li>
        <li className="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3  nds-medium-show">
          <File
            className="nds-file_card"
            titleClass="nds-file__title_card"
            symbol="pdf"
            title="Proposal.pdf"
          />
        </li>
        <li className="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
          <File
            className="nds-file_card"
            titleClass="nds-file__title_overlay nds-align_absolute-center nds-text-heading_large"
            title="+22"
            image
            overlay
          />
        </li>
      </ul>
    )
  },
  {
    id: 'link-attachment',
    label: 'Link attachment',
    element: (
      <AttachmentLink
        articleTitle="Maui By Air The Best Way Around The Island"
        articleDescription="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt."
      />
    )
  }
];

// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import { File } from '../../files/base/example';
import { AttachmentLink } from '../../files/base/example';
import { Publisher } from '../../publishers/comment/example';
import {
  Comment,
  CommentHeader,
  CommentContent,
  CommentFooter
} from '../comment/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

export let PostFooterActions = props => (
  <ul className="nds-post__footer-actions-list nds-list_horizontal">
    <li className="nds-col nds-item nds-m-right_medium">
      <button
        title="Like this item"
        className={classNames(
          'nds-button_reset nds-post__footer-action',
          props.liked ? 'nds-is-active' : null
        )}
        aria-pressed={!!props.liked}
      >
        <SvgIcon
          className="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle"
          sprite="utility"
          symbol="like"
        />
        {props.liked ? 'Liked' : 'Like'}
      </button>
    </li>
    <li className="nds-col nds-item nds-m-right_medium">
      <button
        title="Comment on this item"
        className="nds-button_reset nds-post__footer-action"
      >
        <SvgIcon
          className="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle"
          sprite="utility"
          symbol="share_post"
        />{' '}
        Comment
      </button>
    </li>
    <li className="nds-col nds-item nds-m-right_medium">
      <button
        title="Share this item"
        className="nds-button_reset nds-post__footer-action"
      >
        <SvgIcon
          className="nds-icon nds-icon-text-default nds-icon_x-small nds-align-middle"
          sprite="utility"
          symbol="share"
        />{' '}
        Share
      </button>
    </li>
  </ul>
);

export let PostFooterMeta = props => (
  <ul className="nds-post__footer-meta-list nds-list_horizontal nds-has-dividers_right nds-text-title">
    {props.comments ? (
      <li className="nds-item">{props.comments || '0'} comments</li>
    ) : null}
    <li className="nds-item">20 shares</li>
    <li className="nds-item">259 views</li>
  </ul>
);

export let PostHeader = props => (
  <header className="nds-post__header nds-media">
    <div className="nds-media__figure">
      <a
        href="javascript:void(0);"
        className="nds-avatar nds-avatar_circle nds-avatar_large"
      >
        <img
          alt="Jason Rodgers"
          src="/assets/images/avatar1.jpg"
          title="Jason Rodgers avatar"
        />
      </a>
    </div>
    <div className="nds-media__body">
      <div className="nds-grid nds-grid_align-spread nds-has-flexi-truncate">
        <p>
          <a href="javascript:void(0);" title="Jason Rodgers">
            Jason Rogers
          </a>{' '}
          —{' '}
          <a href="javascript:void(0);" title="Design Systems">
            Design Systems
          </a>
        </p>
        <ButtonIcon
          className="nds-button_icon-border nds-button_icon-x-small"
          aria-haspopup="true"
          symbol="down"
          assistiveText="More Options"
          title="More Options"
        />
      </div>
      <p className="nds-text-body_small">
        <a
          href="javascript:void(0);"
          title="Click for single-item view of this post"
          className="nds-text-link_reset"
        >
          5 days Ago
        </a>
      </p>
    </div>
  </header>
);

export let PostContent = props => (
  <div
    className={classNames(
      'nds-post__content nds-text-longform',
      props.className
    )}
  >
    {props.children}
  </div>
);

export let PostFooter = props => (
  <footer className={classNames('nds-post__footer', props.className)}>
    {props.children}
  </footer>
);

export let Post = props => (
  <article className={classNames('nds-post', props.className)}>
    {props.children}
  </article>
);

export let Comments = props => (
  <div className="nds-feed__item-comments">{props.children}</div>
);

const CommentList = props => (
  <ul>
    {_.times(props.comments || 1, i => (
      <li key={`comment-${i}`}>
        <Comment>
          <CommentHeader />
          <CommentContent>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </CommentContent>
          <CommentFooter />
        </Comment>
      </li>
    ))}
  </ul>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <div className="nds-feed">
    <ul className="nds-feed__list">
      <li className="nds-feed__item">
        <Post>
          <PostHeader />
          <PostContent>
            <p>
              Hey there! Here's the latest demo presentation{' '}
              <a href="javascript:void(0);" title="Jenna Davis">
                @Jenna Davis
              </a>, let me know if there are any changes. I've updated slides
              3-8 and slides 16-18 slides with new product shots.
            </p>
          </PostContent>
          <PostFooter>
            <PostFooterActions />
            <PostFooterMeta />
          </PostFooter>
        </Post>
      </li>
    </ul>
  </div>
);

export let states = [
  {
    id: 'post-with-liker-bar',
    label: 'Like',
    element: (
      <div className="nds-feed">
        <ul className="nds-feed__list">
          <li className="nds-feed__item">
            <Post>
              <PostHeader />
              <PostContent>
                <p>
                  Hey there! Here's the latest demo presentation{' '}
                  <a href="javascript:void(0);" title="Jenna Davis">
                    @Jenna Davis
                  </a>, let me know if there are any changes. I've updated
                  slides 3-8 and slides 16-18 slides with new product shots.
                </p>
              </PostContent>
              <PostFooter>
                <PostFooterActions liked />
                <PostFooterMeta liked />
              </PostFooter>
            </Post>
            <Comments>
              <div className="nds-p-horizontal_medium nds-p-vertical_x-small">
                <a href="javascript:void(0);">You</a> liked this post
              </div>
            </Comments>
          </li>
        </ul>
      </div>
    )
  }
];

export let examples = [
  {
    id: 'post-attachment-link',
    label: 'Link attachment',
    element: (
      <div className="nds-feed">
        <ul className="nds-feed__list">
          <li className="nds-feed__item">
            <Post>
              <PostHeader />
              <PostContent>
                <p>
                  Hey there! Here's the latest demo presentation{' '}
                  <a href="javascript:void(0);" title="Jenna Davis">
                    @Jenna Davis
                  </a>, let me know if there are any changes. I've updated
                  slides 3-8 and slides 16-18 slides with new product shots.
                </p>
              </PostContent>
              <div className="nds-post__payload">
                <AttachmentLink
                  articleTitle="Maui By Air The Best Way Around The Island"
                  articleDescription="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt."
                />
              </div>
              <PostFooter>
                <PostFooterActions />
                <PostFooterMeta />
              </PostFooter>
            </Post>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'post-attachment-files',
    label: 'Files(s) attachment',
    element: (
      <div className="nds-feed">
        <ul className="nds-feed__list">
          <li className="nds-feed__item">
            <Post>
              <PostHeader />
              <PostContent>
                <p>
                  Hey there! Here's the latest demo presentation{' '}
                  <a href="javascript:void(0);" title="Jenna Davis">
                    @Jenna Davis
                  </a>, let me know if there are any changes. I've updated
                  slides 3-8 and slides 16-18 slides with new product shots.
                </p>
              </PostContent>
              <div className="nds-post__payload">
                <ul className="nds-grid nds-grid_pull-padded">
                  <li className="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
                    <File
                      className="nds-file_card"
                      cropClass="nds-file__crop_16-by-9"
                      titleClass="nds-file__title_card"
                      symbol="image"
                      image
                    />
                  </li>
                  <li className="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3 nds-medium-show">
                    <File
                      className="nds-file_card"
                      cropClass="nds-file__crop_16-by-9"
                      titleClass="nds-file__title_card"
                      symbol="pdf"
                    />
                  </li>
                  <li className="nds-p-horizontal_xx-small nds-size_1-of-2 nds-medium-size_1-of-3">
                    <File
                      className="nds-file_card"
                      cropClass="nds-file__crop_16-by-9"
                      titleClass="nds-file__title_overlay nds-align_absolute-center nds-text-heading_large"
                      title="22+"
                      image
                      overlay
                    />
                  </li>
                </ul>
              </div>
              <PostFooter>
                <PostFooterActions />
                <PostFooterMeta />
              </PostFooter>
            </Post>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'post-with-comments',
    label: 'With replies',
    element: (
      <div className="nds-feed">
        <ul className="nds-feed__list">
          <li className="nds-feed__item">
            <Post>
              <PostHeader />
              <PostContent>
                <p>
                  Hey there! Here's the latest demo presentation{' '}
                  <a href="javascript:void(0);" title="Jenna Davis">
                    @Jenna Davis
                  </a>, let me know if there are any changes. I've updated
                  slides 3-8 and slides 16-18 slides with new product shots.
                </p>
              </PostContent>
              <PostFooter>
                <PostFooterActions />
                <PostFooterMeta comments="2" />
              </PostFooter>
            </Post>
            <Comments>
              <CommentList comments="2" />
              <Publisher />
            </Comments>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'post-with-overflow',
    label: 'Replies - Overflow Bar',
    element: (
      <div className="nds-feed">
        <ul className="nds-feed__list">
          <li className="nds-feed__item">
            <Post>
              <PostHeader />
              <PostContent>
                <p>
                  Here's the latest demo presentation{' '}
                  <a href="javascript:void(0);" title="Jenna Davis">
                    @Jenna Davis
                  </a>, let me know if there are any changes. I've updated
                  slides 3-8 and slides 16-18 slides with new product shots.
                </p>
              </PostContent>
              <PostFooter>
                <PostFooterActions />
                <PostFooterMeta comments="8" />
              </PostFooter>
            </Post>
            <Comments>
              <div className="nds-p-horizontal_medium nds-p-vertical_x-small nds-grid">
                <button className="nds-button_reset nds-text-link">
                  More comments
                </button>
                <span className="nds-text-body_small nds-col_bump-left">
                  1 of 8
                </span>
              </div>
              <CommentList />
              <Publisher />
            </Comments>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'post-with-publisher-active',
    label: 'Replies - Publisher active',
    element: (
      <div className="nds-feed">
        <ul className="nds-feed__list">
          <li className="nds-feed__item">
            <Post>
              <PostHeader />
              <PostContent>
                <p>
                  Here's the latest demo presentation{' '}
                  <a href="javascript:void(0);" title="Jenna Davis">
                    @Jenna Davis
                  </a>, let me know if there are any changes. I've updated
                  slides 3-8 and slides 16-18 slides with new product shots.
                </p>
              </PostContent>
              <PostFooter>
                <PostFooterActions />
                <PostFooterMeta comments="8" />
              </PostFooter>
            </Post>
            <Comments>
              <div className="nds-p-horizontal_medium nds-p-vertical_x-small nds-grid">
                <button className="nds-button_reset nds-text-link">
                  More comments
                </button>
                <span className="nds-text-body_small nds-col_bump-left">
                  1 of 8
                </span>
              </div>
              <CommentList />
              <Publisher className="nds-is-active nds-has-focus" />
            </Comments>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'questions',
    label: 'Question',
    element: (
      <div className="nds-feed">
        <ul className="nds-feed__list">
          <li className="nds-feed__item">
            <Post>
              <PostHeader />
              <PostContent>
                <h3 className="nds-text-heading_small">
                  Barbecue Party Tips For A Truly Amazing Event?
                </h3>
                <p>
                  Hey there! Here's the latest demo presentation{' '}
                  <a href="javascript:void(0);" title="Jenna Davis">
                    @Jenna Davis
                  </a>, let me know if there are any changes. I've updated
                  slides 3-8 and slides 16-18 slides with new product shots.
                </p>
              </PostContent>
              <PostFooter>
                <PostFooterActions />
                <PostFooterMeta />
              </PostFooter>
            </Post>
          </li>
        </ul>
      </div>
    )
  }
];

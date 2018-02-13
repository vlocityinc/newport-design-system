// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export let examples = [
  {
    id: 'assistive-text',
    label: 'Assistive Text',
    element: <div className="nds-assistive-text">I am hidden from sight</div>,
    description:
      'Use the `nds-assistive-text` class to enable a screen reader to read text that is hidden. This class is typically used to accompany icons and other UI elements that show an image instead of text.'
  },
  {
    id: 'collapsed-expanded',
    label: 'Collapsed / Expanded',
    element: (
      <div className="demo-only">
        <div className="nds-is-collapsed">
          <h3>I am collapsed</h3>
          <p>I am a child inside a collapsed element</p>
        </div>
        <div className="nds-is-expanded">
          <h3>I am expanded</h3>
          <p>I am a child inside an expanded element</p>
        </div>
      </div>
    ),
    description:
      'The `.nds-is-collapsed` class hides the elements contained inside by controlling the height and overflow properties. Use the `.nds-is-expanded` class to show the elements contained inside in their normal expanded state.'
  },
  {
    id: 'hidden-visible',
    label: 'Hidden / Visible',
    element: (
      <div className="demo-only">
        <div className="nds-hidden">I am hidden</div>
        <div className="nds-visible">I am visible</div>
      </div>
    ),
    description:
      'You can hide an element but reserve the space on the page for when the element is made visible again. To hide the element, use the  `nds-hidden` class. To make it visible again, use the `nds-visible` class.'
  },
  {
    id: 'hide-show',
    label: 'Hide / Show',
    element: (
      <div className="demo-only">
        <div className="nds-hide">I am hidden</div>
        <div className="nds-show">I am shown as a block</div>
        <div className="nds-show_inline-block">
          I am shown as an inline-block
        </div>
      </div>
    ),
    description:
      'To hide an element and have it not take up space on the page, use the  `.nds-hide` class. You can toggle the state with JavaScript to show the element at a later&nbsp;time. To make the element visible again, use `.nds-show`. If you need to make the hidden element visible again in an inline-block state, use  `.nds-show_inline-block`.'
  },
  {
    id: 'transition-hide-show',
    label: 'Transition Hide / Show',
    element: (
      <div className="demo-only">
        <div className="nds-transition-hide">I have zero opacity</div>
        <div className="nds-transition-show">I have 100% opacity</div>
      </div>
    ),
    description:
      "To slowly transition an element from hiding and showing, use the  `nds-transition-hide` and `nds-transition-show` classes . They toggle the element's opacity and also reserve its space. Note: To control the timing of the transition, add an additional `transition` property to control the opacity change."
  },
  {
    id: 'responsive',
    label: 'Responsive',
    element: (
      <div className="demo-only demo-visibility">
        <div className="nds-show_x-small">Hides on 319px and down</div>
        <div className="nds-hide_x-small">Hides on 320px and up</div>

        <div className="nds-show_small">Hides on 479px and down</div>
        <div className="nds-hide_small">Hides on 480px and up</div>

        <div className="nds-show_medium">Hides on 767px and down</div>
        <div className="nds-hide_medium">Hides on 768px and up</div>

        <div className="nds-show_large">Hides on 1023px and down</div>
        <div className="nds-hide_large">Hides on 1024px and up</div>

        <div className="nds-show_x-large">Hides on 1279px and down</div>
        <div className="nds-hide_x-large">Hides on 1280px and up</div>
      </div>
    ),
    description: `
Responsive visibility classes will hide content on specific breakpoints. \`nds-show_[breakpoint]\` renders \`display: none\` when the the view port width is smaller than the breakpoint, and does nothing if it is bigger or equal. \`nds-hide_[breakpoint]\` does the oposite by rendering \`display: none\` when the the viewport width is bigger or equal than the breakpoint, and does nothing if it is smaller.

|Class Name|Less than 320px|X-Small (>= 320px)|Small (>= 480px)|Medium (>= 768px)|Large (>= 1024px)|X-Large (>= 1280px)|
|---|---|---|---|---|---|---|
|\`.nds-hide_x-small\`|Show|Hide|Hide|Hide|Hide|Hide|
|\`.nds-show_x-small\`|Hide|Show|Show|Show|Show|Show|
|\`.nds-hide_small\`|Show|Show|Hide|Hide|Hide|Hide|
|\`.nds-show_small\`|Hide|Hide|Show|Show|Show|Show|
|\`.nds-hide_medium\`|Show|Show|Show|Hide|Hide|Hide|
|\`.nds-show_medium\`|Hide|Hide|Hide|Show|Show|Show|
|\`.nds-hide_large\`|Show|Show|Show|Show|Hide|Hide|
|\`.nds-show_large\`|Hide|Hide|Hide|Hide|Show|Show|
|\`.nds-hide_x-large\`|Show|Show|Show|Show|Show|Hide|
|\`.nds-show_x-large\`|Hide|Hide|Hide|Hide|Hide|Show|
    `
  }
];

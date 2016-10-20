/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';
import { ButtonIcon } from 'ui/components/button-icons/flavors/base/index.react.example';
import className from 'classnames';

//////////////////////////////////////////////
// Partial(s)
//////////////////////////////////////////////

export let Popover = props =>
  <div className={className('slds-popover', props.className)} role="dialog">
    <header>
      <ButtonIcon className="slds-button--icon slds-button--icon-small slds-float--right slds-popover__close" symbol="close" assistiveText="Close" />
      <h2>Manage your channels</h2>
    </header>
    <div className="slds-popover__body">
      {props.children}
    </div>
    <footer>
      <span>Step 2 of 4</span>
      <button className="slds-button slds-button--brand">Next</button>
    </footer>
  </div>;

//////////////////////////////////////////////
// Export
//////////////////////////////////////////////

export let states = [
  {
    id: 'default',
    label: 'Default',
    element:
      <div className="slds-popover slds-nubbin--left" role="dialog">
        <div className="slds-popover__body">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi laudantium molestias reprehenderit nostrum quod natus saepe ea corrupti odit minima?</p>
        </div>
      </div>
  }
];

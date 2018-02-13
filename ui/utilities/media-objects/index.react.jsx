// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

class Component extends React.Component {
  render() {
    const className = classNames('nds-media', this.props.className, {
      [`nds-media_${this.props.flavor}`]: this.props.flavor
    });
    return (
      <div className={className}>
        {this.renderFigure(
          this.props.figureCenter,
          classNames(
            'nds-media__figure_stacked',
            this.props.figureCenterClassName
          )
        )}
        {this.renderFigure(
          this.props.figureLeft,
          this.props.figureLeftClassName
        )}
        <div className="nds-media__body">{this.props.children}</div>
        {this.renderFigure(
          this.props.figureRight,
          classNames(
            'nds-media__figure_reverse',
            this.props.figureRightClassName
          )
        )}
      </div>
    );
  }
  renderFigure(figure, className) {
    if (!figure) return null;
    className = classNames('nds-media__figure', className);
    return <div className={className}>{figure}</div>;
  }
}

Component.displayName = 'MediaObject';
Component.PropTypes = {
  figureLeft: React.PropTypes.node,
  figureLeftClassName: React.PropTypes.string,
  figureRight: React.PropTypes.node,
  figureRightClassName: React.PropTypes.string,
  figureCenter: React.PropTypes.node,
  figureCenterClassName: React.PropTypes.string,
  flavor: React.PropTypes.oneOf(['center', 'small', 'stacked'])
};

export default Component;

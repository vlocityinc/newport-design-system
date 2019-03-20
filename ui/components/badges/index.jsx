import React from 'react';
import classNames from 'classnames';

export const BaseBadge = props => (
  <span className={classNames('nds-badge', props.className)}>
    {props.children}
  </span>
);

export const Badge = BaseBadge;

export const InverseBadge = props => (
  <Badge className="nds-badge_inverse">{props.children}</Badge>
);

export const LightBadge = props => (
  <Badge className="nds-badge_lightest">{props.children}</Badge>
);

export const BrandBadge = props => (
  <Badge className="nds-badge_brand">{props.children}</Badge>
);

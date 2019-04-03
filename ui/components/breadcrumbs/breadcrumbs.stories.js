import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import scss from './base/_index.scss';
import notes from './doc.md';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default', () => {
    return withExample(`<nav role="navigation" aria-label="Breadcrumbs">
      <ol class="nds-breadcrumb nds-list_horizontal nds-wrap">
        <li class="nds-breadcrumb__item nds-text-title_caps">
          <a href="javascript:void(0);">Parent Entity</a>
        </li>
        <li class="nds-breadcrumb__item nds-text-title_caps">
          <a href="javascript:void(0);">Parent Record Name</a>
        </li>
      </ol>
    </nav>`);
  });

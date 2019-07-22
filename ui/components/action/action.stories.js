import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';
import scss from './base/_index.scss';
import notes from './doc.md';

storiesOf(`${base}`, module)
  .addDecorator(commentToHTML(scss))
  .addDecorator(withDocs(notes))
  .add('Default', () => {
    return withExample(`<c-vlocity-action
              theme={theme}
              action-display="horizontal"
              state-obj={stateObj}
              state-data={stateData}
              icon-extraclass="slds-m-right_small"
            ></c-vlocity-action>`);
  });
  
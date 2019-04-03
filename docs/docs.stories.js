import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import gettingStarted from './getting-started.md';
import introToNewport from './introduction-to-newport.md';
import buildDeploy from './build-deploy.md';
import { renderAsMarkdown } from '..././../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(renderAsMarkdown)
  .add('Introduction to Newport', () => {
    return introToNewport;
  })
  .add('Installing Newport On Your Developer Machine', () => {
    return gettingStarted;
  })
  .add('How to build and deploy Newport to an org', () => {
    return buildDeploy;
  });

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { STORY_RENDERED } from '@storybook/core-events';
import EVENTS from './constants';
import { PARAM_KEY } from './constants';
import { Placeholder } from '@storybook/components';

export default class DesignTokensPanel extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    api: PropTypes.shape({
      on: PropTypes.func,
      off: PropTypes.func,
      emit: PropTypes.func,

      getParameters: PropTypes.func
    }).isRequired
  };

  state = {
    value: ''
  };

  componentDidMount() {
    const { api } = this.props;
    api.on(STORY_RENDERED, this.onStoryChange);
    api.on(EVENTS.RESULT, this.onUpdate);
  }

  componentDidUpdate() {
    // // TODO: might be able to remove this
    // const { active } = this.props;
    // if (!prevProps.active && active) {
    //   this.request();
    // }
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(STORY_RENDERED, this.onStoryChange);
    api.off(EVENTS.RESULT, this.onUpdate);
  }

  onUpdate = ({ value }) => {
    this.setState({
      value: value
    });
  };

  request = () => {
    const { api, active } = this.props;

    if (active) {
      this.setState(
        {
          value: 'empty'
        },
        () => {
          api.emit(EVENTS.REQUEST);
        }
      );
    }
  };

  onStoryChange = id => {
    const { api } = this.props;
    const params = api.getParameters(id, PARAM_KEY);

    const value = null; //read(params);
    if (value) {
      this.setState({ value });
    } else {
      this.setState({ value: undefined });
    }
  };

  render() {
    const { active } = this.props;
    const { value } = this.state;

    if (!active) {
      return null;
    }

    return (
      <Placeholder>
        <React.Fragment>No Design Tokens Found</React.Fragment>
      </Placeholder>
    );
  }
}

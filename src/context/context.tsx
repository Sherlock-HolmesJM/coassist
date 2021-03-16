import React, { PureComponent, ReactNode } from 'react';
import { Members } from '../types/member';
import { MessageI } from '../components/message/message';
import { data } from '../services';
import { UPDATE_MESSAGES, AllActions, SET_MEMBERS } from './types';

interface Props {}

export interface MessagesI {
  [index: string]: MessageI;
}

interface State {
  messages: MessagesI;
  members: Members;
  dispatch: (a: any) => void;
}

const state: State = {
  messages: {},
  members: {},
  dispatch: () => '',
};

const context = React.createContext<State>(state);

class Provider extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      ...state,
      dispatch: this.dispatch,
    };
  }

  dispatch = (action: AllActions) => {
    const newState = this.reducer(action);
    this.setState(newState);
  };

  reducer = (action: AllActions) => {
    switch (action.type) {
      case UPDATE_MESSAGES:
        return {
          ...this.state,
          messages: { ...action.payload },
        };
      case SET_MEMBERS:
        return {
          ...this.state,
          members: { ...action.payload },
        };
      default:
        return this.state;
    }
  };

  componentDidMount() {
    this.setState({
      ...((data as unknown) as State),
    });
  }

  render(): ReactNode {
    return (
      <context.Provider value={this.state}>
        {this.props.children}
      </context.Provider>
    );
  }
}

export default Provider;
export { context };

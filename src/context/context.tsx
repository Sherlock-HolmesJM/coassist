import React, { PureComponent, ReactNode } from 'react';
import { MessageI, MemberI } from '../types/member';
import { data } from '../services';
import { SET_MESSAGES, AllActions, SET_MEMBERS, SET_MM } from './types';

interface Props {}

interface State {
  messages: MessageI[];
  members: MemberI[];
  dispatch: (a: any) => void;
}

const state: State = {
  messages: [],
  members: [],
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
      case SET_MEMBERS:
        return {
          ...this.state,
          members: [...action.payload],
        };
      case SET_MESSAGES:
        return {
          ...this.state,
          messages: [...action.payload],
        };
      case SET_MM:
        return { ...this.state, ...action.payload };
      default:
        return this.state;
    }
  };

  componentDidMount() {
    this.setState({
      ...data,
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

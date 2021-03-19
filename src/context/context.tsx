import React, { PureComponent, ReactNode } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { MessageI, MemberI } from '../types';
import { db } from '../services';
import { SET_MESSAGES, AllActions, SET_MEMBERS, SET_MM, SET_CG } from './types';
import { RouteComponentProps, withRouter } from 'react-router';

interface Props extends RouteComponentProps {}

export interface State {
  collatorName: string;
  groupName: string;
  messages: MessageI[];
  members: MemberI[];
  dispatch: (a: any) => void;
}

const state: State = {
  groupName: 'group name',
  collatorName: "collator's name",
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
      case SET_CG:
        return {
          ...this.state,
          ...action.payload,
        };
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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.getData().then((data) => {
          if (data) {
            this.setState({ ...((data as unknown) as State) });
          }
        });
        if (this.props.location.pathname === '/')
          this.props.history.replace('/home');
      }
      // else this.props.history.replace('/');
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

export default withRouter(Provider);
export { context };

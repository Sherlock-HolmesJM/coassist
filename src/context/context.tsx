import React, { PureComponent, ReactNode } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { MessageI, MemberI } from '../types';
import { db } from '../services';
import { AllActions } from './types';
import { RouteComponentProps, withRouter } from 'react-router';
import { reducer } from './reducer';

interface Props extends RouteComponentProps {}

export interface State {
  collatorName: string;
  groupName: string;
  messages: MessageI[];
  members: MemberI[];
  spin: boolean;
  dispatch: (a: any) => void;
}

const state: State = {
  groupName: "group's name",
  collatorName: "collator's name",
  messages: [],
  members: [],
  spin: true,
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
    const newState = reducer(this.state, action);
    this.setState(newState);
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.getData().then((data) => {
          if (data) this.setState({ ...this.state, ...data, spin: false });
        });
        if (this.props.location.pathname === '/')
          this.props.history.replace('/home');
      } else this.props.history.replace('/');
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

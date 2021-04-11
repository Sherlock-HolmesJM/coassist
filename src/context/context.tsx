import React, { PureComponent, ReactNode } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { MessageI, MemberI } from '../types';
import { getData } from '../services';
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
      if (!user) return this.props.history.replace('/');

      getData().then((data) => {
        this.setState({ ...this.state, ...data, spin: false });
      });

      if (this.props.location.pathname === '/')
        this.props.history.replace('/home');
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

export { context };
export default withRouter(Provider);

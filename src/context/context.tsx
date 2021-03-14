import React, { PureComponent, ReactNode } from 'react';
import { MemberI } from '../components/members';

interface Props {}
interface State {
  list: string[];
  members: MemberI[];
  dispatch: () => void;
}

const state: State = {
  list: [],
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

  dispatch = () => {};

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

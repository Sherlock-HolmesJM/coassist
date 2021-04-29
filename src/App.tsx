import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'animate.css';
import { Login, Members, Home, Message, Error } from './components';
import { Assignments } from './components';

function App() {
  return (
    <Div>
      <Switch>
        <Route path='/assignments:slug' component={Message} />
        <Route path='/home' component={Home} />
        <Route path='/members' component={Members} />
        <Route path='/assignments' component={Assignments} />
        <Route exact path='/' component={Login} />
        <Route component={Error} />
      </Switch>
    </Div>
  );
}

const Div = styled.div`
  overflow: hidden;
`;

export default App;

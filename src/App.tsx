import { Route, Switch } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import { Login, Members, Home, Message, Error } from './components';
import { Assignments } from './components';

function App() {
  return (
    <Switch>
      <Route path='/assignments:slug' component={Message} />
      <Route path='/home' component={Home} />
      <Route path='/members' component={Members} />
      <Route path='/assignments' component={Assignments} />
      <Route exact path='/' component={Login} />
      <Route component={Error} />
    </Switch>
  );
}

export default App;

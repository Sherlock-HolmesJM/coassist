import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import Login from './components/login';
import Home from './components/home';
import Members from './components/members';
import Assignments from './components/assignment';
import Message from './components/message/message';

function App() {
  return (
    <Switch>
      <Route path='/assignments:slug' component={Message} />
      <Route path='/home' component={Home} />
      <Route path='/members' component={Members} />
      <Route path='/assignments' component={Assignments} />
      <Route exact path='/' component={Login} />
    </Switch>
  );
}

export default App;

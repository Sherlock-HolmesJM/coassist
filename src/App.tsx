import { Route, Switch } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'animate.css';
import 'aos/dist/aos.css';
import { Login, Members, Home, Message, Error } from './components';
import { Assignments } from './components';
import AOS from 'aos';

function App() {
  AOS.init({
    duration: 1000,
    once: true,
  });

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

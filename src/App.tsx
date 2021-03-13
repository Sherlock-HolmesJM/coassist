import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import { Route, Switch } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import Members from "./components/members";

function App() {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/members" component={Members} />
      <Route path="/" component={Login} />
    </Switch>
  );
}

export default App;

import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom'
import './App.css';
import Movies from './components/movies'

function App() {
  return (
    <main className='container'>
      {/* <Movies/> */}
      <Switch>
        <Route path="/movies" component={Movies}></Route>
        <Route path="/customers" component={Customers}></Route>
        <Route path="/rentals" component={Rentals}></Route>
        <Route path="/not-found" component={NotFound}></Route>
        <Redirect from='/' to="/movies"/>
      </Switch>
    </main>
  );
}

export default App;

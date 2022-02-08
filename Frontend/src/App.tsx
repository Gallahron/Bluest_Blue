import React from 'react';
import './App.scss';
import {ColourSelector} from './Scenes/ColourSelector';
import { genUserID } from './Common/APIHelper';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Results } from './Scenes/Results';

function App() {

  
  if (localStorage.getItem("userID") === null) {
    genUserID()
    .then(res => localStorage.setItem("userID", res.toString()));
  }
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path={'/'} element={<ColourSelector />} />
        <Route path={'/result'} element={<Results />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import './App.css';
import { HomePage } from './components/HomePage/HomePage';
import {Call} from './components/Call/Call';
import {Routes,Route,BrowserRouter} from 'react-router-dom';
import { Button,Box} from '@chakra-ui/react';
function App() {
  return (
    <BrowserRouter>
      <Routes>
				<Route path="/call" Component={Call} />
				<Route path="/" Component={HomePage} />
			</Routes>
    </BrowserRouter>
  );
}
export default App;

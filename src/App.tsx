import React from 'react';
import './App.css';
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import Reactflow from 'reactflow';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoginForm from './ui/forms/LoginForm';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [{ path: 'users/login', element: <LoginForm /> },
      {path: 'users/signin', element: }
    ],
    },
  ]);

  return( 
  
  <RouterProvider router={router} />);
}

export default App;

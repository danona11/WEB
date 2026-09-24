// the App component is the main component of the application. 
// It serves as the entry point for the React application, 
//  and is responsible for rendering the other components, 
//    and managing the overall state of the application.

import { BrowserRouter, Routes, Route, Link , useNavigate, Outlet, } from 'react-router-dom';

import Register_page from './Register_page.jsx';
import Sign_up_page from './Sign_up_page.jsx'
import Home from './Home.jsx';

// Link: Creates navigation links that update the URL
// Routes: A container for all your route definitions
// Route: Defines a mapping between a URL path and a component


export default function App() {
    return (
        <> 
            <Register_page/>
            
        </>
        
    );
  
}

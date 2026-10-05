// the App component is the main component of the application. 
// It serves as the entry point for the React application, 
//  and is responsible for rendering the other components, 
//    and managing the overall state of the application.

import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import ManageUsersPage from './pages/ManageUsersPage.tsx';
import PageNotFound from './pages/PageNotFound.tsx';
import ProtectedRoutes from './context/ProtectedRoutes.tsx';

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/signUp" element={<SignUpPage />} />

{
    //protected routes for only accessible to users with admin permissions:
}
                <Route path="/manageUsers" element={
                                                    <ProtectedRoutes isAdminRoute={true}>
                                                        <ManageUsersPage />
                                                    </ProtectedRoutes>
                }/>

                <Route path="/home" element={
                                            <ProtectedRoutes>
                                                <HomePage />
                                            </ProtectedRoutes>
                }/>
               
                <Route path="*" element={<PageNotFound />} />   


            </Routes>
        </BrowserRouter>

             
    );
  
}

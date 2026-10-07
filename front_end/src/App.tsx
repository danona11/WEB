// the App component is the main component of the application. 
// It serves as the entry point for the React application, 
//  and is responsible for rendering the other components, 
//    and managing the overall state of the application.

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import PageNotFound from './pages/PageNotFound.tsx';
import ProtectedRoutes from './context/ProtectedRoutes.tsx';
import ManageUsersPage from './pages/AdminPages/ManageUsersPage.tsx';
import ManageProductsPage from './pages/AdminPages/ManageProductsPage.tsx';

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/signUp" element={<SignUpPage />} />

{
    //protected routes only accessible to users with admin permissions:
}
                <Route path="/manageUsers" element={
                                                    <ProtectedRoutes isAdminRoute={false}>
                                                        <ManageUsersPage />
                                                    </ProtectedRoutes>
                }/>
                
                <Route path="/manageProducts" element={
                                                    <ProtectedRoutes isAdminRoute={false}>
                                                        <ManageProductsPage />
                                                    </ProtectedRoutes>
                }/>
                
{
    //protected routes accessible to all users who logged in:
}
                <Route path="/home" element={
                                            <ProtectedRoutes isAdminRoute={false}>
                                                <HomePage />
                                            </ProtectedRoutes>
                }/>
               
                <Route path="*" element={<PageNotFound />} />   


            </Routes>
        </BrowserRouter>

             
    );
  
}

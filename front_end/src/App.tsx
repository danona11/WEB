import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import PageNotFound from './pages/PageNotFound.tsx';
import CartPage from './pages/CartPage.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import ProtectedRoutes from './context/ProtectedRoutes.tsx';
import ManageUsersPage from './pages/AdminPages/ManageUsersPage.tsx';
import ManageProductsPage from './pages/AdminPages/ManageProductsPage.tsx';
import NavBar from './components/NavBar.tsx' 

function NavbarLayout() {
  return ( 
  <>
    <NavBar />
        <div style={{ padding: '20px' }}>
            <Outlet /> 
        </div>
    </>)
}

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
                <Route element={<NavbarLayout/>}>
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

                    <Route path="/cart" element={
                        <ProtectedRoutes isAdminRoute={false}>
                            <CartPage />
                        </ProtectedRoutes>
                    }/>

                    <Route path="/products" element={
                        <ProtectedRoutes isAdminRoute={false}>
                            <ProductsPage />
                        </ProtectedRoutes>
                    }/>
                    
                </Route>
                
                <Route path="*" element={<PageNotFound />} />   
            </Routes>
        </BrowserRouter>

             
    );
  
}

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import PageNotFound from './pages/PageNotFound';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import ProtectedRoutes from './context/ProtectedRoutes';
import ManageUsersPage from './pages/AdminPages/ManageUsersPage';
// import ManageProductsPage from './pages/AdminPages/ManageProductsPage';
import NavBar from './components/NavBar';

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

                    <Route  path="/manageUsers" element={
                        <ProtectedRoutes isAdminRoute={false}>
                            <ManageUsersPage />
                        </ProtectedRoutes>
                    }/>
                    
                    {/* <Route path="/manageProducts" element={
                        <ProtectedRoutes isAdminRoute={true}>
                            <ManageProductsPage />
                        </ProtectedRoutes>
                    }/>    */}
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

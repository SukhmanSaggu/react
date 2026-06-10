import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

const MainLayout = ({ isAdminSignedIn, adminLogout }) => {
    return (
        <>
            <Navbar
                isAdminSignedIn={isAdminSignedIn}
                adminLogout={adminLogout}
            />
            <Outlet />
            <ToastContainer />
        </>
    );
};
export default MainLayout;

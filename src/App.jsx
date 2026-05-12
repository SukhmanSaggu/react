import {
    Route,
    Navigate,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage from './pages/JobPage';
import AddJobPage from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ManageJobsPage from './pages/ManageJobsPage';
import { jobLoader } from './loaders/jobLoader';

const App = () => {
    const [isAdminSignedIn, setIsAdminSignedIn] = useState(
        () => localStorage.getItem('isAdminSignedIn') === 'true'
    );

    const adminLogin = (adminId) => {
        localStorage.setItem('isAdminSignedIn', 'true');
        localStorage.setItem('adminId', adminId);
        setIsAdminSignedIn(true);
    };

    const adminLogout = () => {
        localStorage.removeItem('isAdminSignedIn');
        localStorage.removeItem('adminId');
        setIsAdminSignedIn(false);
    };

    // Add New Job
    const addJob = async (newJob) => {
        await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newJob),
        });
    };

    // Delete Job
    const deleteJob = async (id) => {
        await fetch(`/api/jobs/${id}`, {
            method: 'DELETE',
        });
    };

    // Update Job
    const updateJob = async (job) => {
        await fetch(`/api/jobs/${job.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(job),
        });
    };

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route
                path='/'
                element={
                    <MainLayout
                        isAdminSignedIn={isAdminSignedIn}
                        adminLogout={adminLogout}
                    />
                }
            >
                <Route index element={<HomePage isAdminSignedIn={isAdminSignedIn} />} />
                <Route path='/jobs' element={<JobsPage />} />
                <Route
                    path='/admin-login'
                    element={
                        isAdminSignedIn ? (
                            <Navigate to='/manage-jobs' replace />
                        ) : (
                            <AdminLoginPage adminLogin={adminLogin} />
                        )
                    }
                />
                <Route
                    path='/add-job'
                    element={
                        isAdminSignedIn ? (
                            <AddJobPage addJobSubmit={addJob} />
                        ) : (
                            <Navigate to='/' replace />
                        )
                    }
                />
                <Route
                    path='/edit-job/:id'
                    element={
                        isAdminSignedIn ? (
                            <EditJobPage updateJobSubmit={updateJob} />
                        ) : (
                            <Navigate to='/' replace />
                        )
                    }
                    loader={jobLoader}
                />
                <Route
                    path='/manage-jobs'
                    element={
                        isAdminSignedIn ? (
                            <ManageJobsPage deleteJob={deleteJob} />
                        ) : (
                            <Navigate to='/admin-login' replace />
                        )
                    }
                />
                <Route
                    path='/change-password'
                    element={
                        isAdminSignedIn ? (
                            <ChangePasswordPage />
                        ) : (
                            <Navigate to='/admin-login' replace />
                        )
                    }
                />
                <Route
                    path='/jobs/:id'
                    element={
                        <JobPage
                            deleteJob={deleteJob}
                            isAdminSignedIn={isAdminSignedIn}
                        />
                    }
                    loader={jobLoader}
                />
                <Route path='*' element={<NotFoundPage />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};
export default App;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../config/api';

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault();
        const adminId = localStorage.getItem('adminId');

        if (!adminId) {
            toast.error('Please login as admin again');
            navigate('/admin-login');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: adminId,
                    currentPassword,
                    newPassword,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to change password');
            }

            toast.success('Admin password changed');
            navigate('/manage-jobs');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className='bg-indigo-50'>
            <div className='container m-auto max-w-lg py-24 px-6'>
                <div className='bg-white px-6 py-8 shadow-md rounded-md border'>
                    <form onSubmit={submitForm}>
                        <h2 className='text-3xl text-center font-semibold mb-6'>
                            Change Password
                        </h2>

                        <div className='mb-4'>
                            <label
                                htmlFor='currentPassword'
                                className='block text-gray-700 font-bold mb-2'
                            >
                                Current Password
                            </label>
                            <input
                                type='password'
                                id='currentPassword'
                                className='border rounded w-full py-2 px-3'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className='mb-4'>
                            <label
                                htmlFor='newPassword'
                                className='block text-gray-700 font-bold mb-2'
                            >
                                New Password
                            </label>
                            <input
                                type='password'
                                id='newPassword'
                                className='border rounded w-full py-2 px-3'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className='mb-6'>
                            <label
                                htmlFor='confirmPassword'
                                className='block text-gray-700 font-bold mb-2'
                            >
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                id='confirmPassword'
                                className='border rounded w-full py-2 px-3'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                            type='submit'
                            disabled={submitting}
                        >
                            {submitting ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ChangePasswordPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../config/api';

const AdminLoginPage = ({ adminLogin }) => {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: adminId.trim(),
                    password,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Invalid admin id or password');
            }

            const data = await res.json();
            adminLogin(String(data.adminId));
            toast.success('Admin signed in');
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
                            Admin Login
                        </h2>

                        <div className='mb-4'>
                            <label
                                htmlFor='adminId'
                                className='block text-gray-700 font-bold mb-2'
                            >
                                Admin ID
                            </label>
                            <input
                                type='text'
                                id='adminId'
                                className='border rounded w-full py-2 px-3'
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                                required
                            />
                        </div>

                        <div className='mb-6'>
                            <label
                                htmlFor='password'
                                className='block text-gray-700 font-bold mb-2'
                            >
                                Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                className='border rounded w-full py-2 px-3'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                            type='submit'
                            disabled={submitting}
                        >
                            {submitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AdminLoginPage;

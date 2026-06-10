import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import API_BASE_URL from '../config/api';

const ManageJobsPage = ({ deleteJob }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/jobs`);
                if (!res.ok) {
                    throw new Error(`API request failed with status ${res.status}`);
                }
                const data = await res.json();
                setJobs(data);
            } catch (fetchError) {
                console.error('Error fetching jobs:', fetchError);
                setError('Jobs could not be loaded. Please check the API server.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const onDeleteClick = async (jobId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this listing?'
        );

        if (!confirmed) return;

        await deleteJob(jobId);
        setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
        toast.success('Job deleted successfully');
    };

    return (
        <section className='bg-blue-50 px-4 py-10'>
            <div className='container-xl lg:container m-auto'>
                <div className='flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6'>
                    <h2 className='text-3xl font-bold text-indigo-500'>
                        Manage Jobs
                    </h2>
                    <Link
                        to='/add-job'
                        className='inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600 text-center'
                    >
                        Add Job
                    </Link>
                </div>

                {loading ? (
                    <Spinner loading={loading} />
                ) : error ? (
                    <p className='text-center text-red-600'>{error}</p>
                ) : (
                    <div className='grid grid-cols-1 gap-4'>
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className='bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4'
                            >
                                <div>
                                    <h3 className='text-xl font-bold'>{job.title}</h3>
                                    <p className='text-gray-600'>{job.company.name}</p>
                                    <p className='text-orange-700'>{job.location}</p>
                                </div>

                                <div className='flex flex-col md:flex-row gap-2'>
                                    <Link
                                        to={`/edit-job/${job.id}`}
                                        className='bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full'
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type='button'
                                        onClick={() => onDeleteClick(job.id)}
                                        className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ManageJobsPage;

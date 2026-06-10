import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import JobListing from './JobListing.jsx';
import Spinner from './Spinner.jsx';

const JobsListing = ({ isHome = false }) => {
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
                const jobsData = isHome ? data.slice(0, 3) : data;
                setJobs(jobsData);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setError('Jobs could not be loaded from MySQL. Please check that the API server is running on port 8000.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [isHome]);

    return (
        <section className='bg-blue-50 px-4 py-10'>
            <div className='container-xl lg:container m-auto'>
                <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
                    {isHome ? 'Recent Jobs' : 'Browse Jobs'}
                </h2>

                {loading ? (
                    <Spinner loading={loading} />
                ) : error ? (
                    <p className='text-center text-red-600'>{error}</p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {jobs.map((job) => (
                            <JobListing key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default JobsListing;

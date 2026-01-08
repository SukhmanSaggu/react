import { useState, useEffect } from 'react';
import JobListing from './JobListing.jsx';
import Spinner from './Spinner.jsx';
// 1. Import the file directly
import jobsData from '../jobs.json';

const JobsListing = ({ isHome = false }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 2. Simply set the data from the imported file
        const data = isHome ? jobsData.slice(0, 3) : jobsData;
        setJobs(data);
        setLoading(false);
    }, [isHome]);

    return (
        <section className='bg-blue-50 px-4 py-10'>
            <div className='container-xl lg:container m-auto'>
                <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
                    {isHome ? 'Recent Jobs' : 'Browse Jobs'}
                </h2>

                {loading ? (
                    <Spinner loading={loading} />
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
import JobsListing from '../components/JobsListing'; // Ensure this points to the JSX file

const JobsPage = () => {
    return (
        <section className='bg-blue-50 px-4 py-6'>
            {/* This is the component that fetches the data */}
            <JobsListing />
        </section>
    );
};

export default JobsPage;
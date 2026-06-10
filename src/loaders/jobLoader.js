import API_BASE_URL from '../config/api';

const jobLoader = async ({ params }) => {
    const res = await fetch(`${API_BASE_URL}/api/jobs/${params.id}`);
    const job = await res.json();
    return job;
};

export { jobLoader };

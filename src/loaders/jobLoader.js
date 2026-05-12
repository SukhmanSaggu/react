const jobLoader = async ({ params }) => {
    const res = await fetch(`/api/jobs/${params.id}`);
    const job = await res.json();
    return job;
};

export { jobLoader };

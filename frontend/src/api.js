import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const createJob = async (numbers) => {
  const response = await api.post("/jobs", { numbers });
  return response.data;
};

export const getJobStatus = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

export default api;
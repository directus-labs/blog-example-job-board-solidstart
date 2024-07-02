import { createSignal, createResource, Show } from "solid-js";
import JobList from "~/components/JobList";
import JobForm from "~/components/JobForm";
import { Job, Jobs } from "../types";
import Modal from "~/components/Modal";
import { useAuth } from "../context/AuthContext";
import {
  readItems,
  createItem,
  updateItem,
  deleteItem,
} from "@directus/sdk";
import getDirectusInstance from "~/lib/directus";
import { useNavigate } from "@solidjs/router";
import ResumeForm from "~/components/ResumeForm";


function HomePage() {
  const  directus  = getDirectusInstance();
  const [editingJob, setEditingJob] = createSignal<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [modalContent, setModalContent] = createSignal<"jobForm" | "resumeForm">("jobForm");
  const [applyingJobId, setApplyingJobId] = createSignal<number | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const fetchedJobs = await directus.request(readItems("job"));
      return fetchedJobs as Jobs;
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // const [jobs, { refetch: refetchJobs }] = createResource(fetchJobs);
  const [jobs] = createResource(fetchJobs);


  const addJob = async (job: Omit<Job, "id">) => {
    try {
      if (!auth.user()) {
        throw new Error("You need to login to create a job");
      }
      job.employer = auth.user()?.id as unknown as string;
      const response = await directus.request(createItem("job", job));

      if (response) {
        setIsModalOpen(false);
        // refetchJobs();
      } else {
        throw new Error("Failed to add job");
      }
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job. Please try again.");
    }
  };

  const updateJob = async (updatedJob: Job, id: string) => {
    try {
      if (!auth.user()) {
        throw new Error("You need to login to create a job");
      }
      await directus.request(updateItem("job", id, updatedJob));
      setEditingJob(null);
      setIsModalOpen(false);
      // refetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    }
  };

  const deleteJob = async (id: number) => {
    try {
      await directus.request(deleteItem("job", id));
      // refetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const openModal = (job?: Job) => {
    setEditingJob(job || null);
    setIsModalOpen(true);
  };

  const applyForJob = async (jobId: number) => {
    if (!auth.user()) {
      alert("You need to login to apply for a job");
      return;
    }
    setApplyingJobId(jobId);
    setModalContent("resumeForm");
    setIsModalOpen(true);
  };

  const submitApplication = async (resumeUrl: string) => {
    try {
      if (!auth.user() || !applyingJobId()) {
        throw new Error("You need to login to apply for a job");
      }
      const newApplication = {
        job: applyingJobId(),
        user: auth.user()?.id as unknown as string,
        status: "pending",
        resumeUrl: resumeUrl,
      };

      await directus.request(createItem("application", newApplication));
      alert("Application submitted successfully!");
      setIsModalOpen(false);
      setApplyingJobId(null);
    } catch (error) {
      alert("Failed to apply for job. Please try again.");
    }
  };

  return (
    <div>
      <h1>Job Portal</h1>
      <Show
        when={auth.user()}
        fallback={
          <nav>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </nav>
        }
      >
        <button onClick={auth.logout}>Logout</button>
        <Show when={auth.user()?.email === "admin@example.com"}>
        <button
          onClick={() => {
            setModalContent("jobForm");
            setIsModalOpen(true);
          }}
        >
          Add New Job
        </button>
        <button onClick={() => navigate("/applications")}>Manage Applications</button>
        </Show>
      </Show>
      <Show when={jobs.loading}>Loading jobs...</Show>
      <Show when={jobs.error}>Error loading jobs: {jobs.error}</Show>
      <Show
        when={!jobs.error}
        fallback={<div>Error loading jobs: {jobs.error?.message}</div>}
      >
        <JobList
          jobs={jobs() || []}
          onEdit={auth.user()?.email === "admin@example.com"? openModal : undefined}
          onDelete={auth.user()?.email === "admin@example.com" ? deleteJob : undefined}
          onApply={auth.user()?.email !== "admin@example.com" ? applyForJob : undefined}
        />
      </Show>
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <Show when={modalContent() === "jobForm"}>
          <JobForm
            onSubmit={editingJob() ? updateJob : addJob}
            job={editingJob() as Job}
          />
        </Show>
        <Show when={modalContent() === "resumeForm"}>
          <ResumeForm onSubmit={submitApplication} />
        </Show>
      </Modal>
    </div>
  );
}

export default HomePage;


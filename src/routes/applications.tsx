import { createSignal, createEffect, For, Show } from "solid-js";
import { readItems, updateItem } from "@directus/sdk";
import { useAuth } from "../context/AuthContext";
import { Application, Job } from "../types";
import getDirectusInstance from "~/lib/directus";

const ManageApplicationsPage = () => {
  const directus  = getDirectusInstance();

  const [applications, setApplications] = createSignal<Application[]>([]);
  const [jobs, setJobs] = createSignal<Job[]>([]);
  const [selectedApplication, setSelectedApplication] =
    createSignal<Application | null>(null);
  const auth = useAuth();

  const fetchApplications = async () => {
    try {
      const fetchedApplications = await directus.request(
        readItems("application", {
          deep: {
            user: {
              fields: ["first_name", "last_name"],
            },
            job: {
              fields: ["title"],
            },
          },
          fields: ["*", "user.first_name", "user.last_name", "job.title"],
        })
      );
      setApplications(fetchedApplications as Application[]);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const fetchedJobs = await directus.request(readItems("jobs"));
      setJobs(fetchedJobs as Job[]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  createEffect(() => {
    fetchApplications();
    fetchJobs();
  });

  const updateApplicationStatus = async (id: number, status: string) => {
    try {
      await directus.request(updateItem("application", id, { status }));
      fetchApplications();
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  return (
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 class="text-xl font-semibold mb-2">Applications List</h2>
          <For each={applications()}>
            {(application) => (
              <div
                class="border p-2 mb-2 cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedApplication(application)}
              >
                <p>Job: {application.job.title}</p>
                {/* <p>Applicant: {application.user.first_name} {application.user.last_name}</p> */}
                <p>Status: {application.status}</p>
              </div>
            )}
          </For>
        </div>
        <Show when={selectedApplication()}>
          <div class="border p-4">
            <h2 class="text-xl font-semibold mb-2">Application Details</h2>
            <p>Job: {selectedApplication()?.job.title}</p>
            <p>Applicant: {selectedApplication()?.user.first_name} {selectedApplication()?.user.last_name}</p>
            <p>Status: {selectedApplication()?.status}</p>
            <p>
              Resume:
              <a
                href={selectedApplication()?.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            </p>
            <div class="mt-4">
              <button
                class="bg-green-500 text-white px-4 py-2 mr-2"
                onClick={() =>
                  updateApplicationStatus(selectedApplication()!.id, "accepted")
                }
              >
                Accept
              </button>
              <button
                class="bg-red-500 text-white px-4 py-2"
                onClick={() =>
                  updateApplicationStatus(selectedApplication()!.id, "rejected")
                }
              >
                Reject
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default ManageApplicationsPage;

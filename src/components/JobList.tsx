// import { For, Show, createMemo, createSignal } from "solid-js";
// import { Jobs, Job } from "../types";

// interface JobListProps {
//   jobs: Jobs;
//   onEdit?: (job: Job) => void;
//   onDelete?: (id: number) => void;
//   onApply?: (id: number) => void;
// }

// function JobList(props: JobListProps) {
//   const [searchQuery, setSearchQuery] = createSignal("");
//   const [jobType, setJobType] = createSignal("All");
//   const [minSalary, setMinSalary] = createSignal(0);
//   const [maxSalary, setMaxSalary] = createSignal(1000000);

//   const filteredJobs = createMemo(() => {
//     const query = searchQuery().toLowerCase();
//     return props.jobs.filter(
//       (job: Job) =>
//         (job.title.toLowerCase().includes(query) ||
//           job.description.toLowerCase().includes(query) ||
//           job.location.toLowerCase().includes(query)) &&
//         (jobType() === "All" || job.type === jobType()) &&
//         job.salary >= minSalary() &&
//         job.salary <= maxSalary()
//     );
//   });

//   return (
//     <div class="container">
//       <input
//         type="text"
//         class="search-input"
//         placeholder="Search jobs..."
//         onInput={(e) => setSearchQuery(e.currentTarget.value)}
//         value={searchQuery()}
//       />
//       <div class="filters">
//         <select onChange={(e) => setJobType(e.currentTarget.value)}>
//           <option value="All">All Types</option>
//           <option value="Full-time">Full-time</option>
//           <option value="Part-time">Part-time</option>
//           <option value="Contract">Contract</option>
//         </select>
//         <input
//           type="number"
//           placeholder="Min Salary"
//           onInput={(e) => setMinSalary(parseInt(e.currentTarget.value) || 0)}
//         />
//         <input
//           type="number"
//           placeholder="Max Salary"
//           onInput={(e) => setMaxSalary(parseInt(e.currentTarget.value) || 1000000)}
//         />
//       </div>
//       <ul class="job-list">
//         <For each={filteredJobs()}>
//           {(job: Job) => (
//             <li class="job-list-item">
//               <h3 class="job-title">{job.title}</h3>
//               <p class="job-description">{job.description}</p>
//               <p class="job-location">Location: {job.location}</p>
//               <p class="job-type">Type: {job.type}</p>
//               <p class="job-salary">Salary: ${job.salary}</p>
//               <Show when={props.onEdit}>
//                 <button onClick={() => props.onEdit!(job)}>Edit</button>
//               </Show>
//               <Show when={props.onDelete}>
//                 <button onClick={() => props.onDelete!(job.id as number)}>
//                   Delete
//                 </button>
//               </Show>
//               <Show when={props.onApply}>
//                 <button onClick={() => props.onApply!(job.id as number)}>
//                   Apply
//                 </button>
//               </Show>
//             </li>
//           )}
//         </For>
//       </ul>
//     </div>
//   );
// }

// export default JobList;
import { For, Show } from "solid-js";
import { Jobs, Job } from "../types";

interface JobListProps {
  jobs: Jobs;
  onEdit?: (job: Job) => void;
  onDelete?: (id: number) => void;
  onApply?: (id: number) => void;
}

function JobList(props: JobListProps) {
  return (
    <div class="container">
      <ul class="job-list">
        <For each={props.jobs}>{(job: Job) => 
          <li class="job-list-item">
            <h3 class="job-title">{job.title}</h3>
            <p class="job-description">{job.description}</p>
            <p class="job-location">Location: {job.location}</p>
            <p class="job-type">Type: {job.type}</p>
            <p class="job-salary">Salary: ${job.salary}</p>
            <Show when={props.onEdit}>
              <button onClick={() => props.onEdit!(job)}>Edit</button>
            </Show>
            <Show when={props.onDelete}>
              <button onClick={() => props.onDelete!(job.id as number as number)}>Delete</button>
            </Show>
            <Show when={props.onApply}>
              <button onClick={() => props.onApply!(job.id as number)}>Apply</button>
            </Show>
          </li>
        }</For>
      </ul>
    </div>
  );
}

export default JobList;
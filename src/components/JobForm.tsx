// src/components/JobForm.tsx
import { createSignal } from "solid-js";
import { Job } from "../types";
import "./JobForm.css";

interface JobFormProps {
  job?: Job;
  onSubmit: (job: Job) => void;
}

export default function JobForm(props: JobFormProps) {
  const [title, setTitle] = createSignal(props.job?.title || "");
  const [description, setDescription] = createSignal(props.job?.description || "");
  const [location, setLocation] = createSignal(props.job?.location || "");
  const [type, setType] = createSignal(props.job?.type || "Full-time");
  const [salary, setSalary] = createSignal(props.job?.salary || 0);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit({
        id: props.job?.id,
        title: title(),
        description: description(),
        location: location(),
        type: type(),
        salary: salary(),
    });
  };

  return (
    <form onSubmit={handleSubmit} class="job-form">
      <h2>{props.job ? "Edit Job" : "Add New Job"}</h2>
      <input
        type="text"
        placeholder="Job Title"
        value={title()}
        onInput={(e) => setTitle(e.currentTarget.value)}
        required
      />
      <textarea
        placeholder="Job Description"
        value={description()}
        onInput={(e) => setDescription(e.currentTarget.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location()}
        onInput={(e) => setLocation(e.currentTarget.value)}
        required
      />
      <select value={type()} onChange={(e) => setType(e.currentTarget.value)}>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
      </select>
      <input
        type="number"
        placeholder="Salary"
        value={salary()}
        onInput={(e) => setSalary(Number(e.currentTarget.value))}
        required
      />
      <button type="submit">{props.job ? "Update Job" : "Add Job"}</button>
    </form>
  );
}
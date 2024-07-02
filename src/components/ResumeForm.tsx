// components/ResumeForm.tsx
import { createSignal } from "solid-js";

interface ResumeFormProps {
  onSubmit: (resumeUrl: string) => void;
}

function ResumeForm({ onSubmit }: ResumeFormProps) {
  const [resumeUrl, setResumeUrl] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(resumeUrl());
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit Your Resume</h2>
      <div>
        <label for="resumeUrl">Resume URL:</label>
        <input
          type="url"
          id="resumeUrl"
          value={resumeUrl()}
          onInput={(e) => setResumeUrl(e.currentTarget.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ResumeForm;
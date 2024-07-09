// src/types.ts
export interface User {
  id?: number;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export interface Application {
  id: number;
  job: Job;
  user: User;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  resumeUrl: string;
}

export interface Job {
  id?: number;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number;
  employer?: User | string;
}

export type Jobs = Job[];
export type Applications = Application[];

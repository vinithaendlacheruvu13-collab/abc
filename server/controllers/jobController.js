import { jobs, stats } from "../data/mockData.js";

export function getJobs(_request, response) {
  response.json(jobs);
}

export function getJobById(request, response) {
  const job = jobs.find((item) => item.id === request.params.id);

  if (!job) {
    response.status(404).json({ message: "Job not found" });
    return;
  }

  response.json(job);
}

export function createJob(request, response) {
  const hourlyWage = Number(String(request.body.hourlyWage || "").replace(/[^0-9.]/g, "")) || 15;
  const newJob = {
    id: `job-${Date.now()}`,
    title: request.body.title || "New Campus Job",
    department: request.body.department || "Student Employment",
    supervisor: "Pending supervisor assignment",
    hourlyWage,
    weeklyHours: `${request.body.weeklyHours || "8-10"} hrs/week`,
    skills: String(request.body.skills || "Communication")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    compatibility: 88,
    days: request.body.days || "Weekdays",
    shift: request.body.shift || "Afternoon",
    schedule: `${request.body.days || "Weekdays"} | ${request.body.shift || "Afternoon"}`,
    description: request.body.description || "Campus job listing created from the admin prototype.",
    eligibility: "Current student eligible for campus employment.",
    status: "Active",
    applications: 0
  };

  jobs.unshift(newJob);
  stats.totalJobs += 1;
  stats.activeJobs += 1;
  response.status(201).json(newJob);
}

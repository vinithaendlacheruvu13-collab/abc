import { applications, jobs, stats } from "../data/mockData.js";

export function getApplications(_request, response) {
  response.json(applications);
}

export function createApplication(request, response) {
  const application = {
    id: `app-${Date.now()}`,
    jobId: request.body.jobId,
    studentName: request.body.studentName,
    studentId: request.body.studentId,
    department: request.body.department,
    skills: request.body.skills,
    availableTimeSlots: request.body.availableTimeSlots,
    status: "Submitted"
  };

  applications.unshift(application);
  stats.totalApplications += 1;
  stats.weeklyApplications += 1;

  const job = jobs.find((item) => item.id === application.jobId);
  if (job) job.applications += 1;

  response.status(201).json(application);
}

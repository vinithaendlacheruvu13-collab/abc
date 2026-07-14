export const fallbackJobs = [
  {
    id: "job-library-assistant",
    title: "Library Circulation Assistant",
    department: "Library Services",
    supervisor: "Elena Brooks, Access Services Manager",
    hourlyWage: 15,
    weeklyHours: "10-12 hrs/week",
    skills: ["Customer service", "Organization", "Data entry"],
    compatibility: 90,
    days: "Monday, Wednesday, Friday",
    shift: "Morning",
    schedule: "Monday, Wednesday, Friday | 9:00 AM-1:00 PM",
    description:
      "Support students and faculty at the circulation desk, help process course reserves, organize returned materials, and provide friendly help with library account questions.",
    eligibility:
      "Current undergraduate student, minimum 2.5 GPA, eligible for campus employment.",
    status: "Active",
    applications: 24
  },
  {
    id: "job-cs-tutor",
    title: "Intro CS Lab Tutor",
    department: "Computer Science",
    supervisor: "Dr. Priya Menon, CS Lab Coordinator",
    hourlyWage: 17,
    weeklyHours: "8 hrs/week",
    skills: ["Python", "Tutoring", "Debugging"],
    compatibility: 86,
    days: "Tuesday, Thursday",
    shift: "Afternoon",
    schedule: "Tuesday, Thursday | 2:00 PM-6:00 PM",
    description:
      "Assist first-year students during open lab hours, answer programming questions, and help document common debugging patterns.",
    eligibility:
      "Completed Intro to Programming with a B+ or higher and faculty recommendation preferred.",
    status: "Active",
    applications: 18
  },
  {
    id: "job-admissions-aide",
    title: "Admissions Front Desk Aide",
    department: "Admissions Office",
    supervisor: "Marcus Reed, Visitor Experience Lead",
    hourlyWage: 14,
    weeklyHours: "12-15 hrs/week",
    skills: ["Communication", "Scheduling", "Microsoft Office"],
    compatibility: 78,
    days: "Weekdays",
    shift: "Morning",
    schedule: "Weekdays | 8:30 AM-12:30 PM",
    description:
      "Welcome campus guests, answer visitor questions, organize tour materials, and support appointment scheduling.",
    eligibility:
      "Strong communication skills and comfort representing the university to visitors.",
    status: "Draft",
    applications: 9
  },
  {
    id: "job-rec-attendant",
    title: "Recreation Center Attendant",
    department: "Campus Recreation",
    supervisor: "Avery Collins, Facility Manager",
    hourlyWage: 16,
    weeklyHours: "6-10 hrs/week",
    skills: ["First aid", "Teamwork", "Facility support"],
    compatibility: 92,
    days: "Weekends",
    shift: "Evening",
    schedule: "Saturday, Sunday | 4:00 PM-9:00 PM",
    description:
      "Check in students, monitor recreation spaces, reset equipment, and help maintain a welcoming facility environment.",
    eligibility:
      "Current CPR or first-aid certification preferred; training available for selected students.",
    status: "Active",
    applications: 21
  },
  {
    id: "job-wellness-ambassador",
    title: "Wellness Peer Ambassador",
    department: "Student Affairs",
    supervisor: "Nina Alvarez, Wellness Programs",
    hourlyWage: 16,
    weeklyHours: "8-12 hrs/week",
    skills: ["Event support", "Writing", "Peer education"],
    compatibility: 84,
    days: "Mon, Wed, Fri",
    shift: "Afternoon",
    schedule: "Monday, Wednesday, Friday | 1:00 PM-4:00 PM",
    description:
      "Promote wellness programs, help staff pop-up events, and prepare student-facing health resources.",
    eligibility:
      "Interest in student wellness, reliable attendance, and comfort speaking with peers.",
    status: "Active",
    applications: 31
  }
];

export const fallbackStats = {
  totalJobs: 42,
  activeJobs: 28,
  totalApplications: 186,
  departments: 11,
  weeklyApplications: 34
};

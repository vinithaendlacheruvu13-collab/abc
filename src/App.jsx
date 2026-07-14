import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FilePlus2,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRoundCog
} from "lucide-react";
import campusHero from "../assets/campus-hero.png";
import { fallbackJobs, fallbackStats } from "./data/mockData.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const features = [
  {
    title: "Smart Job Filtering",
    copy: "Narrow campus roles by department, skills, hours, days, and shift preferences.",
    icon: SlidersHorizontal
  },
  {
    title: "Schedule Compatibility",
    copy: "See schedule match badges before opening a posting or starting an application.",
    icon: CalendarClock
  },
  {
    title: "Skill-Based Matching",
    copy: "Prioritize jobs where your tutoring, lab, design, or service skills stand out.",
    icon: Sparkles
  },
  {
    title: "Easy Application Tracking",
    copy: "Move from discovery to application with clear next steps and status cues.",
    icon: ClipboardList
  }
];

function App() {
  const [route, setRoute] = useState(window.location.hash.replace("#", "") || "landing");
  const [jobs, setJobs] = useState(fallbackJobs);
  const [stats, setStats] = useState(fallbackStats);
  const [selectedJobId, setSelectedJobId] = useState(fallbackJobs[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    department: "All Departments",
    skill: "Any Skill",
    weeklyHours: 12,
    days: "Mon, Wed, Fri",
    slots: {
      Morning: true,
      Afternoon: true,
      Evening: false
    }
  });

  useEffect(() => {
    async function loadPrototypeData() {
      try {
        const [jobsResponse, statsResponse] = await Promise.all([
          fetch(`${API_BASE}/jobs`),
          fetch(`${API_BASE}/stats`)
        ]);

        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData);
          setSelectedJobId(jobsData[0]?.id || fallbackJobs[0].id);
        }

        if (statsResponse.ok) {
          setStats(await statsResponse.json());
        }
      } catch {
        setJobs(fallbackJobs);
        setStats(fallbackStats);
      }
    }

    loadPrototypeData();
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(window.location.hash.replace("#", "") || "landing");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || jobs[0] || fallbackJobs[0];

  const departments = useMemo(
    () => ["All Departments", ...Array.from(new Set(jobs.map((job) => job.department)))],
    [jobs]
  );

  const skills = useMemo(
    () => ["Any Skill", ...Array.from(new Set(jobs.flatMap((job) => job.skills)))],
    [jobs]
  );

  const visibleJobs = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        [job.title, job.department, job.weeklyHours, ...job.skills]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesDepartment =
        filters.department === "All Departments" || job.department === filters.department;
      const matchesSkill = filters.skill === "Any Skill" || job.skills.includes(filters.skill);
      const matchesHours = Number.parseInt(job.weeklyHours, 10) <= Number(filters.weeklyHours);
      const activeSlots = Object.entries(filters.slots)
        .filter(([, checked]) => checked)
        .map(([slot]) => slot);
      const matchesSlot = activeSlots.length === 0 || activeSlots.includes(job.shift);

      return matchesSearch && matchesDepartment && matchesSkill && matchesHours && matchesSlot;
    });
  }, [filters, jobs]);

  function navigate(nextRoute, jobId) {
    if (jobId) setSelectedJobId(jobId);
    setApplicationSubmitted(false);
    setRoute(nextRoute);
    setMobileNavOpen(false);
    window.history.pushState({ route: nextRoute }, "", `#${nextRoute}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function toggleSlot(slot) {
    setFilters((current) => ({
      ...current,
      slots: {
        ...current.slots,
        [slot]: !current.slots[slot]
      }
    }));
  }

  async function submitApplication(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.jobId = selectedJob.id;

    try {
      await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      // The prototype can still show the success state without a live server.
    }

    setApplicationSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function publishJob(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newJob = Object.fromEntries(formData.entries());

    try {
      await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob)
      });
    } catch {
      // Mock-first prototype: navigation still completes if the API is unavailable.
    }

    navigate("admin");
  }

  return (
    <>
      <Header navigate={navigate} mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
      <main>
        {route === "landing" && <LandingPage navigate={navigate} />}
        {route === "student" && (
          <StudentDashboard
            departments={departments}
            filters={filters}
            jobs={visibleJobs}
            navigate={navigate}
            skills={skills}
            toggleSlot={toggleSlot}
            updateFilter={updateFilter}
          />
        )}
        {route === "details" && <JobDetails job={selectedJob} navigate={navigate} />}
        {route === "apply" && (
          <ApplicationPage
            applicationSubmitted={applicationSubmitted}
            job={selectedJob}
            navigate={navigate}
            submitApplication={submitApplication}
          />
        )}
        {route === "admin" && <AdminDashboard jobs={jobs} navigate={navigate} stats={stats} />}
        {route === "add-job" && <AddJobPage navigate={navigate} publishJob={publishJob} />}
      </main>
    </>
  );
}

function Header({ navigate, mobileNavOpen, setMobileNavOpen }) {
  return (
    <header className="site-header">
      <button className="brand as-link" onClick={() => navigate("landing")} aria-label="Campus Job Board home">
        <span className="brand-mark">CJ</span>
        <span>Campus Job Board</span>
      </button>
      <button className="menu-toggle" aria-label="Open navigation" onClick={() => setMobileNavOpen((open) => !open)}>
        <Menu size={25} />
      </button>
      <nav className={`main-nav ${mobileNavOpen ? "open" : ""}`} aria-label="Primary navigation">
        <button onClick={() => navigate("landing")}>Home</button>
        <button onClick={() => navigate("student")}>Student Dashboard</button>
        <button onClick={() => navigate("admin")}>Admin</button>
      </nav>
    </header>
  );
}

function LandingPage({ navigate }) {
  return (
    <section>
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">University Career Services</p>
          <h1>Find the Right Campus Job That Fits Your Skills and Schedule</h1>
          <p className="hero-text">
            Campus Job Board helps students discover part-time roles across campus, compare schedule fit, and keep
            applications organized from one polished workspace.
          </p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => navigate("student")}>
              Student Login
            </button>
            <button className="btn secondary" onClick={() => navigate("admin")}>
              Admin Login
            </button>
          </div>
        </div>
        <div className="hero-media">
          <img src={campusHero} alt="Illustration of a university building with job match cards" />
        </div>
      </div>

      <section className="features" aria-labelledby="features-title">
        <div className="section-heading">
          <p className="eyebrow">Built for busy students</p>
          <h2 id="features-title">Everything needed to find a job that fits</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="feature-card" key={feature.title}>
                <span className="icon">
                  <Icon size={22} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="footer">
        <span>Campus Job Board Prototype</span>
        <span>Career Services | Student Employment | 2026</span>
      </footer>
    </section>
  );
}

function StudentDashboard({ departments, filters, jobs, navigate, skills, toggleSlot, updateFilter }) {
  return (
    <section className="app-shell">
      <nav className="topbar">
        <div>
          <p className="eyebrow">Student Workspace</p>
          <h2>Welcome back, Maya</h2>
        </div>
        <div className="topbar-actions">
          <button className="btn ghost" onClick={() => navigate("landing")}>
            Home
          </button>
          <button className="btn secondary" onClick={() => navigate("admin")}>
            Admin View
          </button>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className="filter-panel" aria-label="Job filters">
          <h3>Filters</h3>
          <label>
            Department
            <select value={filters.department} onChange={(event) => updateFilter("department", event.target.value)}>
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>
          </label>
          <label>
            Skills
            <select value={filters.skill} onChange={(event) => updateFilter("skill", event.target.value)}>
              {skills.map((skill) => (
                <option key={skill}>{skill}</option>
              ))}
            </select>
          </label>
          <label>
            Weekly Working Hours
            <input
              type="range"
              min="4"
              max="20"
              value={filters.weeklyHours}
              onChange={(event) => updateFilter("weeklyHours", event.target.value)}
            />
            <span className="range-note">Up to {filters.weeklyHours} hours</span>
          </label>
          <label>
            Available Days
            <select value={filters.days} onChange={(event) => updateFilter("days", event.target.value)}>
              <option>Mon, Wed, Fri</option>
              <option>Weekdays</option>
              <option>Weekends</option>
              <option>Tue, Thu</option>
            </select>
          </label>
          <fieldset>
            <legend>Time Slots</legend>
            {["Morning", "Afternoon", "Evening"].map((slot) => (
              <label className="check" key={slot}>
                <input type="checkbox" checked={filters.slots[slot]} onChange={() => toggleSlot(slot)} />
                {slot}
              </label>
            ))}
          </fieldset>
        </aside>

        <section className="job-results">
          <div className="search-row">
            <label className="search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search jobs, departments, or skills"
                aria-label="Search jobs"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
              />
            </label>
            <button className="btn primary">Search</button>
          </div>
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard job={job} key={job.id} navigate={navigate} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function JobCard({ job, navigate }) {
  return (
    <article className="job-card">
      <div className="card-top">
        <span className={`badge ${job.compatibility < 80 ? "gold" : job.compatibility < 90 ? "mint" : ""}`}>
          {job.compatibility}% Schedule Match
        </span>
        <span className="wage">${job.hourlyWage}/hr</span>
      </div>
      <h3>{job.title}</h3>
      <p>{job.department}</p>
      <dl>
        <div>
          <dt>Hours</dt>
          <dd>{job.weeklyHours}</dd>
        </div>
        <div>
          <dt>Skills</dt>
          <dd>{job.skills.join(", ")}</dd>
        </div>
      </dl>
      <div className="card-actions">
        <button className="btn ghost" onClick={() => navigate("details", job.id)}>
          Details
        </button>
        <button className="btn primary" onClick={() => navigate("apply", job.id)}>
          Apply
        </button>
      </div>
    </article>
  );
}

function JobDetails({ job, navigate }) {
  return (
    <section className="detail-page">
      <button className="btn ghost back" onClick={() => navigate("student")}>
        Back to Jobs
      </button>
      <article className="detail-card">
        <div className="detail-header">
          <div>
            <p className="eyebrow">{job.department}</p>
            <h2>{job.title}</h2>
            <p>Supervisor: {job.supervisor}</p>
          </div>
          <span className="badge">{job.compatibility}% Schedule Match</span>
        </div>
        <p className="lead">{job.description}</p>
        <div className="detail-grid">
          <div>
            <h3>Required Skills</h3>
            <p>{job.skills.join(", ")}.</p>
          </div>
          <div>
            <h3>Work Schedule</h3>
            <p>
              {job.schedule} | {job.weeklyHours}
            </p>
          </div>
          <div>
            <h3>Hourly Wage</h3>
            <p>${job.hourlyWage} per hour</p>
          </div>
          <div>
            <h3>Eligibility Requirements</h3>
            <p>{job.eligibility}</p>
          </div>
        </div>
        <button className="btn primary wide" onClick={() => navigate("apply", job.id)}>
          Apply Now
        </button>
      </article>
    </section>
  );
}

function ApplicationPage({ applicationSubmitted, job, navigate, submitApplication }) {
  return (
    <section className="form-page">
      <button className="btn ghost back" onClick={() => navigate("details", job.id)}>
        Back to Job Details
      </button>
      {!applicationSubmitted ? (
        <form className="prototype-form" onSubmit={submitApplication}>
          <div className="form-heading">
            <p className="eyebrow">Application</p>
            <h2>Apply for {job.title}</h2>
          </div>
          <div className="form-grid">
            <label>
              Student Name
              <input name="studentName" type="text" defaultValue="Maya Chen" />
            </label>
            <label>
              Student ID
              <input name="studentId" type="text" defaultValue="S1029487" />
            </label>
            <label>
              Department
              <input name="department" type="text" defaultValue="Information Systems" />
            </label>
            <label>
              Skills
              <input name="skills" type="text" defaultValue="Customer service, data entry, research" />
            </label>
            <label>
              Available Time Slots
              <select name="availableTimeSlots" defaultValue="Morning and Afternoon">
                <option>Morning and Afternoon</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </label>
            <label>
              Resume Upload
              <input name="resume" type="file" />
            </label>
          </div>
          <button className="btn primary wide" type="submit">
            Submit Application
          </button>
        </form>
      ) : (
        <section className="success-card">
          <span className="success-icon">
            <CheckCircle2 size={28} />
          </span>
          <h2>Application Submitted</h2>
          <p>
            Your application for {job.title} has been recorded in this prototype. Career Services would show
            application status updates here.
          </p>
          <button className="btn primary" onClick={() => navigate("student")}>
            Return to Dashboard
          </button>
        </section>
      )}
    </section>
  );
}

function AdminDashboard({ jobs, navigate, stats }) {
  return (
    <section className="admin-shell">
      <aside className="sidebar">
        <button className="brand as-link" onClick={() => navigate("admin")}>
          <span className="brand-mark">CJ</span>
          <span>Campus Jobs</span>
        </button>
        <nav>
          <button className="active" onClick={() => navigate("admin")}>
            <LayoutDashboard size={17} />
            Dashboard
          </button>
          <button onClick={() => navigate("add-job")}>
            <FilePlus2 size={17} />
            Add Job
          </button>
          <button onClick={() => navigate("student")}>
            <GraduationCap size={17} />
            Student View
          </button>
        </nav>
      </aside>
      <section className="admin-main">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h2>Student Employment Overview</h2>
          </div>
          <button className="btn primary" onClick={() => navigate("add-job")}>
            Add Job
          </button>
        </div>
        <div className="stats-grid">
          <article>
            <span>Total Jobs</span>
            <strong>{stats.totalJobs}</strong>
            <p>Across {stats.departments} departments</p>
          </article>
          <article>
            <span>Active Jobs</span>
            <strong>{stats.activeJobs}</strong>
            <p>Currently accepting applications</p>
          </article>
          <article>
            <span>Total Applications</span>
            <strong>{stats.totalApplications}</strong>
            <p>{stats.weeklyApplications} received this week</p>
          </article>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Wage</th>
                <th>Status</th>
                <th>Applications</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>${job.hourlyWage}/hr</td>
                  <td>
                    <span className={`status ${job.status === "Active" ? "open" : "draft"}`}>{job.status}</span>
                  </td>
                  <td>{job.applications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function AddJobPage({ navigate, publishJob }) {
  return (
    <section className="form-page">
      <button className="btn ghost back" onClick={() => navigate("admin")}>
        Back to Admin
      </button>
      <form className="prototype-form" onSubmit={publishJob}>
        <div className="form-heading">
          <p className="eyebrow">New Listing</p>
          <h2>Add Campus Job</h2>
        </div>
        <div className="form-grid">
          <label>
            Job Title
            <input name="title" type="text" defaultValue="Biology Lab Prep Assistant" />
          </label>
          <label>
            Department
            <input name="department" type="text" defaultValue="Biology Department" />
          </label>
          <label>
            Hourly Wage
            <input name="hourlyWage" type="text" defaultValue="$16.50" />
          </label>
          <label>
            Required Skills
            <input name="skills" type="text" defaultValue="Lab safety, organization, Excel" />
          </label>
          <label>
            Weekly Hours
            <input name="weeklyHours" type="text" defaultValue="8-10" />
          </label>
          <label>
            Working Days
            <input name="days" type="text" defaultValue="Tuesday, Thursday" />
          </label>
          <label>
            Shift Timing
            <select name="shift" defaultValue="Afternoon">
              <option>Afternoon</option>
              <option>Morning</option>
              <option>Evening</option>
            </select>
          </label>
          <label className="span-2">
            Job Description
            <textarea
              name="description"
              rows="5"
              defaultValue="Prepare lab stations, inventory supplies, clean equipment, and assist faculty with introductory biology lab setup."
            />
          </label>
        </div>
        <button className="btn primary wide" type="submit">
          Publish Job
        </button>
      </form>
    </section>
  );
}

export default App;

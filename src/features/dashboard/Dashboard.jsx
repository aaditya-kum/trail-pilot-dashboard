import { useNavigate } from "react-router-dom";
import "./dashboard.scss";

const stats = [
  { label: "Projects", value: "24", detail: "+3 this month", tone: "blue" },
  { label: "Tasks", value: "18", detail: "6 completed", tone: "purple" },
  { label: "Team members", value: "12", detail: "2 online", tone: "green" },
];

const activities = [
  {
    title: "Website redesign",
    category: "Project",
    status: "In progress",
    date: "Today",
  },
  {
    title: "Dashboard review",
    category: "Meeting",
    status: "Scheduled",
    date: "Tomorrow",
  },
  {
    title: "Q4 planning",
    category: "Planning",
    status: "Draft",
    date: "Nov 12",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <button
          className="dashboard-primary-button"
          onClick={() => navigate("/projects")}
        >
          View projects
        </button>
      </header>

      <section className="dashboard-stats" aria-label="Dashboard summary">
        {stats.map((stat) => (
          <article className="dashboard-stat-card" key={stat.label}>
            <div
              className={`dashboard-stat-icon dashboard-stat-icon--${stat.tone}`}
              aria-hidden="true"
            >
              {stat.label.charAt(0)}
            </div>
            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span>{stat.detail}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <p className="dashboard-eyebrow">Activity</p>
            <h2>Recent items</h2>
          </div>
          <button
            className="dashboard-link-button"
            onClick={() => navigate("/projects")}
          >
            View all
          </button>
        </div>

        <div
          className="dashboard-table"
          role="table"
          aria-label="Recent activity"
        >
          <div className="dashboard-table-row dashboard-table-head" role="row">
            <span role="columnheader">Name</span>
            <span role="columnheader">Type</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Date</span>
          </div>
          {activities.map((item) => (
            <div className="dashboard-table-row" role="row" key={item.title}>
              <strong role="cell">{item.title}</strong>
              <span role="cell">{item.category}</span>
              <span role="cell">
                <span className="dashboard-status">{item.status}</span>
              </span>
              <span role="cell">{item.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

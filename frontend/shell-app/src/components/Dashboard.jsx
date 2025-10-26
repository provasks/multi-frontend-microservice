import React, { useState, useEffect } from 'react';
import { useAuth } from 'sharedComponents/useAuth';
import { apiHelpers } from 'sharedComponents/unifiedApiClient';
import LoadingSpinner from 'sharedComponents/LoadingSpinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    tasks: {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0
    },
    users: {
      total: 0,
      active: 0
    },
    notifications: {
      total: 0,
      unread: 0
    },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated()) {
        setError('Please log in to view dashboard');
        return;
      }

      // Fetch data from all services
      const [tasksData, usersData, notificationsData] = await Promise.all([
        apiHelpers.fetchTasks(1, 1000).catch(err => { // Fetch all tasks (up to 1000)
          console.warn('Failed to fetch tasks:', err);
          return { tasks: [] };
        }),
        apiHelpers.fetchUsers().catch(err => {
          console.warn('Failed to fetch users:', err);
          return { users: [] };
        }),
        apiHelpers.fetchNotifications().catch(err => {
          console.warn('Failed to fetch notifications:', err);
          return { notifications: [] };
        })
      ]);

      const tasks = tasksData.tasks || tasksData || [];
      const users = usersData.users || usersData || [];
      const notifications = notificationsData.notifications || notificationsData || [];

      // Calculate task statistics
      const now = new Date();
      const taskStats = {
        total: tasks.length,
        completed: tasks.filter(task => task.status === 'completed').length,
        pending: tasks.filter(task => task.status === 'pending').length,
        inProgress: tasks.filter(task => task.status === 'in_progress').length,
        overdue: tasks.filter(task => 
          task.status !== 'completed' && 
          task.status !== 'cancelled' &&
          task.dueDate && 
          new Date(task.dueDate) < now
        ).length,
        highPriority: tasks.filter(task => task.priority === 'high').length,
        mediumPriority: tasks.filter(task => task.priority === 'medium').length,
        lowPriority: tasks.filter(task => task.priority === 'low').length,
        urgentPriority: tasks.filter(task => task.priority === 'urgent').length
      };

      // Calculate user statistics
      const userStats = {
        total: users.length,
        active: users.filter(user => user.isActive !== false).length
      };

      // Calculate notification statistics
      const notificationStats = {
        total: notifications.length,
        unread: notifications.filter(notif => !notif.read).length
      };

      // Get recent activity (last 5 tasks)
      const recentActivity = tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setDashboardData({
        tasks: taskStats,
        users: userStats,
        notifications: notificationStats,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="col-lg col-md-4 col-sm-12 mb-4">
      <div className={`card stat-card border-${color}`}>
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className={`stat-icon bg-${color} text-white`}>
              <i className={icon}></i>
            </div>
            <div className="ms-3">
              <h5 className="card-title mb-0">{value}</h5>
              <p className="card-text text-muted mb-0">{title}</p>
              {subtitle && <small className="text-muted">{subtitle}</small>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Chart data preparation
  const getTaskStatusChartData = () => ({
    labels: ['Completed', 'Pending', 'In Progress', 'Overdue'],
    datasets: [{
      data: [
        dashboardData.tasks.completed,
        dashboardData.tasks.pending,
        dashboardData.tasks.inProgress,
        dashboardData.tasks.overdue
      ],
      backgroundColor: [
        '#28a745', // Green for completed
        '#ffc107', // Yellow for pending
        '#17a2b8', // Blue for in progress
        '#dc3545'  // Red for overdue
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  });

  const getTaskPriorityChartData = () => ({
    labels: ['Urgent', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Task Count',
        data: [
          dashboardData.tasks.urgentPriority,
          dashboardData.tasks.highPriority,
          dashboardData.tasks.mediumPriority,
          dashboardData.tasks.lowPriority
        ],
        backgroundColor: [
          '#6f42c1', // Urgent - Purple
          '#dc3545', // High - Red
          '#ffc107', // Medium - Yellow
          '#17a2b8'  // Low - Blue
        ],
        borderColor: [
          '#5a32a3', // Urgent - Dark Purple
          '#b02a37', // High - Dark Red
          '#d39e00', // Medium - Dark Yellow
          '#138496'  // Low - Dark Blue
        ],
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 60
      }
    ]
  });

  const getSystemOverviewChartData = () => ({
    labels: ['Users', 'Notifications', 'Tasks'],
    datasets: [{
      label: 'System Overview',
      data: [
        dashboardData.users.total,
        dashboardData.notifications.total,
        dashboardData.tasks.total
      ],
      backgroundColor: [
        '#6f42c1', // Purple for users
        '#20c997', // Teal for notifications
        '#fd7e14'  // Orange for tasks
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  });

  const getTaskTrendData = () => {
    // Generate sample trend data (in real app, this would come from API)
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Tasks Created',
          data: [2, 4, 3, 5, 7, 6, 8], // Sample data
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4
        },
        {
          label: 'Tasks Completed',
          data: [1, 3, 2, 4, 5, 4, 6], // Sample data
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, index) => {
                const dataset = data.datasets[0];
                return {
                  text: label,
                  fillStyle: dataset.backgroundColor[index],
                  strokeStyle: dataset.borderColor[index],
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'rect',
                  hidden: false,
                  index: index
                };
              });
            }
            return [];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        display: false, // Hide x-axis labels since legend shows the priority levels
        grid: {
          display: false
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const ProgressBar = ({ label, value, total, color }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="fw-medium">{label}</span>
          <span className="text-muted">{value}/{total}</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div 
            className={`progress-bar bg-${color}`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
          ></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <i className="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </h2>
          <p className="text-muted mb-0">Overview of your task management system</p>
        </div>
        <button 
          className="btn btn-outline-primary"
          onClick={fetchDashboardData}
          title="Refresh Dashboard"
        >
          <i className="fas fa-sync-alt me-1"></i>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <StatCard
          title="Total Tasks"
          value={dashboardData.tasks.total}
          icon="fas fa-tasks"
          color="primary"
        />
        <StatCard
          title="Completed Tasks"
          value={dashboardData.tasks.completed}
          icon="fas fa-check-circle"
          color="success"
          subtitle={`${dashboardData.tasks.total > 0 ? Math.round((dashboardData.tasks.completed / dashboardData.tasks.total) * 100) : 0}% completion rate`}
        />
        <StatCard
          title="Pending Tasks"
          value={dashboardData.tasks.pending}
          icon="fas fa-clock"
          color="warning"
        />
        <StatCard
          title="In Progress Tasks"
          value={dashboardData.tasks.inProgress}
          icon="fas fa-play-circle"
          color="info"
        />
        <StatCard
          title="Overdue Tasks"
          value={dashboardData.tasks.overdue}
          icon="fas fa-exclamation-triangle"
          color="danger"
        />
      </div>

      {/* First Row: 3 Charts */}
      <div className="row">
        {/* Task Status Distribution - Pie Chart */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Task Status Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Pie data={getTaskStatusChartData()} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Task Priority Distribution - Bar Chart */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Task Priority Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Bar data={getTaskPriorityChartData()} options={barChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Task Trends - Line Chart */}
        <div className="col-lg-4 col-md-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Task Trends (Last 7 Days)
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Line data={getTaskTrendData()} options={lineChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: System Overview and Recent Activity */}
      <div className="row">
        {/* System Overview - Doughnut Chart */}
        <div className="col-lg-6 col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-doughnut me-2"></i>
                System Overview
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <Doughnut data={getSystemOverviewChartData()} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Grouped by Status */}
        <div className="col-lg-6 col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-history me-2"></i>
                Recent Activity
              </h5>
            </div>
            <div className="card-body p-0">
              {dashboardData.recentActivity.length > 0 ? (
                <div className="accordion" id="recentActivityAccordion">
                  {/* Group by Status */}
                  {['completed', 'pending', 'overdue'].map((status, statusIndex) => {
                    const statusTasks = dashboardData.recentActivity.filter(task => {
                      if (status === 'overdue') {
                        return task.status !== 'completed' && 
                               task.dueDate && 
                               new Date(task.dueDate) < new Date();
                      }
                      return task.status === status;
                    });

                    if (statusTasks.length === 0) return null;

                    const statusConfig = {
                      completed: { 
                        icon: 'fas fa-check-circle', 
                        color: 'success', 
                        label: 'Completed Tasks',
                        bgColor: 'bg-success'
                      },
                      pending: { 
                        icon: 'fas fa-clock', 
                        color: 'warning', 
                        label: 'Pending Tasks',
                        bgColor: 'bg-warning'
                      },
                      overdue: { 
                        icon: 'fas fa-exclamation-triangle', 
                        color: 'danger', 
                        label: 'Overdue Tasks',
                        bgColor: 'bg-danger'
                      }
                    };

                    const config = statusConfig[status];

                    return (
                      <div key={status} className="accordion-item border-0">
                        <h2 className="accordion-header" id={`heading${status}`}>
                          <button 
                            className={`accordion-button ${statusIndex !== 0 ? 'collapsed' : ''}`}
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target={`#collapse${status}`}
                            aria-expanded={statusIndex === 0 ? 'true' : 'false'}
                            aria-controls={`collapse${status}`}
                          >
                            <div className="d-flex align-items-center w-100">
                              <div className="me-3">
                                <span className={`badge ${config.bgColor} me-2`}>
                                  <i className={config.icon}></i>
                                </span>
                                <span className="badge bg-light text-dark">
                                  {statusTasks.length} {statusTasks.length === 1 ? 'task' : 'tasks'}
                                </span>
                              </div>
                              <div className="flex-grow-1 text-start">
                                <h6 className="mb-0">{config.label}</h6>
                                <small className="text-muted">
                                  {statusTasks.length === 1 ? '1 task' : `${statusTasks.length} tasks`} in this category
                                </small>
                              </div>
                            </div>
                          </button>
                        </h2>
                        <div 
                          id={`collapse${status}`}
                          className={`accordion-collapse collapse ${statusIndex === 0 ? 'show' : ''}`}
                          aria-labelledby={`heading${status}`}
                          data-bs-parent="#recentActivityAccordion"
                        >
                          <div className="accordion-body">
                            <div className="list-group list-group-flush">
                              {statusTasks.map((task, taskIndex) => (
                                <div key={task._id || taskIndex} className="list-group-item border-0 px-0">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1">{task.title}</h6>
                                      <p className="mb-1 text-muted small">{task.description || 'No description'}</p>
                                      <div className="d-flex align-items-center">
                                        <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'} me-2`}>
                                          {task.priority}
                                        </span>
                                        <small className="text-muted">
                                          <i className="fas fa-calendar me-1"></i>
                                          {new Date(task.createdAt).toLocaleDateString()}
                                        </small>
                                      </div>
                                    </div>
                                    <div className="text-end">
                                      <span className={`badge bg-${task.status === 'completed' ? 'success' : 'secondary'}`}>
                                        {task.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-inbox fa-3x mb-3"></i>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

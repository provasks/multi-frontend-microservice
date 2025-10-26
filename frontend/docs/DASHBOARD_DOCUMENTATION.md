# Dashboard Documentation - Task Management System

## 📊 Overview

The Dashboard is the main landing page of the Task Management System, providing comprehensive analytics and real-time insights into system performance, task management, and user activity.

## 🏗️ Architecture

### **Component Structure**
```
Dashboard.jsx
├── Summary Cards (4 cards)
├── Chart Row 1 (3 charts)
│   ├── Task Status Distribution (Pie Chart)
│   ├── Task Priority Distribution (Bar Chart)
│   └── Task Trends (Line Chart)
└── Chart Row 2 (2 sections)
    ├── System Overview (Doughnut Chart)
    └── Recent Activity (Accordion)
```

## 📈 Chart Components

### **1. Task Status Distribution (Pie Chart)**
- **Purpose**: Visual representation of task completion status
- **Data**: Completed, Pending, Overdue tasks
- **Colors**: Green (Completed), Yellow (Pending), Red (Overdue)
- **Chart Type**: Pie chart with responsive design

```javascript
const getTaskStatusChartData = () => ({
  labels: ['Completed', 'Pending', 'Overdue'],
  datasets: [{
    data: [
      dashboardData.tasks.completed,
      dashboardData.tasks.pending,
      dashboardData.tasks.overdue
    ],
    backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
    borderWidth: 2,
    borderColor: '#fff'
  }]
});
```

### **2. Task Priority Distribution (Bar Chart)**
- **Purpose**: Breakdown of tasks by priority level
- **Data**: High, Medium, Low priority tasks
- **Colors**: Red (High), Yellow (Medium), Blue (Low)
- **Chart Type**: Bar chart with individual datasets for each priority

```javascript
const getTaskPriorityChartData = () => ({
  labels: ['High Priority', 'Medium Priority', 'Low Priority'],
  datasets: [
    {
      label: 'High Priority',
      data: [highPriorityCount, 0, 0],
      backgroundColor: '#dc3545'
    },
    {
      label: 'Medium Priority',
      data: [0, mediumPriorityCount, 0],
      backgroundColor: '#ffc107'
    },
    {
      label: 'Low Priority',
      data: [0, 0, lowPriorityCount],
      backgroundColor: '#17a2b8'
    }
  ]
});
```

### **3. Task Trends (Line Chart)**
- **Purpose**: Track task creation and completion over time
- **Data**: Last 7 days of task activity
- **Lines**: Tasks Created, Tasks Completed
- **Chart Type**: Line chart with trend analysis

```javascript
const getTaskTrendData = () => ({
  labels: last7Days, // ['Oct 20', 'Oct 21', ...]
  datasets: [
    {
      label: 'Tasks Created',
      data: [2, 4, 3, 5, 7, 6, 8],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.4
    },
    {
      label: 'Tasks Completed',
      data: [1, 3, 2, 4, 5, 4, 6],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      tension: 0.4
    }
  ]
});
```

### **4. System Overview (Doughnut Chart)**
- **Purpose**: High-level system statistics
- **Data**: Users, Notifications, Tasks
- **Colors**: Purple (Users), Teal (Notifications), Orange (Tasks)
- **Chart Type**: Doughnut chart with center space

```javascript
const getSystemOverviewChartData = () => ({
  labels: ['Users', 'Notifications', 'Tasks'],
  datasets: [{
    label: 'System Overview',
    data: [
      dashboardData.users.total,
      dashboardData.notifications.total,
      dashboardData.tasks.total
    ],
    backgroundColor: ['#6f42c1', '#20c997', '#fd7e14'],
    borderWidth: 2,
    borderColor: '#fff'
  }]
});
```

## 📋 Summary Cards

### **Card Layout**
Four summary cards display key metrics with icons and percentages:

1. **Total Tasks**
   - Icon: `fas fa-list-ul`
   - Color: Primary (Blue)
   - Shows: Total task count

2. **Completed Tasks**
   - Icon: `fas fa-check-circle`
   - Color: Success (Green)
   - Shows: Completed count + percentage

3. **Pending Tasks**
   - Icon: `fas fa-hourglass-half`
   - Color: Warning (Yellow)
   - Shows: Pending task count

4. **Overdue Tasks**
   - Icon: `fas fa-exclamation-triangle`
   - Color: Danger (Red)
   - Shows: Overdue task count

### **Card Styling**
```css
.stat-card {
  height: 90px;
  border-left: 4px solid;
  background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

## 📝 Recent Activity (Accordion)

### **Accordion Structure**
The Recent Activity section uses Bootstrap accordion with status-based grouping:

#### **Status Groups**
1. **Completed Tasks** (Green badge with check icon)
2. **Pending Tasks** (Yellow badge with clock icon)
3. **Overdue Tasks** (Red badge with warning icon)

#### **Accordion Items**
Each accordion item contains:
- **Header**: Status icon, task count, group name
- **Body**: List of tasks with details
  - Task title and description
  - Priority badge
  - Creation date
  - Status badge

#### **Accordion Configuration**
```javascript
{['completed', 'pending', 'overdue'].map((status, statusIndex) => {
  const statusTasks = dashboardData.recentActivity.filter(task => {
    if (status === 'overdue') {
      return task.status !== 'completed' && 
             task.dueDate && 
             new Date(task.dueDate) < new Date();
    }
    return task.status === status;
  });

  return (
    <div key={status} className="accordion-item">
      <h2 className="accordion-header">
        <button className="accordion-button">
          <div className="d-flex align-items-center w-100">
            <span className={`badge ${config.bgColor} me-2`}>
              <i className={config.icon}></i>
            </span>
            <span className="badge bg-light text-dark">
              {statusTasks.length} {statusTasks.length === 1 ? 'task' : 'tasks'}
            </span>
            <div className="flex-grow-1 text-start">
              <h6 className="mb-0">{config.label}</h6>
            </div>
          </div>
        </button>
      </h2>
      <div className="accordion-collapse collapse">
        <div className="accordion-body">
          {/* Task list items */}
        </div>
      </div>
    </div>
  );
})}
```

## 🎨 Styling & Layout

### **Responsive Design**
- **Desktop**: 3 charts in first row, 2 sections in second row
- **Tablet**: 2 charts per row with adjusted heights
- **Mobile**: Single column layout with compact cards

### **Card Heights**
- **Summary Cards**: 90px height
- **Chart Cards**: 320px height (desktop), 280px (mobile)
- **Consistent spacing**: 1.5rem padding, 0.5rem margins

### **Color Scheme**
- **Primary**: Bootstrap blue (#007bff)
- **Success**: Green (#28a745)
- **Warning**: Yellow (#ffc107)
- **Danger**: Red (#dc3545)
- **Info**: Blue (#17a2b8)

## 🔄 Data Flow

### **Data Fetching**
```javascript
const fetchData = async () => {
  setLoading(true);
  try {
    // Fetch tasks
    const tasksResponse = await apiHelpers.fetchTasks();
    const tasks = tasksResponse.tasks || [];

    // Calculate statistics
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const overdueTasks = tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length;

    // Fetch users and notifications
    const usersResponse = await apiHelpers.fetchUsers();
    const notificationsResponse = await apiHelpers.fetchNotifications();

    // Update dashboard data
    setDashboardData({
      tasks: { total, completed, pending, overdue, ... },
      users: { total, active },
      notifications: { total, unread },
      recentActivity: tasks.slice(0, 5).sort(...)
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};
```

### **Real-time Updates**
- **Refresh Button**: Manual data refresh with loading state
- **Auto-refresh**: Optional automatic data updates
- **Error Handling**: Graceful error display with retry options

## 🛠️ Configuration

### **Chart Options**
```javascript
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
```

### **Environment Configuration**
- **Development**: Sample data for testing
- **Production**: Real API data
- **Testing**: Mock data for unit tests

## 🚀 Performance

### **Optimizations**
- **Lazy Loading**: Charts load only when visible
- **Memoization**: Chart data cached to prevent unnecessary re-renders
- **Responsive Images**: Optimized chart rendering
- **Bundle Splitting**: Chart.js loaded separately

### **Loading States**
- **Skeleton Loading**: Placeholder cards during data fetch
- **Spinner**: Loading indicator for refresh operations
- **Error States**: Graceful error handling with retry options

## 🔧 Customization

### **Adding New Charts**
1. Create chart data function
2. Add chart component to layout
3. Update responsive breakpoints
4. Add chart options configuration

### **Modifying Colors**
Update the color arrays in chart data functions:
```javascript
backgroundColor: [
  '#dc3545', // Red
  '#ffc107', // Yellow
  '#17a2b8'  // Blue
]
```

### **Adding New Metrics**
1. Update `fetchData` function
2. Add new summary card
3. Update dashboard data structure
4. Add corresponding chart if needed

## 📱 Mobile Responsiveness

### **Breakpoints**
- **Large (≥992px)**: Full desktop layout
- **Medium (768px-991px)**: 2-column layout
- **Small (<768px)**: Single column layout

### **Mobile Optimizations**
- **Touch-friendly**: Larger touch targets
- **Compact Cards**: Reduced padding and margins
- **Simplified Charts**: Fewer data points for better readability
- **Accordion**: Collapsible sections for space efficiency

## 🎯 Future Enhancements

### **Planned Features**
- **Real-time Updates**: WebSocket integration for live data
- **Custom Date Ranges**: User-selectable time periods
- **Export Functionality**: PDF/Excel export of dashboard data
- **Drill-down Capability**: Click charts to view detailed data
- **Custom Dashboards**: User-configurable dashboard layouts
- **Advanced Analytics**: Trend analysis and forecasting

### **Performance Improvements**
- **Virtual Scrolling**: For large datasets
- **Data Caching**: Redis integration for faster loading
- **Progressive Loading**: Load charts as user scrolls
- **Offline Support**: Service worker for offline dashboard viewing

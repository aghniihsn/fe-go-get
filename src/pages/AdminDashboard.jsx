import AdminSidebar from "../components/organisms/AdminSidebar"

const AdminDashboard = () => {
  const stats = [
    { title: "Total Movies", value: "24", change: "+12%" },
    { title: "Active Schedules", value: "156", change: "+8%" },
    { title: "Tickets Sold", value: "1,234", change: "+23%" },
    { title: "Revenue", value: "$45,678", change: "+15%" },
  ]

  const recentActivities = [
    { action: "New movie added", details: "The Silent Wave", time: "2 hours ago" },
    { action: "Schedule updated", details: "Evening shows", time: "4 hours ago" },
    { action: "Tickets sold", details: "25 tickets for Galactic Quest", time: "6 hours ago" },
    { action: "User registered", details: "New customer signup", time: "8 hours ago" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

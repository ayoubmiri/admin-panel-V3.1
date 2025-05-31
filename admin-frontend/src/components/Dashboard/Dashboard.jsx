import React from 'react';
import StatsCards from './StatsCards';
import Charts from './Charts';
import RecentStudents from './RecentStudents';
// import UpcomingEvents from './UpcomingEvents';
// import RecentAnnouncements from './RecentAnnouncements';

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6">
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Charts />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentStudents />
        </div>
        <div>
          {/* <UpcomingEvents /> */}
        </div>
      </div>

      {/* Recent Announcements */}
      {/* <RecentAnnouncements /> */}
    </div>
  );
};

export default Dashboard;
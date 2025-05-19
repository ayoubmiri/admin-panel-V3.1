import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getEnrollmentStats, getAttendanceStats } from '../../services/dashboardService';

const Charts = () => {
  const studentsChartRef = useRef(null);
  const attendanceChartRef = useRef(null);
  const studentsChartInstance = useRef(null);
  const attendanceChartInstance = useRef(null);

  useEffect(() => {
    const fetchDataAndRenderCharts = async () => {
      try {
        const [enrollmentData, attendanceData] = await Promise.all([
          getEnrollmentStats(),
          getAttendanceStats()
        ]);

        // Destroy previous chart instances if they exist
        if (studentsChartInstance.current) {
          studentsChartInstance.current.destroy();
        }
        if (attendanceChartInstance.current) {
          attendanceChartInstance.current.destroy();
        }

        // Students by Program Chart
        const studentsCtx = studentsChartRef.current.getContext('2d');
        studentsChartInstance.current = new Chart(studentsCtx, {
          type: 'bar',
          data: {
            labels: enrollmentData.labels,
            datasets: [{
              label: 'Number of Students',
              data: enrollmentData.data,
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(20, 184, 166, 0.7)',
                'rgba(244, 63, 94, 0.7)'
              ],
              borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(139, 92, 246, 1)',
                'rgba(20, 184, 166, 1)',
                'rgba(244, 63, 94, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        // Attendance Rate Chart
        const attendanceCtx = attendanceChartRef.current.getContext('2d');
        attendanceChartInstance.current = new Chart(attendanceCtx, {
          type: 'doughnut',
          data: {
            labels: attendanceData.labels,
            datasets: [{
              data: attendanceData.data,
              backgroundColor: [
                'rgba(16, 185, 129, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(245, 158, 11, 0.7)'
              ],
              borderColor: [
                'rgba(16, 185, 129, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };

    fetchDataAndRenderCharts();

    // Cleanup function to destroy chart instances
    return () => {
      if (studentsChartInstance.current) {
        studentsChartInstance.current.destroy();
      }
      if (attendanceChartInstance.current) {
        attendanceChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Students Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Enrollment by Program</h3>
        <canvas ref={studentsChartRef} height="250"></canvas>
      </div>
      
      {/* Attendance Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Attendance Rate</h3>
        <canvas ref={attendanceChartRef} height="250"></canvas>
      </div>
    </div>
  );
};

export default Charts;
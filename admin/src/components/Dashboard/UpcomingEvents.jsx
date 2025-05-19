import React, { useState, useEffect } from 'react';
import { getUpcomingEvents } from '../../services/dashboardService';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow animate-pulse">
        <div className="p-4 border-b h-16 bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Upcoming Events</h2>
      </div>
      <div className="p-4 space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-start">
            <div className="bg-est-blue text-white rounded-lg p-2 text-center min-w-[50px] mr-4">
              <div className="font-bold text-lg">{new Date(event.date).getDate()}</div>
              <div className="text-xs">
                {new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
              </div>
            </div>
            <div>
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-gray-500 text-sm">
                {event.startTime} - {event.endTime}
              </p>
              <p className="text-gray-600 text-sm mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t text-right">
        <a href="#" className="text-sm text-est-blue hover:underline">
          View all events →
        </a>
      </div>
    </div>
  );
};

export default UpcomingEvents;
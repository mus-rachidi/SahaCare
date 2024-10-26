import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BiChevronLeft, BiChevronRight, BiPlus, BiTime } from 'react-icons/bi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import AddAppointmentModal from '../components/Modals/AddApointmentModal';

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate('prev');
  };

  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate('next');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const goToMonth = () => {
    toolbar.onView('month');
  };

  const goToWeek = () => {
    toolbar.onView('week');
  };

  const goToDay = () => {
    toolbar.onView('day');
  };

  const viewNamesGroup = [
    { view: 'month', label: 'Month' },
    { view: 'week', label: 'Week' },
    { view: 'day', label: 'Day' },
  ];

  return (
    <div className="flex flex-col gap-8 mb-8">
      <h1 className="text-xl font-semibold">Appointments</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-4">
        <div className="md:col-span-1 flex sm:justify-start justify-center items-center">
          <button onClick={goToCurrent} className="px-6 py-2 border border-subMain rounded-md text-subMain">
            Today
          </button>
        </div>
        <div className="md:col-span-9 flex-rows gap-4">
          <button onClick={goToBack} className="text-2xl text-subMain">
            <BiChevronLeft />
          </button>
          <span className="text-xl font-semibold">
            {moment(toolbar.date).format('MMMM YYYY')}
          </span>
          <button onClick={goToNext} className="text-2xl text-subMain">
            <BiChevronRight />
          </button>
        </div>
        <div className="md:col-span-2 grid grid-cols-3 rounded-md border border-subMain">
          {viewNamesGroup.map((item, index) => (
            <button
              key={index}
              onClick={item.view === 'month' ? goToMonth : item.view === 'week' ? goToWeek : goToDay}
              className={`border-l text-xl py-2 flex-colo border-subMain ${
                toolbar.view === item.view ? 'bg-subMain text-white' : 'text-subMain'
              }`}
            >
              {item.view === 'month' ? <HiOutlineViewGrid /> : item.view === 'week' ? <HiOutlineCalendarDays /> : <BiTime />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

function Appointments() {
  const localizer = momentLocalizer(moment);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [services, setServices] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch services and appointments from the backend
// Fetch services, appointments, and patients from the backend
useEffect(() => {
  const fetchData = async () => {
    try {
      const servicesResponse = await fetch('http://localhost:5000/api/services');
      const servicesData = await servicesResponse.json();
      setServices(servicesData);

      const eventsResponse = await fetch('http://localhost:5000/api/appointments');
      const eventsData = await eventsResponse.json();

      // Fetch patients' data
      const patientsResponse = await fetch('http://localhost:5000/api/patients');
      const patientsData = await patientsResponse.json();
      const patientsMap = Object.fromEntries(patientsData.map(patient => [patient.id, patient.FullName]));

      // Map events to the required format with date and time
      const mappedEvents = eventsData.map(event => {
        // Parse date and time to create valid Date objects for start and end
        const eventDate = moment(event.date).format('YYYY-MM-DD'); // Extract date part
        const startTime = event.from_time ? `${eventDate}T${event.from_time}` : `${eventDate}T00:00:00`;
        const endTime = event.to_time ? `${eventDate}T${event.to_time}` : `${eventDate}T00:00:00`;

        return {
          id: event.id,
          title: patientsMap[event.patient_id] || 'Unknown Patient', // Use patient's full name
          start: new Date(startTime),
          end: new Date(endTime),
          color: '#66B5A3', // Optional: Set a color for the event
        };
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);


  

  const handleClose = () => {
    setOpen(!open);
    setData({});
  };

  const handleEventClick = (event) => {
    setData(event);
    setOpen(!open);
  };

  return (
    <Layout>
      {open && (
        <AddAppointmentModal
          datas={data}
          isOpen={open}
          closeModal={handleClose}
        />
      )}
      <button
        onClick={handleClose}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 900,
          marginBottom: 50,
        }}
        onSelectEvent={handleEventClick}
        defaultDate={new Date()}
        timeslots={1}
        resizable
        step={60}
        selectable
        eventPropGetter={(event) => {
          const style = {
            backgroundColor: event.color || '#66B5A3',
            borderRadius: '10px',
            color: 'white',
            border: '1px',
            borderColor: '#F2FAF8',
            fontSize: '12px',
            padding: '5px 5px',
          };
          return { style };
        }}
        dayPropGetter={() => ({ style: { backgroundColor: 'white' } })}
        views={['month', 'day', 'week']}
        components={{ toolbar: CustomToolbar }}
      />
    </Layout>
  );
}

export default Appointments;

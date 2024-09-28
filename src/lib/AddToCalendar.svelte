<script>
    // Event details
    let event = {
      title: 'Event Title',
      description: 'Event Description',
      location: 'Event Location',
      start: '2023-10-31T09:00:00', // ISO format
      end: '2023-10-31T10:00:00'
    };
  
    let showOptions = false;
  
    // Format dates for URLs
    function formatDateForUrl(dateStr) {
      return dateStr.replace(/-|:|\.\d\d\d/g, '');
    }
  
    // Generate Google Calendar link
    let googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateForUrl(event.start)}/${formatDateForUrl(event.end)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
  
    // Generate Outlook Calendar link
    let outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&startdt=${encodeURIComponent(event.start)}&enddt=${encodeURIComponent(event.end)}`;
  
    // Generate .ics file for Apple Calendar
    function generateICS() {
      const start = formatDateForUrl(event.start);
      const end = formatDateForUrl(event.end);
  
      const icsContent = `BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//YourOrganization//YourProduct//EN
  BEGIN:VEVENT
  UID:${Date.now()}@yourdomain.com
  DTSTAMP:${start}
  DTSTART:${start}
  DTEND:${end}
  SUMMARY:${event.title}
  DESCRIPTION:${event.description}
  LOCATION:${event.location}
  END:VEVENT
  END:VCALENDAR`;
  
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      return url;
    }
  
    let icsUrl = generateICS();
  </script>
  
  <style>
    .add-to-calendar-button {
      padding: 10px 20px;
      background-color: #007bff; /* Blue color */
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    .calendar-options {
      margin-top: 10px;
    }
  
    .calendar-options ul {
      list-style: none;
      padding: 0;
    }
  
    .calendar-options li {
      margin: 5px 0;
    }
  
    .calendar-options a {
      text-decoration: none;
      color: #007bff;
    }
  </style>
  
  <div>
    <button class="add-to-calendar-button" on:click="{() => showOptions = !showOptions}">
      Add to Calendar
    </button>
  
    {#if showOptions}
      <div class="calendar-options">
        <ul>
          <li><a href="{googleCalendarUrl}" target="_blank">Google Calendar</a></li>
          <li><a href="{outlookCalendarUrl}" target="_blank">Outlook Calendar</a></li>
          <li><a href="{icsUrl}" download="event.ics">Apple Calendar</a></li>
        </ul>
      </div>
    {/if}
  </div>
  
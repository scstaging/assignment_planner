<script>
  import { fade } from 'svelte/transition';

  export let title = 'Event Title';
  export let description = 'Event Description';
  export let dueDate = 'January 7th'; // Date in 'Month Dayth' format

  let showOptions = false;

  // Default start and end times
  const startTime = 'T09:00:00'; // 9:00 AM
  const endTime = 'T10:00:00';   // 10:00 AM

  // Function to convert dueDate from 'Month Dayth' to 'YYYY-MM-DD'
  function parseDueDate(dateStr) {
    if (!dateStr) return '';

    // Regex to extract the month and day, ignoring ordinal suffixes
    const dateParts = dateStr.match(/(\w+)\s+(\d+)(st|nd|rd|th)?/i);
    if (!dateParts) return '';

    const monthName = dateParts[1];
    const day = dateParts[2];

    const monthNames = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12'
    };

    const month = monthNames[monthName];
    if (!month) return '';

    const currentYear = new Date().getFullYear();

    const formattedDay = day.padStart(2, '0');

    return `${currentYear}-${month}-${formattedDay}`;
  }

  // Parse the dueDate into 'YYYY-MM-DD' format
  $: parsedDueDate = parseDueDate(dueDate);

  // Create ISO datetime strings by appending the default times
  $: start = parsedDueDate ? `${parsedDueDate}${startTime}` : '';
  $: end = parsedDueDate ? `${parsedDueDate}${endTime}` : '';

  // Format dates for URLs
  function formatDateForUrl(dateStr) {
    if (!dateStr) return '';
    return dateStr.replace(/-|:|\.\d\d\d/g, '');
  }

  // Reactive statements to update URLs when props change
  $: googleCalendarUrl = start && end
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateForUrl(start)}/${formatDateForUrl(end)}&details=${encodeURIComponent(description)}`
    : '';

  $: outlookCalendarUrl = start && end
    ? `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&startdt=${encodeURIComponent(start)}&enddt=${encodeURIComponent(end)}`
    : '';

  function generateICS() {
    if (!start || !end) return '';

    const startFormatted = formatDateForUrl(start);
    const endFormatted = formatDateForUrl(end);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourOrganization//YourProduct//EN
BEGIN:VEVENT
UID:${Date.now()}@yourdomain.com
DTSTAMP:${startFormatted}
DTSTART:${startFormatted}
DTEND:${endFormatted}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  }

  $: icsUrl = generateICS();
</script>

<style>
  .add-to-calendar-button {
    padding: 20px 30px;
    background-color: #007bff; /* Blue color */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: "Montserrat", sans-serif;
    transition: .4s ease-in-out;
  }
  .add-to-calendar-button:hover {
    transform: scale(1.05);
    transition: .4s ease-in-out;
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
    font-family: "Montserrat", sans-serif;
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
    <div class="calendar-options" transition:fade>
      <ul>
        {#if googleCalendarUrl}
          <li><a href="{googleCalendarUrl}" target="_blank">Google Calendar</a></li>
        {/if}
        {#if outlookCalendarUrl}
          <li><a href="{outlookCalendarUrl}" target="_blank">Outlook Calendar</a></li>
        {/if}
        {#if icsUrl}
          <li><a href="{icsUrl}" download="event.ics">Apple Calendar</a></li>
        {/if}
      </ul>
    </div>
  {/if}
</div>

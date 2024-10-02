<script>
  export let title = 'Event Title';
  export let startDate = '2023-10-31'; // Date in YYYY-MM-DD format
  export let endDate = '2023-10-31';

  let showOptions = false;

  // Default time to append (you can change this as needed)
  const defaultTime = 'T14:00:00'; // 2:00 PM

  // Create ISO datetime strings by appending the default time
  $: start = `${startDate}${defaultTime}`;
  $: end = `${endDate}${defaultTime}`;

  // Format dates for URLs
  function formatDateForUrl(dateStr) {
    return dateStr.replace(/-|:|\.\d\d\d/g, '');
  }

  // Reactive statements to update URLs when props change
  $: googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateForUrl(start)}/${formatDateForUrl(end)}`;

  $: outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${encodeURIComponent(start)}&enddt=${encodeURIComponent(end)}`;

  function generateICS() {
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
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  }

  $: icsUrl = generateICS();
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

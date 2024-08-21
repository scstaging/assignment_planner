<svelte:head>
    <script src="https://accounts.google.com/gsi/client"></script>
    <script src="https://apis.google.com/js/api.js"></script>
</svelte:head>

<script>
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    
    //******** DOCS INTEGRATION ********//
    const CLIENT_ID = '1093500828689-201d9rctp6jb6hilh0mjuaj0ta8d4i5u.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyDHf06lXDDPVFoqdlfhGr3G7CcyHNwsZNw';
    const DISCOVERY_DOC = 'https://docs.googleapis.com/$discovery/rest?version=v1';
    const SCOPES = 'https://www.googleapis.com/auth/documents.readonly';

    let docIDs = {
        "Annotated Bibliography": "1V2J5TQd7VOw57OOTCiJR1ZO1ATeb4jqN4Ss1PZLfVjA",
        "Artist's Statement": "15hNNEm_TcCQzjwV1w5hGWLeDvFGcJvrg86JUKB_oddc",
        "Analytical Essay": "1gGwD5fEqQgll1SuAHNoxNyWa5TXZksinUd0Fhn25jmM",
        "Math PS Assignment": "13h47l1l6w30VYLyRl3h2sHNr8LzFrm5gjJzPsDGjyJc",
        "Discussion Post": "1s5gJaxbJGhxEacaWMJtOTYi5RymBuQIoEWFpDroAPoA",
        "Grammar and Linguistics Assignment": "18K6mJ7hnElymb1mJU1cno3hy7XptxdSh0Gmh23uY3YQ",
        "Reflection or Response Paper": "1vNMvoXP1k9yb4IZDNajriQwmkfNZtf6-A_I4fNLXD6Q",
        "Business Report": "1bajwPw8FGidGIie-7ZO7Yrx-U8HW8vuG-kkygmf8ak0"
    };

    // Testing state variable
    let testing = false;

    let introBlurbContent = "test" + "<br>" + "test";
    let introBlurb;
    let unmountStorageIntroBlurb = "";
    let goals = [];

    function setIntroBlurb()
    {
        introBlurb.innerHTML = introBlurbContent;
    }

    let atype;
    let startDate;
    let endDate;
    let formattedEndDate;

    async function fetchGoogleDoc() {
        atype = $page.url.searchParams.get('atype');
        const response = await fetch(`/api/get-google-doc?docID=${docIDs[atype]}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }

    // Component mounted
    let mounted = false;

    async function parseGoogleDocContent() {
    // Fetch Google Doc data
    const data = await fetchGoogleDoc();
    const content = data.body.content;
    let text = '';

    // Extract text from the content
    content.forEach(element => {
      if (element.paragraph) {
        element.paragraph.elements.forEach(el => {
          if (el.textRun) {
            text += el.textRun.content;
          }
        });
      }
    });

    // Split text into lines
    const lines = text.split('\n');
    let currentGoal = null;

    // ID index
    let IDindex = -1;

    // Parse lines
    lines.forEach(line => {
      if (line.startsWith('&')) {
        introBlurbContent = line.slice(1).trim();
        introBlurbContent = introBlurbContent.replace(/\+/g, '<br>');
        introBlurbContent = introBlurbContent.replace(/{([^}]+)}/g, '<a href="$1">$1</a>');
        introBlurbContent = introBlurbContent.replace(/\[([^\]]+)\]/g, '<p style="padding: 20px;box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">$1</p>');
      } else if (line.startsWith('#')) {
        if (currentGoal) {
          goals.push(currentGoal);
          IDindex++;
        }
        const match = line.match(/#\s*(.*?)\s*\((\d+)%\)\s*(.*)/);
        if (match) {
          currentGoal = {
            id: IDindex,
            title: match[1],
            percent: parseInt(match[2], 10),
            goalDescript: match[3],
            links: [],
            completed: false,
            dueDate: "XXXXXX"
          };
        }
      } else if (line.startsWith('-') && currentGoal) {
        const linkMatch = line.match(/-\s*\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          currentGoal.links.push({
            title: linkMatch[1],
            descript: linkMatch[2]
          });
        }
      } else if (currentGoal) {
        currentGoal.goalDescript += ' ' + line.trim();
      }
    });

    if (currentGoal) {
      goals.push(currentGoal);
    }
    goals = goals;
    mounted = true;
  }

  function testFunction()
  {
    setTimeout(() => {
        setIntroBlurb();
        introBlurb = introBlurb;
    }, 500)
  }

    function calculateDaysBetweenDates(date1, date2) {
        const dateObj1 = new Date(date1);
        const dateObj2 = new Date(date2);

        // Calculate the time difference in milliseconds
        const timeDifference = Math.abs(dateObj2 - dateObj1);

        // Convert the time difference from milliseconds to days
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return daysDifference;
    }

    function addDaysToDate(dateString, numOfDays) {
    // Parse the input date string
    let [year, month, day] = dateString.split('-').map(Number);

    // Create a Date object
    let date = new Date(year, month - 1, day); // month is zero-based in JavaScript Date

    // Add the number of days
    date.setDate(date.getDate() + numOfDays);

    // Get the new year, month, and day
    let newYear = date.getFullYear();
    let newMonth = date.getMonth() + 1; // month is zero-based
    let newDay = date.getDate();

    // Format the new date as YEAR-MONTH-DAY
    let newDateString = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;

    return newDateString;
}

    function allocateDays(goals, startDate) { 
        let temp = startDate;
        for (let goal of goals) {
            let days = Math.floor((goal.percent / 100) * totalDays);
            goal.dueDate = addDaysToDate(temp, days);
            temp = goal.dueDate;
            goal.dueDate = convertDate(goal.dueDate);
        }
    }

    let totalPercent = 0;
    let currentlyChecked = new Set();
    function toggleGoal(goal) {
        if (currentlyChecked.has(goal)) {
            totalPercent -= goal.percent;
            currentlyChecked.delete(goal);
        } else {
            totalPercent += goal.percent;
            currentlyChecked.add(goal);
        }
    }

    function isChecked(goal) {
        return currentlyChecked.has(goal);
    }

    let totalDays;

    function convertDate(dateString) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const suffixes = ["th", "st", "nd", "rd"];
        
        function getDayWithSuffix(day) {
            if (day > 3 && day < 21) return day + suffixes[0];
            switch (day % 10) {
                case 1:  return day + suffixes[1];
                case 2:  return day + suffixes[2];
                case 3:  return day + suffixes[3];
                default: return day + suffixes[0];
            }
        }

        const [year, month, day] = dateString.split('-');
        const monthName = months[parseInt(month, 10) - 1];
        const dayWithSuffix = getDayWithSuffix(parseInt(day, 10));

        return `${monthName} ${dayWithSuffix}`;
    }

  $: {
    startDate = $page.url.searchParams.get('startDate');
    endDate = $page.url.searchParams.get('endDate');
    formattedEndDate = convertDate(endDate);
    totalDays = calculateDaysBetweenDates(startDate, endDate);
    allocateDays(goals, startDate);
    mounted === true ? testFunction() : null;
  }

  let selectedGoal = null;

  let goals2 = [
    {id: 1, title: "Get started", percent: 15, dueDate: "XXXXXX", completed: false, goalDescript: "Exploring your topic can involve brainstorming to understand the scope of your topic, gathering background information, and thinking about how to develop your ideas.", links: [
        {title: "Understanding the assignment", descript: "https://www.concordia.ca/content/dam/concordia/offices/cdev/docs/AssigCalc/start_research_paper.pdf"},
        {title: "Understanding Key Words in Writing Assignments", descript: "https://www.concordia.ca/content/dam/concordia/offices/cdev/docs/AssigCalc/key_words_assignments.pdf"},
        {title: "Getting Started", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/getting-started.html"},
        {title: "Exploring your topic", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/exploring-your-topic.html"},
        {title: "Group assignments", descript: "https://www.concordia.ca/content/dam/concordia/offices/ssc/learning/documents/Writing/Group-Work-Handout-2024.pdf"}
    ]},
    {id: 2, title: "Collect the information", percent: 18, dueDate: "XXXXXX", completed: false, goalDescript: "Start your research! If you are required to do extra research and reading, the time is now. Research your topic systematically. Use the links below to help you locate and evaluate source material to develop and support your ideas. Not all information is created equal!!! Evaluating the quality of information is an important part of critical thinking.", links: [
        {title: "Researching your Topic", descript: "https://www.concordia.ca/students/success/learning-support/resources/reading/active-reading.html"},
        {title: "Concordia’s library offers a toolkit for navigating information", descript: "https://library.concordia.ca/apps/critical-toolkit/course.html?courseID=27386"},
        {title: "Search Basics", descript: "https://library.concordia.ca/learn/search-basics/"},
        {title: "Finding Articles on a Topic", descript: "https://library.concordia.ca/learn/finding-articles/on-a-topic/"},
        {title: "Finding Books", descript: "https://library.concordia.ca/learn/finding-books/"},
        {title: "Finding Other Sources", descript: "https://library.concordia.ca/learn/finding-other-sources/"},
        {title: "Get help from the library team", descript: "https://library.concordia.ca/help/questions/"},
        {title: "Get live online help from a library team member via chat", descript: "https://library.concordia.ca/"},
        {title: "Email the library reference team", descript: "https://library.concordia.ca/help/questions/email.php"}
    ]},
    {id: 3, title: "Organize the information", percent: 14, dueDate: "XXXXXX", completed: false, goalDescript: "Carving out a good plan is a major part of the writing process. Once you have a good plan in place, the first draft becomes easy. An analytical essay is “thesis-based”; as such, the first step in planning is to decide on a working-thesis statement. You can make changes to it later, but for now you need a main idea, a point of view, and supporting ideas.", links: [
        {title: "Finding a Plan", descript: "https://www.concordia.ca/content/dam/concordia/offices/cdev/docs/writing/writing-essays-research-papers/find_plan.pdf"},
        {title: "Thesis Statements", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/thesis-statements.html"}
    ]},
    {id: 4, title: "Write the first draft", percent: 24, dueDate: "XXXXXX", completed: false, goalDescript: "It’s time to WRITE! If you have collected good information and decided on a solid thesis statement, this is the easy part. Keep your classmates in mind when you write and explain anything that may not be clear to them. Ensure your arguments are logical with well-structured paragraphs. To persuade your readers, always support your response with evidence from course readings or external sources when permitted or required. Make sure your tone remains academic and that you use the vocabulary associated with your field of study. When you use others’ arguments, always paraphrase the information you have taken from your sources, and make sure to cite the sources appropriately.", links: [
        {title: "Academic Audience", descript: "https://www.youtube.com/watch?v=laQJy9rEulk"},
        {title: "Writing a First Draft", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/first-draft-research.html"},
        {title: "Writing a First Draft - Transitions", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/transitions.html"},
        {title: "Overcoming Writer’s Block", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/writing-overcoming-writers-block.html"},
        {title: "Writing Effective Paragraphs", descript: "https://www.concordia.ca/content/dam/concordia/offices/ssc/learning/documents/Writing/writing-effective-paragraphs.pdf"},
        {title: "How to Paraphrase", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/how-to-paraphrase.html"}
    ]},
    {id: 5, title: "Revise", percent: 8, dueDate: "XXXXXX", completed: false, goalDescript: "Give yourself some time away from your writing and try to come back to it as if you are the audience. If you want another reader to have a look at your piece, make an appointment with a Writing Assistant.", links: [
        {title: "Make an appointment with a Writing Assistant", descript: "Make an appointment with a Writing Assistant"}
    ]},
    {id: 6, title: "Cite", percent: 10, dueDate: "XXXXXX", completed: false, goalDescript: "Citations are critical to an analytical essay. Be sure to follow your professor’s preferred citation style.", links: [
        {title: "How to Cite", descript: "https://library.concordia.ca/learn/citing/"}
    ]},
    {id: 7, title: "Hand it in", percent: 6, dueDate: "XXXXXX", completed: false, goalDescript: "Aim to have your paper ready before the due date. This strategy helps if there are technical issues with sending your work to your professor or if any other situation arises that may get in the way of finishing your assignment.", links: [
        {title: "IITS can help with Moodle problems", descript: "https://www.concordia.ca/it/support.html"},
        {title: "How to Email your professor", descript: "How to Email your professor"}
    ]}
];

    function selectGoal(goal) 
    {
        selectedGoal = selectedGoal?.id === goal.id ? null : goal;
    }

    function nullSelectedGoal(goal)
    {
        selectedGoal = selectedGoal?.id === goal.id ? null : goal;
        setTimeout(() => {
            introBlurb.innerHTML = introBlurbContent;
        }, 300)
    }

    function backButton()
    {
        goto(`/`);
    }

    // Testing
    if (testing)
        goals = goals2;

</script>

{#await parseGoogleDocContent()}
    <h2 style="padding: 20px;" class="gp-p-text">Awaiting plan...</h2>
{:then g}
<div on:click={backButton} transition:fade class="back-button">
    <h2>Back</h2>
</div>
<div transition:fade class="gp-container">
    <div class="gp-inner-container">
        <div style="display: flex;flex-direction:row;align-items:flex-end;justify-content:space-between;">
            <div>
                <h2 class="gp-title-text">{atype}</h2>
                {#each goals as goal}
                    {#if selectedGoal?.id === goal.id}
                        <h2 out:fade in:fly={{x: -100, delay: 500}} class="subtitle-text">{goal.title}</h2>
                    {/if}
                {/each}
            </div>
            <div style="display: flex;flex-direction:row;">
                {#if selectedGoal === null}
                    <p class="gp-p-text">Due Date: &nbsp;</p>
                    <p style="color: rgba(255,85,0,1);" class="gp-p-text">{formattedEndDate}</p>
                {:else}
                    {#each goals as goal}
                        {#if selectedGoal?.id === goal.id}
                            <p class="gp-p-text">By&nbsp;</p>
                            <p style="color: rgba(255,85,0,1);" class="gp-p-text">{goal.dueDate}</p>
                            <p class="gp-p-text">&nbsp;you should...</p>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
        {#if selectedGoal === null}
        <p bind:this={introBlurb} class="gp-descript" in:fade={{delay: 500}} out:fade>{unmountStorageIntroBlurb}</p>
        {/if}
            {#each goals as goal}
                {#if selectedGoal?.id === goal.id}
                    <p class="gp-descript" out:fade in:fade={{
                        delay: 1000
                    }}>{goal.goalDescript}</p>
                {/if}
            {/each}
        <div class="goal-list-container" transition:fade>
            <h2 class="gp-goals-title" transition:fade>{selectedGoal === null ? "Plan" : "Helpful Links"}</h2>
            {#if selectedGoal === null}
            <div class="goal-list" transition:fade>
                {#each goals as goal}
                    <div style="box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;margin-bottom:15px;" class="gp-goal" on:click={() => selectGoal(goal)}>
                        <input id={goal.id} type="checkbox" class="checkbox"
                        on:click={(e) => e.stopPropagation()}
                        on:change={(e) => {
                            e.stopPropagation(); // Prevent change event from bubbling up
                            toggleGoal(goal)
                        }}
                        checked={isChecked(goal)}
                        />
                        <div style="display: flex;flex-direction:column;">
                            <h2>By {goal.dueDate} you should: {goal.title}</h2>
                        </div>
                    </div>
                {/each}
            </div>
            {/if}
            {#each goals as goal}
                {#if selectedGoal?.id === goal.id}
                    {#each goal.links as link}
                        <div style="margin-bottom: 20px;margin-top:40px;">
                            <a style="text-decoration: none;" target="_blank" class="link-descript" href={link.descript}><h2 class="link-title">{link.title}</h2></a>
                        </div>
                    {/each}
                    <h2 class="back-button" on:click={() => {nullSelectedGoal(goal)}}>Back</h2>
                {/if}
            {/each}
        </div>
        <div style="width: 100%;display: flex;flex-direction:row;align-items:center;justify-content:space-between;margin-top:40px;">
            {#each goals as goal}
                {#if selectedGoal?.id === goal.id}
                    <div class="fp-start-button"><h2 class="fp-start-date-text">Add to Calendar</h2></div>
                {/if}
            {/each}
            <div style="width: 40%;">
                {#if selectedGoal === null}
                    <h2 class="gp-p-text">Total Progress - {totalPercent}%</h2>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: {totalPercent}%;"></div>
                    </div>
                {/if}
            </div>
            <img class="fp-student-success-logo" alt="fp-student-success-logo" src="/student_success_logo.webp">
        </div>
    </div>
</div>
{/await}

<style>
    * {
        margin: 0;
    }
    .gp-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 0;
    }
    .gp-inner-container {
        width: 70%;
        display: flex;
        flex-direction: column;
        padding: 60px;
    }
    .gp-title-text {
        font-family: "Montserrat", sans-serif;
        font-size: 2.4em;
        font-weight: 700;
    }
    .gp-p-text {
        font-family: "Montserrat", sans-serif;
        font-size: 1.1em;
        font-weight: 500;
    }
    .gp-goals-title {
        font-family: "Montserrat", sans-serif;
        font-size: 1.6em;
        font-weight: 600;
    }
    .goal-list-container {
        padding-top: 40px;
    }
    .goal-list {
        display: flex;
        flex-direction: column;
        padding-top: 20px;
    }
    .gp-descript {
        font-family: "Montserrat", sans-serif;
        font-size: 1.2em;
        font-weight: 400;
        margin-top: 3%;
        line-height: 30px;
    }
    .gp-goal {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        transition: .4s ease-in-out;
        font-family: "Montserrat", sans-serif;
        font-size: 1.2em;
        padding: 20px 0px 20px 0px;
        cursor: pointer;
    }
    .gp-goal p {
        color: rgb(0, 0, 0, 0.36);
        font-size: .8em;
        font-weight: 500;
    }
    .gp-goal:hover {
        background-color: rgb(145, 35, 56, 0.36);
        transition: .4s ease-in-out;
        transform: scale(1.01);
    }
    .checkbox {
        appearance: none;
        width: 30px;
        height: 30px;
        background-color: rgb(0, 0, 0, 0.10);
        margin-right: 30px;
        transition-duration: .4s;
        cursor: pointer;
    }
    .checkbox:checked {
        border: none;
        background-color: rgb(145, 35, 56, 0.36);
        transition-duration: .4s;
        cursor: pointer;
    }
    .link-title {
        font-family: "Montserrat", sans-serif;
        font-size: 1.5em;
        font-weight: 400;
        margin-bottom: 10px;
        color: rgba(33,126,221,1);
        transition: .2s ease-in-out;
    }
    .link-title:hover {
        transition: .2s ease-in-out;
        transform: scale(1.02);
    }
    .link-descript {
        font-family: "Montserrat", sans-serif;
        font-size: 1.2em;
        font-weight: 300;
        margin-bottom: 20px;
    }
    .subtitle-text {
        font-family: "Montserrat", sans-serif;
        font-size: 1.8em;
        font-weight: 700;
        color: rgb(145, 35, 56, 1);
    }
    .back-button {
        margin-top: 5%;
        font-family: "Montserrat", sans-serif;
        font-size: 1.8em;
        font-weight: 700;
        color: rgb(0, 0, 0, 0.36);
        cursor: pointer;
        transition: .4s ease-in-out;
        width: fit-content;
    }
    .back-button:hover {
        font-family: "Montserrat", sans-serif;
        font-size: 1.8em;
        font-weight: 700;
        color: rgb(145, 35, 56, 1);
        transition: .4s ease-in-out;
    }
    .fp-student-success-logo {
        width: 40%;
        height: max-content;
    }
    .fp-start-button {
        width: 15%;
        border-radius: 15px;
        padding: 15px 15px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease, color 0.3s ease;
        background: linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%);
    }
    .fp-start-button:hover {
        transition: all 0.3s ease, color 0.3s ease;
        transform: scale(1.1);
    }
    .fp-start-date-text {
        font-size: 1em;
        color: white;
        font-weight: 300;
        font-family: "Montserrat", sans-serif;
    }
    .progress-container {
        width: 100%;
        background-color: #f3f3f3;
        border-radius: 25px;
        overflow: hidden;
        margin-bottom: 1em;
    }
    .progress-bar {
        height: 30px;
        background-color: rgba(33,126,221,1);
        width: 0;
        transition: width 0.3s ease;
    }
    .back-button {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgb(145, 35, 56, 0.3);
    transition: .4s ease-in-out;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.back-button:hover {
    transition: .4s ease-in-out;
    background-color: rgb(145, 35, 56, 1);
    transform: scale(1.2);
}
.back-button h2 {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
}
</style>
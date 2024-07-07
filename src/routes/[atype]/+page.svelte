<script>
    import { page } from '$app/stores';
    import { compile } from 'svelte/compiler';
    import { fade, fly } from 'svelte/transition';
    import { expoOut } from 'svelte/easing';

    let atype;
    let startDate;
    let endDate;

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

  $: {
    atype = $page.url.searchParams.get('atype');
    startDate = $page.url.searchParams.get('startDate');
    endDate = $page.url.searchParams.get('endDate');
    totalDays = calculateDaysBetweenDates(startDate, endDate);
    allocateDays(goals, startDate);
  }

  let selectedGoal = null;

  let goals = [
    {id: 1, title: "Get Started", percent: 15, dueDate: "XXXXXX", goalDescript: "The earlier you begin any assignment, the more likely you are to enjoy the process, learn about the topic, develop your writing skills and get a better grade!", completed: false, links: [{title: "Understanding your assignment", descript: "https://www.concordia.ca/content/dam/concordia/offices/cdev/docs/AssigCalc/start_research_paper.pdf"}, {title: "Understanding key words in writing assignments", descript: "https://www.concordia.ca/content/dam/concordia/offices/cdev/docs/AssigCalc/key_words_assignments.pdf"}]},
    {id: 2, title: "Collect the information", percent: 33, goalDescript: "For discussion posts, the professor usually has an article(s) for you to read and react; now is the time to read or reread the article(s) required for the assignment to make certain you fully understand the authors’ points. When you do so, keep your possible response in mind and be on the lookout for good quotes or important ideas.", dueDate: "XXXXXX", completed: false, links: [{title: "Active Reading", descript: "https://www.concordia.ca/students/success/learning-support/resources/reading/active-reading.html"}]},
    {id: 3, title: "Writing your first draft", percent: 25, goalDescript: "Make sure to review the discussion post instructions again. Especially in a discussion post, your reading audience is your well-informed peers. In fact, you may need to read and respond toothers’ posts. Keep your classmates in mind when you write and explain anything that may not be clear to them. Ensure your arguments are logical, with well-structured paragraphs. To persuade your readers, always support your response with evidence from course readings or external sources when permitted or required. Make sure your tone remains academic; just because it is a discussion post, does not mean it is informal. When you use others’ arguments, always paraphrase the information you have taken from your sources. Consult the instructions or ask your professor if you need to add formal citations to your post.", dueDate: "XXXXXX", completed: false, links: [{title: "First Draft", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/first-draft-research.html"}, {title: "Transitions", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/transitions.html"}, {title: "Writing Effective Paragraphs", descript: "https://www.concordia.ca/content/dam/concordia/offices/ssc/learning/documents/Writing/writing-effective-paragraphs.pdf"}, {title: "How To Paraphrase", descript: "https://www.concordia.ca/students/success/learning-support/resources/writing/how-to-paraphrase.html"}]},
    {id: 4, title: "Revise", dueDate: "XXXXXX", percent: 18, goalDescript: "Give yourself some time away from your writing and try to come back to it as if you are the audience. If you want another reader to have a look at your piece, make an appointment with a Writing Assistant.", completed: false, links: [{title: "Writing Assistance", descript: "https://www.concordia.ca/students/success/learning-support/writing-assistance.html"}]},
    {id: 5, title: "Submit", dueDate: "XXXXXX", percent: 9, goalDescript: "Try not to leave the submission to the last minute as technical errors can happen when posting.", completed: false, links: []}
  ];

    function selectGoal(goal) 
    {
        selectedGoal = selectedGoal?.id === goal.id ? null : goal;
    }

    function nullSelectedGoal(goal)
    {
        selectedGoal = selectedGoal?.id === goal.id ? null : goal;
    }

</script>

<div class="gp-container">
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
                    <p style="color: rgba(255,85,0,1);" class="gp-p-text">{endDate}</p>
                {:else}
                    {#each goals as goal}
                        {#if selectedGoal?.id === goal.id}
                            <p class="gp-p-text">Subgoal Due Date: &nbsp;</p>
                            <p style="color: rgba(255,85,0,1);" class="gp-p-text">{goal.dueDate}</p>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
        {#if selectedGoal === null}
        <p class="gp-descript" in:fade={{delay: 500}} out:fade>Discussion posts allow your professor to assess whether you are engaging with the course
            material in a critical and in-depth manner. Additionally, they offer a fun opportunity to connect
            with your classmates and explore their ideas.
            <br><br>Sometimes, writing can be a daunting task, but Writing Assistants are here to help you at any
            point in the process; book an appointment today if you need help during any one of the
            following steps.</p>
        {/if}
        {#each goals as goal}
            {#if selectedGoal?.id === goal.id}
                <p class="gp-descript" out:fade in:fade={{
                    delay: 1000
                }}>{goal.goalDescript}</p>
            {/if}
        {/each}
        <div class="goal-list-container" transition:fade>
            <h2 class="gp-goals-title" transition:fade>{selectedGoal === null ? "Goals" : "Helpful Links"}</h2>
            {#if selectedGoal === null}
            <div class="goal-list" transition:fade>
                {#each goals as goal}
                    <div class="gp-goal" on:click={() => selectGoal(goal)}>
                        <input id={goal.id} type="checkbox" class="checkbox"
                        on:click={(e) => e.stopPropagation()}
                        on:change={(e) => {
                            e.stopPropagation(); // Prevent change event from bubbling up
                            toggleGoal(goal)
                        }}
                        checked={isChecked(goal)}
                        />
                        <div style="display: flex;flex-direction:column;">
                            <h2>{goal.title}</h2>
                            <p>Due date: {goal.dueDate}</p>
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
                    <h2 class="back-button" on:click={() => {nullSelectedGoal(goal)}}>&lt; Back</h2>
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
</style>
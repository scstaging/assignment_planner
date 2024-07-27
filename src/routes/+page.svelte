<script>
    // Imports
    import { fade } from 'svelte/transition';
    import SveltyPicker, { config } from 'svelty-picker';
    import { goto } from '$app/navigation';

    // Assignment dropdown bool
    let visible = false;

    let assignments = [
        {title: "Analytical Essay", icon: "/analytical_essay.png", docID: "1gGwD5fEqQgll1SuAHNoxNyWa5TXZksinUd0Fhn25jmM"},
        {title: "Annotated Bibliography", icon: "/annotated-bibliography.png", docID: "1V2J5TQd7VOw57OOTCiJR1ZO1ATeb4jqN4Ss1PZLfVjA"},
        {title: "Artists Statement", icon: "/artists_statement.png", docID: "15hNNEm_TcCQzjwV1w5hGWLeDvFGcJvrg86JUKB_oddc"},
        {title: "Business Report", icon: "/business_report.png", docID: "1gGwD5fEqQgll1SuAHNoxNyWa5TXZksinUd0Fhn25jmM"},
        {title: "Discussion Post", icon: "/discussion_post.png", docID: "1s5gJaxbJGhxEacaWMJtOTYi5RymBuQIoEWFpDroAPoA"},
        {title: "Grammer and Linguistics Assignment", icon: "/poster_pres.png", docID: "18K6mJ7hnElymb1mJU1cno3hy7XptxdSh0Gmh23uY3YQ"},
        {title: "Math PS Assignment", icon: "/math_assignment.png", docID: "13h47l1l6w30VYLyRl3h2sHNr8LzFrm5gjJzPsDGjyJc"},
        {title: "Reflection or Response Paper", icon: "/reflection_response_paper.png", docID: "1vNMvoXP1k9yb4IZDNajriQwmkfNZtf6-A_I4fNLXD6"},
    ];

    // Assignment Choice
    let assignmentChoice = null;
    
    // Datepicker dropdown bool
    let startDatePickerVisible = false;

    // Date picker selected date
    let selectedStartDate;

    let plannerinfo = {
        startDate: null,
        endDate: null,
        atype: null
    }

    let delim;
    let simpleStartDate, simpleEndDate;

    // Update assignment state on change
    $: delim = String(selectedStartDate).split(",");
    $: plannerinfo.startDate = delim[0];
    $: plannerinfo.endDate = delim[1];
    $: simpleStartDate = convertDate(plannerinfo.startDate);
    $: if (plannerinfo.endDate) simpleEndDate = convertDate(plannerinfo.endDate);

    let startButtonColor = "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)";

    function openAssignments()
    {
        if (!startDatePickerVisible)
        {
            leftHidden = !leftHidden;
            setTimeout(() => {
                visible = !visible;
            }, 500)
        }
        else if (startDatePickerVisible)
        {
            startButtonColor = startButtonColor === "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)" ? "#912338" : "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)";
            startDatePickerVisible = !startDatePickerVisible;
            leftHidden = !leftHidden;
            setTimeout(() => {
                visible = !visible;
            }, 500)
        }
    }

    function selectAssignmentType(event)
    {
        const elementId = event.currentTarget.id;
        assignmentChoice = elementId;
        plannerinfo.atype = elementId;
        setTimeout(() => {
            leftHidden = !leftHidden;
        }, 500)
        visible = !visible;
    }

    function openStartDatePicker()
    {
        if (!visible)
        {
            leftHidden = !leftHidden;
            setTimeout(() => {
                startDatePickerVisible = !startDatePickerVisible
            }, 500);
        }
        else if (visible)
        {
            visible = !visible;
            setTimeout(() => {
                startDatePickerVisible = !startDatePickerVisible;
            }, 500)
        }
    }
    
    function closeStartDatePicker()
    {
        startDatePickerVisible = !startDatePickerVisible
        setTimeout(() => {
            leftHidden = !leftHidden;
        }, 500);
    }

    function generateAssignment()
    {
        let atype = assignmentChoice;
        let startDate = plannerinfo.startDate;
        let endDate = plannerinfo.endDate;
        const params = new URLSearchParams({
            atype,
            startDate,
            endDate
        }).toString();
        goto(`/${atype}?${params}`);
    }

    let leftHidden = false;

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

</script>

<div class="fp-container">
    {#if !leftHidden}
    <div transition:fade class="fp-left">
        <div style="display: flex;flex-direction:row;">
            <img class="fp-logo" alt="fp-logo" src="/concordia-logo.webp">
        </div>
        <!-- DIVIDER -->
        <div class="divider" style="margin-bottom: 10%;"></div>
        <!-- END DIVIDER -->
        <h2 class="fp-title">Generate a new assignment plan</h2>
        <p class="fp-descript">Select start date, end date and your type of assignment!</p>
        <!-- DIVIDER -->
        <div class="divider"></div>
        <!-- END DIVIDER -->
         {#if assignmentChoice == null}
            <div class="fp-assignment-picker" 
            on:click={openAssignments}>
                <h2 class="fp-assignment-picker-text">Assignment Type</h2>
                <h2>+</h2>
            </div>
        {/if}
        {#if assignmentChoice != null}
        <div class="fp-assignment-picker-picked" 
        on:click={openAssignments}>
            <h2 class="fp-assignment-picker-text">{assignmentChoice}</h2>
            <h2>+</h2>
        </div>
        {/if}
        <!-- DIVIDER -->
        <div class="divider"></div>
        <!-- END DIVIDER -->
        <div class="fp-buttons-container">
            <div style="background: {startButtonColor};" class="fp-start-button"
            on:click={openStartDatePicker}>
                {#if !selectedStartDate}
                    <h2 class="fp-start-date-text">Select Date</h2>
                {/if}
                {#if selectedStartDate}
                    <h2 class="fp-start-date-text">{simpleStartDate + " - " + simpleEndDate}</h2>
                {/if}
            </div>
        </div>
        <!-- DIVIDER -->
        <div class="divider" style="margin-bottom: 10%;"></div>
        <!-- END DIVIDER -->
        <div style="width: 100%;display: flex;flex-direction:row;align-items:center;justify-content:space-between;">
            <img class="fp-student-success-logo" alt="fp-student-success-logo" src="/student_success_logo.webp">
            {#if selectedStartDate && assignmentChoice}
                <div on:click={generateAssignment} transition:fade class="fp-generate-button">
                    <h2 class="fp-generate-button-text ">Generate</h2>
                </div>
            {/if}
        </div>
    </div>
    {/if}
    <div class="fp-right">
        {#if visible}
            <div class="grid-container" transition:fade>
                {#each assignments as assignment}
                    <div class="grid-assign">
                        <h2>{assignment.title}</h2>
                        <img on:click={selectAssignmentType} id={assignment.title} class="grid-item" alt={assignment.title} src={assignment.icon}>
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Initial Date Picker -->
        {#if startDatePickerVisible}
            <div style="display: flex;flex-direction: column;align-items:center;" transition:fade>
                {#if simpleEndDate != undefined}
                    <h2 transition:fade style="color: black;font-size:2.2em;" class="fp-start-date-text">{simpleStartDate + " - " + simpleEndDate}</h2>
                {/if}
                <SveltyPicker pickerOnly isRange startDate={new Date()} bind:value={selectedStartDate} />
                <div style="background: {startButtonColor};" class="fp-start-button"
                    on:click={closeStartDatePicker}>
                    <h2 class="fp-start-date-text">Press to confirm</h2>
                </div>
            </div>
        {/if}

    </div>
</div>

<style>
* {
    margin: none;
    padding: none;
}
:global(body) {
    margin: 0;
}
.fp-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.fp-left {
    width: 45%;
    margin-left: 5%;
}
.fp-left h2, .fp-left p {
    font-family: "Montserrat", sans-serif;
}
.fp-title {
    font-size: 2em;
    font-weight: 700;
}
.fp-descript {
    font-size: 1em;
}
.fp-right {
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
}
.fp-logo {
    width: 50%;
}
.fp-assignment-picker {
    width: 75%;
    background-color: white;
    color: black;
    opacity: 0.36;
    border: 2px solid grey;
    border-radius: 15px;
    padding-left: 10px;
    padding-right: 20px;
    cursor: pointer;
    transition: all 0.3s ease, color 0.3s ease;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.fp-assignment-picker:hover {
    border: 2px solid #5a5a5a;
    transition-duration: .4s;
    transform: scale(1.05);
}
.fp-assignment-picker-picked {
    width: 75%;
    background-color: #912338;
    color: white;
    border: 2px solid #912338;
    border-radius: 15px;
    padding-left: 10px;
    padding-right: 20px;
    cursor: pointer;
    transition: all 0.3s ease, color 0.3s ease;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.fp-assignment-picker-picked:hover {
    transition: all 0.3s ease, color 0.3s ease;
    transform: scale(1.05);
}
.fp-assignment-picker-text {
    padding-left: 10px;
    font-weight: 300;
    font-size: 1em;
}
.fp-buttons-container {
    display: flex;
    flex-direction: row;
}
.fp-start-button, .fp-end-button {
    width: 30%;
    margin-right: 20px;
    margin-top: 20px;
    border-radius: 15px;
    padding: 5px 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease, color 0.3s ease;
}
.fp-start-button:hover, .fp-end-button:hover {
    transition: all 0.3s ease, color 0.3s ease;
    transform: scale(1.1);
}
.fp-start-date-text, .fp-end-date-text {
    font-size: 1em;
    color: white;
    font-weight: 300;
    font-family: "Montserrat", sans-serif;
}
.fp-generate-button {
    width: 30%;
    background: linear-gradient(90deg, rgba(255,85,0,1) 0%, rgba(148,37,54,1) 100%);
    border-radius: 15px;
    padding: 5px 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease, color 0.3s ease;
}
.fp-generate-button:hover {
    transform: scale(1.05);
    transition: all 0.3s ease, color 0.3s ease;
}
.fp-generate-button-text {
    font-size: 1em;
    color: white;
    font-weight: 300;
    font-family: "Montserrat", sans-serif;
}
.fp-student-success-logo {
    width: 60%;
    height: max-content;
}
.divider {
    height: 20px;
}
.grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, auto);
    gap: 30px;
    width: 100%;
}
.grid-item {
    padding: 30px;
    width: auto;
    height: 25vh;
    cursor: pointer;
    transition: ease-in-out;
    transition-duration: .4s;
}
.grid-item:hover {
    background-color: #912338;
    transform: translateY(-3%);
    transition: ease-in-out;
    transition-duration: .4s;
}
.icon {
    width: 3%;
}
.grid-assign {
    display: flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    font-family: "Montserrat", sans-serif;
    font-size: 10px;
}
.grid-assign > h2 {
    font-weight: 500;
}
</style>
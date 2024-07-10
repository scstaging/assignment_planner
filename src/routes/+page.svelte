<script>
    // Imports
    import { fade } from 'svelte/transition';
    import SveltyPicker, { config } from 'svelty-picker';
    import { goto } from '$app/navigation';

    // Assignment dropdown bool
    let visible = false;

    // Assignment Choice
    let assignmentChoice = null;
    
    // Datepicker dropdown bool
    let startDatePickerVisible = false;

    // Date picker selected date
    let selectedStartDate, selectedEndDate;

    let plannerinfo = {
        startDate: null,
        endDate: null,
        atype: null
    }

    let delim;

    // Update assignment state on change
    $: delim = String(selectedStartDate).split(",");
    $: plannerinfo.startDate = delim[0];
    $: plannerinfo.endDate = delim[1];

    let startButtonColor = "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)";

    function openAssignments()
    {
        if (!startDatePickerVisible)
            visible = !visible;
        else if (startDatePickerVisible)
        {
            startButtonColor = startButtonColor === "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)" ? "#912338" : "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)";
            startDatePickerVisible = !startDatePickerVisible;
            setTimeout(() => {
                visible = !visible;
            }, 500)
        }
    }

    function selectAssignmentType(event)
    {
        const elementId = event.currentTarget.id;
        switch (elementId) {
            case "res-rep":
                assignmentChoice = "Discussion Post";
                plannerinfo.atype = "researchreport";
                break;
            case "res-pres":
                assignmentChoice = "AP Analytical Essay";
                plannerinfo.atype = "researchpresentation";
                break;
            case "ann-bib":
                assignmentChoice = "Annotated Bibliography";
                plannerinfo.atype = "annotatedbibliography";
                break;
            case "pos-pres":
                assignmentChoice = "Poster Presentation";
                plannerinfo.atype = "posterpresentation";
                break;
            default:
                break;
        }
    }

    function openStartDatePicker()
    {
        if (!visible)
        {
            startButtonColor = startButtonColor === "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)" ? "#912338" : "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)";
            startDatePickerVisible = !startDatePickerVisible;
        }
        else if (visible)
        {
            visible = !visible;
            startButtonColor = startButtonColor === "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)" ? "#912338" : "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)";
            setTimeout(() => {
                startDatePickerVisible = !startDatePickerVisible;
            }, 500)
        }
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

</script>

<div class="fp-container">
    <div class="fp-left">
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
                    <h2 class="fp-start-date-text">{plannerinfo.startDate + " - " + plannerinfo.endDate}</h2>
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
    <div class="fp-right">
        {#if visible}
        <div class="grid-container" transition:fade>
            <div class="grid-assign">
                <h2>Discussion Post</h2>
                <img on:click={selectAssignmentType} id="res-rep" class="grid-item" alt="research-report" src="/research-report-06.webp">
            </div>
            <div class="grid-assign">
                <h2>AP Analytical Essay</h2>
                <img on:click={selectAssignmentType} id="res-pres" class="grid-item" alt="research-pres" src="/research-presentation-06.webp">
            </div>
            <div class="grid-assign">
                <h2>Annotated Bibliography</h2>
                <img on:click={selectAssignmentType} id="ann-bib" class="grid-item" alt="research-report" src="/annotated-bib-06.webp">
            </div>
            <div class="grid-assign">
                <h2>Poster Presentation</h2>
                <img on:click={selectAssignmentType} id="pos-pres" class="grid-item" alt="research-report" src="/poster-pres-06.webp">
            </div>
        </div>
        {/if}

        <!-- Initial Date Picker -->
        {#if startDatePickerVisible}
            <div transition:fade>
                <SveltyPicker pickerOnly isRange startDate={new Date()} bind:value={selectedStartDate} />
            </div>
        {/if}

    </div>
</div>

<style>
* {
    margin: none;
    padding: none;
}
.fp-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.fp-left {
    width: 45%;
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
    width: 45%;
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
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    width: 65%;
}
.grid-item {
    padding: 30px;
    width: 70%;
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
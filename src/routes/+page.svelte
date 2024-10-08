<script>
    // Imports
    import { fade } from 'svelte/transition';
    import SveltyPicker, { config } from 'svelty-picker';
    import { goto } from '$app/navigation';
    import MediaQuery from 'svelte-media-queries'
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    import { supabase } from '$lib/supabaseClient';

    // Assignment dropdown bool
    let visible = false;

    let rightHidden = false;

    let assignments = [
        {title: "Research Paper or Analytical Essay", icon: "/reflection_response_number_3.png", docID: "1gGwD5fEqQgll1SuAHNoxNyWa5TXZksinUd0Fhn25jmM"},
        {title: "Annotated Bibliography", icon: "/annotated-bibliography.png", docID: "1V2J5TQd7VOw57OOTCiJR1ZO1ATeb4jqN4Ss1PZLfVjA"},
        {title: "Artist's Statement", icon: "/artists_statement.png", docID: "15hNNEm_TcCQzjwV1w5hGWLeDvFGcJvrg86JUKB_oddc"},
        {title: "Business Report", icon: "/business_report.png", docID: "1bajwPw8FGidGIie-7ZO7Yrx-U8HW8vuG-kkygmf8ak0"},
        {title: "Discussion Post", icon: "/discussion_post.png", docID: "1s5gJaxbJGhxEacaWMJtOTYi5RymBuQIoEWFpDroAPoA"},
        {title: "Grammar and Linguistics Assignment", icon: "/grammer_and_linguistics_icon.png", docID: "18K6mJ7hnElymb1mJU1cno3hy7XptxdSh0Gmh23uY3YQ"},
        {title: "Math PS Assignment", icon: "/math_assignment.png", docID: "13h47l1l6w30VYLyRl3h2sHNr8LzFrm5gjJzPsDGjyJc"},
        {title: "Reflection or Response Paper", icon: "/reflection_response_new.png", docID: "1vNMvoXP1k9yb4IZDNajriQwmkfNZtf6-A_I4fNLXD6"},
        {title: "Literature Review", icon: "/lit_review_2.png", docID: "1PLXrrPtFy__ISXmkNhScPevdNfj28dg_XXkP7nOfDwA"},
        {title: "Poster Presentation", icon: "/poster_pres.png", docID: "17omHvESVC6-fAcPqH9Y23GiQlB8AzsgBG2qjHO2v1pU"}
    ];

    // Assignment Choice
    let assignmentChoice = null;
    
    // Datepicker dropdown bool
    let startDatePickerVisible = false;

    // Date picker selected date
    let selectedStartDate;
    let selectedEndDate;

    let plannerinfo = {
        startDate: null,
        endDate: null,
        atype: null
    }

    let delim;
    let simpleStartDate, simpleEndDate;

    // Update assignment state on change
    $: plannerinfo.startDate = selectedStartDate;
    $: plannerinfo.endDate = selectedEndDate;
    $: if (selectedStartDate) simpleStartDate = convertDate(selectedStartDate);
    $: if (plannerinfo.endDate) simpleEndDate = convertDate(plannerinfo.endDate);
    $: if (selectedStartDate) {selectedEndDate = undefined;simpleEndDate = undefined};

    let startButtonColor = "linear-gradient(90deg, rgba(33,126,221,1) 0%, rgba(33,46,129,1) 100%)";

    let accessibilityOn = false;

    function openAssignments()
    {
        if (!startDatePickerVisible)
        {
            leftHidden = !leftHidden;
            rightHidden = !rightHidden;
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
        openStartDatePicker();
    }

    function openStartDatePicker()
    {
        visible = !visible;
        setTimeout(() => {
            startDatePickerVisible = !startDatePickerVisible;
        }, 500)
    }
    
    function closeStartDatePicker()
    {
        startDatePickerVisible = !startDatePickerVisible
    }

    let warningDateMessage = false;
    function generateAssignment()
    {
        if (selectedStartDate)
        {
            closeStartDatePicker();
            let atype = assignmentChoice;
            let startDate = plannerinfo.startDate;
            let endDate = plannerinfo.endDate;
            let accessiblity = accessibilityOn;
            const params = new URLSearchParams({
                atype,
                startDate,
                endDate,
                accessiblity
            }).toString();
            setTimeout(() => {
                goto(`/${atype}?${params}`);
            }, 500)
        }
        else
            warningDateMessage = true;
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

    function backButton() {
        if (visible)
        {
            visible = !visible;
            setTimeout(() => {
                leftHidden = !leftHidden;
                rightHidden = !rightHidden;
            }, 500)
        }
        else if (startDatePickerVisible)
        {
            startDatePickerVisible = !startDatePickerVisible;
            setTimeout(() => {
                visible = !visible;
            }, 500)
        }
    }

    // *********** ACCESSIBILITY ***********//
    function keyDownEnter(event)
    {
        if (!leftHidden && !rightHidden)
            if (event.key === "Enter")
                openAssignments();
    }

    function keyBack(event)
    {
        if (event.key === "Backspace")
            backButton();
    }

    function keyAssignment(event)
    {
        if (visible) {
        switch (event.key) {
            case "1":
                assignments[0].title;
                assignmentChoice = assignments[0].title;
                plannerinfo.atype = assignments[0].title;
                openStartDatePicker();
                break;
            case "2":
                assignments[1].title;
                assignmentChoice = assignments[1].title;
                plannerinfo.atype = assignments[1].title;
                openStartDatePicker();
                break;
            case "3":
                assignments[2].title;
                assignmentChoice = assignments[2].title;
                plannerinfo.atype = assignments[2].title;
                openStartDatePicker();
                break;
            case "4":
                assignments[3].title;
                assignmentChoice = assignments[3].title;
                plannerinfo.atype = assignments[3].title;
                openStartDatePicker();
                break;
            case "5":
                assignments[4].title;
                assignmentChoice = assignments[4].title;
                plannerinfo.atype = assignments[4].title;
                openStartDatePicker();
                break;
            case "6":
                assignments[5].title;
                assignmentChoice = assignments[5].title;
                plannerinfo.atype = assignments[5].title;
                openStartDatePicker();
                break;
            case "7":
                assignments[6].title;
                assignmentChoice = assignments[6].title;
                plannerinfo.atype = assignments[6].title;
                openStartDatePicker();
                break;
            case "8":
                assignments[7].title;
                assignmentChoice = assignments[7].title;
                plannerinfo.atype = assignments[7].title;
                openStartDatePicker();
                break;
            case "9":
                assignments[8].title;
                assignmentChoice = assignments[8].title;
                plannerinfo.atype = assignments[8].title;
                openStartDatePicker();
                break;
            case "0":
                assignments[9].title;
                assignmentChoice = assignments[9].title;
                plannerinfo.atype = assignments[9].title;
                openStartDatePicker();
                break;
            default:
                console.log("not assignment");
                break;
        }
    }
    }

    function keyAccessibilityOn(event)
    {
        if (!leftHidden && event.key === "Escape" && accessibilityOn === false)
        {
            accessibilityOn = true;
            readIntro();
        }
    }

    // Set up the global event listener only in the browser
    onMount(() => {
        if (typeof window !== 'undefined') { // Check if window is defined
            window.addEventListener('keydown', keyDownEnter);
            window.addEventListener('keydown', keyBack);
            window.addEventListener('keydown', keyAssignment);
            window.addEventListener('keydown', keyAccessibilityOn);
        }
    });

    // Clean up the event listener when the component is destroyed
    onDestroy(() => {
        if (typeof window !== 'undefined') { // Check if window is defined
            window.removeEventListener('keydown', keyDownEnter);
            window.removeEventListener('keydown', keyBack);
            window.removeEventListener('keydown', keyAssignment);
            window.removeEventListener('keydown', keyAccessibilityOn);
        }
    });

    // Watch for changes
    afterUpdate(() => {

    });

    function readIntro()
    {
        // Speak date
        let synth = new SpeechSynthesisUtterance("Accessibility options have been turned on. This is the Concordia Assignment Planner. The Assignment Planner breaks down your projects into smaller, manageable steps and helps you organize your timeline. Each step offers helpful how-to links. Use the “add to calendar” feature to keep track of your progress. To begin, press enter.");
            
        const voices = speechSynthesis.getVoices();
        synth.voice = voices[0]; // Choose a specific voice
        speechSynthesis.speak(synth);
    }

    function readAssignments()
    {
        if (accessibilityOn) {
            let listOfAssignments = assignments[0].title;
            for (let i = 1; i < assignments.length; i++)
            {
                listOfAssignments = listOfAssignments.concat(", ", assignments[i].title);
            }
            // Speak date
            let synth = new SpeechSynthesisUtterance("Select one of 10 possible assignments using the numbers 1 to 9, and also 0. The list of possible assignments in order from 1 to 9 and finally zero is: " + listOfAssignments);
                
            const voices = speechSynthesis.getVoices();
            synth.voice = voices[0]; // Choose a specific voice
            speechSynthesis.speak(synth);
        }
    }

    function getAccessibilityDates()
    {
        if (accessibilityOn) {
            const date = new Date();

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            // This arrangement can be altered based on how we want the date's format to appear.
            let currentDate = `${year}-${month}-${day}`;

            // Convert to speakable format
            currentDate = convertDate(currentDate);

            // Speak date
            let synth = new SpeechSynthesisUtterance("Enter a start date. Today's date is " + currentDate + ". Please put the start date in the form, year, hyphen, month, hyphen, day, and then press enter.");
            
            const voices = speechSynthesis.getVoices();
            synth.voice = voices[0]; // Choose a specific voice
            speechSynthesis.speak(synth);

            // Prompt for start date
            plannerinfo.startDate = prompt("Enter an start date");

            synth = new SpeechSynthesisUtterance("Enter a due date. Your selected start date is " + convertDate(plannerinfo.startDate) + ". Please put the due date in the form, year, hyphen, month, hyphen, day.");
            synth.voice = voices[0]; // Choose a specific voice

            speechSynthesis.cancel(synth); // Bug override
            speechSynthesis.speak(synth);

            plannerinfo.endDate = prompt("Enter an end date");

            // Override conditional
            selectedStartDate = plannerinfo.startDate;

            generateAssignment();
        }
    }
    //*********** END: ACCESSIBILITY ***********//

    //*********** FETCH DYNAMIC ASSIGNMENTS ***********//
    const fetchAssignments = async () => {
        let { data, error } = await supabase.from('assignments').select('*');
        if (error) {
            console.error(error);
        } else {
            assignments = data;
            console.log("assigned successfully")
        }
    };
    //*********** END: FETCH DYNAMIC ASSIGNMENTS ***********//

    let altLayout = true;
</script>

<!-- WEB LAYOUT -->
 {#await fetchAssignments()}
    <p>Fetching the assignments...</p>
 {:then f} 
<MediaQuery query='(min-width: 1001px)' let:matches>
{#if matches}
<div class="fp-container">
    {#if !leftHidden}
    <div tabindex="0" on:keydown={keyAccessibilityOn} transition:fade class="fp-left">
        <div style="display: flex;flex-direction:row;">
            <img class="fp-logo" alt="fp-logo" src="/concordia-logo.webp">
        </div>
        <!-- DIVIDER -->
        <div class="divider" style="margin-bottom: 10%;"></div>
        <!-- END DIVIDER -->
        <h2 class="fp-title">Concordia University Assignment Planner</h2>
        <!-- DIVIDER -->
        <div class="divider"></div>
        <!-- END DIVIDER -->
        <div class="fp-buttons-container">
            <div tabindex="0" on:keydown={keyDownEnter} on:click={openAssignments} class="begin-button">
                <h2 class="begin-button-text">Choose Assignment</h2>
            </div>
        </div>
        <!-- DIVIDER -->
        <div class="divider" style="margin-bottom: 10%;"></div>
        <!-- END DIVIDER -->
        <div style="width: 100%;display: flex;flex-direction:row;align-items:center;justify-content:space-between;">
            <img class="fp-student-success-logo" alt="fp-student-success-logo" src="/student_success_logo.webp">
        </div>
    </div>
    {/if}
    {#if !rightHidden}
        <div transition:fade style="width: 60%;display: flex;justify-content:center;align-items:center;">
            <div style="width: 80%;">
                <p class="fp-descript-right">The Assignment Planner breaks down your projects into smaller, manageable
                    steps and helps you organize your timeline. Each step offers helpful "how-to"
                    links. Use the “add to calendar” feature to keep track of your progress.</p>
                    <p class="fp-descript-right"><strong>Begin by selecting your assignment type.</strong></p>
            </div>
        </div>
    {/if}
    {#if visible || startDatePickerVisible}
        <div tabindex="0" on:keydown={keyBack} on:click={backButton} transition:fade class="back-button">
            <h2>Back</h2>
        </div>
    {/if}
    <div class="fp-right">
        {#if visible && !altLayout}
            <div use:readAssignments tabindex="0" on:keydown={keyAssignment} class="grid-container" transition:fade>
                {#each assignments as assignment}
                    <div class="grid-assign">
                        <img on:click={selectAssignmentType} id={assignment.title} class="grid-item" alt={assignment.title} src={assignment.icon}>
                        <h2 style="font-weight: 600;font-size:1.8em;margin:0;">{assignment.title}</h2>
                    </div>
                {/each}
            </div>
        {/if}

        {#if visible && altLayout}
            <div use:readAssignments tabindex="0" on:keydown={keyAssignment} class="alt-layout-container" transition:fade>
                {#each assignments as assignment}
                <div class="alt-layout-elem">
                    <div class="alt-item">
                        <img style="width: 150px;height:auto;" on:click={selectAssignmentType} id={assignment.title} alt={assignment.title} src={assignment.icon}>
                    </div>
                    <h2 class="alt-item-text">{assignment.title}</h2>
                </div>
                {/each}
            </div>
        {/if}

        <!-- Initial Date Picker -->
        {#if startDatePickerVisible}
        {#if accessibilityOn}
            <div use:getAccessibilityDates></div>
        {/if}
            <div style="display: flex;flex-direction: column;align-items:center;justify-content:center;" transition:fade>
                {#if simpleEndDate != undefined}
                    <h2 transition:fade style="color: black;font-size:2.2em;" class="fp-start-date-text">{simpleStartDate + " - " + simpleEndDate}</h2>
                {/if}
                {#if warningDateMessage && simpleEndDate === undefined}
                    <h2 in:fade style="color: black;font-size:2.2em;" class="fp-start-date-text">You must select a date to continue.</h2>
                {/if}
                <div style="width:50vw;display: flex;flex-direction:row;justify-content:space-between;">
                    <div>
                        <SveltyPicker pickerOnly startDate={new Date()} bind:value={selectedStartDate} />
                        <p class="under-date-text">Start Date</p>
                    </div>
                    {#if selectedStartDate != undefined}
                        <div transition:fade>
                            <SveltyPicker pickerOnly startDate={selectedStartDate} bind:value={selectedEndDate} />
                            <p class="under-date-text">End Date</p>
                        </div>
                    {/if}
                </div>
                <div style="background: {startButtonColor};" class="fp-start-button"
                    on:click={generateAssignment}>
                    <h2 class="fp-start-date-text">Press to confirm</h2>
                </div>
            </div>
        {/if}
    </div>
</div>
{/if}
</MediaQuery>
<!-- END: WEB LAYOUT -->

<!-- TABLET / MOBILE LAYOUT -->
<MediaQuery query='(max-width: 1000px)' let:matches>
    {#if matches}
        <div class="m-fp-container">
            {#if !leftHidden}
                <div class="m-fp-inner-container" transition:fade>
                    <h2 class="m-fp-title">Concordia University Assignment Planner</h2>
                    <p class="m-fp-p-text">The Assignment Planner breaks down your projects into smaller, manageable
                        steps and helps you organize your timeline. Each step offers helpful "how-to"
                        links. Use the “add to calendar” feature to keep track of your progress.</p>
                    <p class="m-fp-p-text"><strong>Begin by selecting your assignment type.</strong></p>
                    <div style="display: flex;justify-content:center;">
                        <div on:click={openAssignments} class="m-begin-button">
                            <h2 class="begin-button-text">Choose Assignment</h2>
                        </div>
                    </div>
                    <div style="display: flex;flex-direction:row;justify-content:center;margin-top:30px;">
                        <div style="display: flex;flex-direction:column;justify-content:center;align-items:center;width:100%">
                            <img style="width: 80%;margin-bottom:20px;" class="fp-logo" alt="fp-logo" src="/concordia-logo.webp">
                            <img style="width: 80%;margin-bottom:20px;" class="fp-student-success-logo" alt="fp-student-success-logo" src="/student_success_logo.webp">
                        </div>
                    </div>
                </div>
            {/if}

            {#if visible}
                <div class="m-grid-container" transition:fade>
                    <div style="margin-bottom: 20px;" on:click={backButton} transition:fade class="m-back-button">
                        <h2 class="m-button-text">Back</h2>
                    </div>
                    {#each assignments as assignment}
                        <div class="grid-assign">
                            <img on:click={selectAssignmentType} id={assignment.title} class="m-grid-item" alt={assignment.title} src={assignment.icon}>
                            <h2 style="font-weight: 600;font-size:4.0vmin;margin:0;margin-bottom:50px;">{assignment.title}</h2>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Initial Date Picker -->
            {#if startDatePickerVisible}
                <div style="width:100%;display:flex;justify-content:center;align-items:center;flex-direction:column;" transition:fade>
                    <div style="margin-bottom: 20px;" on:click={backButton} transition:fade class="m-back-button">
                        <h2 class="m-button-text">Back</h2>
                    </div>
                    <div>
                        <SveltyPicker pickerOnly startDate={new Date()} bind:value={selectedStartDate} />
                        <p class="under-date-text">Start Date</p>
                    </div>
                    {#if selectedStartDate != undefined}
                        <div transition:fade>
                            <SveltyPicker pickerOnly startDate={selectedStartDate} bind:value={selectedEndDate} />
                            <p class="under-date-text">End Date</p>
                        </div>
                    {/if}
                    <div style="background: {startButtonColor};width:80%;" class="m-fp-confirm-button"
                        on:click={generateAssignment}>
                        <h2 class="fp-start-date-text">Press to confirm</h2>
                    </div>    
                </div>
            {/if}
        </div>
    {/if}
</MediaQuery>
<!-- END: MOBILE LAYOUT -->
{/await}

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
    width: 50%;
    margin-left: 5%;
    z-index: 3;
}
.fp-left h2, .fp-left p {
    font-family: "Montserrat", sans-serif;
}
.fp-title {
    font-size: 6vmin;
    font-weight: 700;
}
.fp-descript {
    font-size: 1em;
}
.fp-right {
    width: 100%;
    height: 100%;
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
    padding-bottom: 10px;
    width: auto;
    height: 25vh;
    cursor: pointer;
    transition: ease-in-out;
    transition-duration: .2s;
}
.grid-item:hover {
    background-color: #912338;
    transform: translateY(-3%);
    transition: ease-in-out;
    transition-duration: .2s;
    padding-bottom: 30px;
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
.fp-descript-right {
    font-size: 3.5vmin;
    font-family: "Montserrat", sans-serif;
    line-height: 50px;
}
.begin-button {
    width: 70%;
    background-color: #912338;
    border-radius: 15px;
    padding: 25px 25px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease, color 0.3s ease;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    margin-top: 3%;
    transition: .4s ease-in-out;
}
.begin-button:hover {
    transform: scale(1.05);
    transition: .3s ease-in-out;
}
.begin-button-text {
    font-size: 3vmin;
    color: white;
    font-weight: 300;
    font-family: "Montserrat", sans-serif;
}
.under-date-text {
    font-size: 4vmin;
    font-family: "Montserrat", sans-serif;
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
    z-index: 3;
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

/* MOBILE STYLES */
.m-fp-container {
    width: 100%;
    display: flex;
    justify-content: center;
}
.m-fp-inner-container {
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
.m-fp-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 10vmin;
    text-align: center;
    margin-bottom: 0;
}
.m-fp-p-text {
    text-align: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 5vw;
    line-height: 40px;
}
.m-begin-button {
    width: 70%;
    background-color: #912338;
    border-radius: 15px;
    padding: 25px 25px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease, color 0.3s ease;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    margin-top: 3%;
    transition: .4s ease-in-out;
}
.m-grid-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.m-grid-item {
    padding: 30px;
    padding-bottom: 10px;
    width: 50vw;
    cursor: pointer;
    transition: ease-in-out;
    transition-duration: .2s;
}
.m-grid-item:hover {
    background-color: #912338;
    transform: translateY(-3%);
    transition: ease-in-out;
    transition-duration: .2s;
    padding-bottom: 30px;
}
.m-fp-start-button {
    width: 80%;
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
.m-fp-confirm-button {
    width: 80%;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 15px;
    padding: 5px 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease, color 0.3s ease;
}
.m-back-button {
    background-color: rgb(145, 35, 56, 0.3);
    transition: .4s ease-in-out;
    width: 100%;
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 3;
}
.m-back-button:hover {
    transition: .4s ease-in-out;
    background-color: rgb(145, 35, 56, 1);
}
.m-button-text {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
}
/* END: MOBILE STYLES */

/* ALT LAYOUT */
.alt-layout-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.alt-layout-elem {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 50%;
}
.alt-item {
    width: 150px;
    padding: 40px;
    margin: 20px 80px 20px 20px;
    cursor: pointer;
    transition: ease-in-out;
    transition-duration: .4s;
}
.alt-item:hover {
    background-color: #912338;
    transition: ease-in-out;
    transition-duration: .4s;
    transform: translateY(-3%);
}
.alt-item-text {
    font-weight: 600;
    font-size:1.8em;
    font-weight: 400;
    margin:0;
    font-family: "Montserrat", sans-serif;
}
/* END: ALT LAYOUT */
</style>
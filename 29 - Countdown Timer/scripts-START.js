let countDown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // clear any existing timer
    clearInterval(countDown);

    const now = Date.now(); // return current time in milliseconds (a bunch of numbers) and can be converted back to readable date using new Date(now)
    const then = now + (seconds * 1000);
    
    displayTimerLeft(seconds);  // to immediately display the seconds at the beginning and connect seamlessly with setInterval later

    displayEndTime(then);

    // setInterval only start to runs after 1 second time lapse
    // set it to a variable for us to call clearInterval else setInterval will keep running even after secondsLeft reach 0
    // clearInterval(intervalid) - required (the interval id returned from setInterval())
    countDown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop it
        if (secondsLeft < 0) {
            clearInterval(countDown);
            return;
        }

        //display it
        displayTimerLeft(secondsLeft);
    }, 1000);
}

function displayTimerLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = display;   // it will update the tab bar in browser
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);  
    const hours = end.getHours();
    const minutes = end.getMinutes();
    endTime.textContent = `Be Back At ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// can access to the element with name using document.name and can access to what nested in it if it has a name too, document.name.nameofchild
// in this case, document.customForm.minutes will return the input element
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();     // prevent the page to be reload when submitted
    const mins = this.minutes.value;
    timer(mins * 60);
    this.reset();       // clear the input bar
});
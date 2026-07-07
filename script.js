// 👇 Splash Screen Logic
window.addEventListener('load', () => {
  const splash = document.getElementById('disclaimer-screen');

  // Show the splash for 2 seconds (3000ms)
  const delay = 2200;

  setTimeout(() => {
    splash.classList.add('fade-out');
  }, delay);
});

// Rate Calculations
let rates = {};

window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load rates from external file
    const response = await fetch('rates.json');
    rates = await response.json();

    // Populate destination dropdown
    const destinationSelect = document.getElementById('destination');
    Object.keys(rates).forEach(dest => {
      const option = document.createElement('option');
      option.value = dest;
      option.textContent = dest;
      destinationSelect.appendChild(option);
    });

  } catch (error) {
    console.error('Failed to load rates:', error);
    alert('Error loading destination rates.');
  }
});

document.getElementById('allowance-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const destination = document.getElementById('destination').value;
  const hours = parseFloat(document.getElementById('hours').value);
  const minutes = parseFloat(document.getElementById('minutes').value);

  if (!rates[destination]) {
    alert('Please select a valid destination.');
    return;
  }

  const { rate: hourlyRate, currency }  = rates[destination];

  // Round minutes to nearest 15-minute block
  let roundedMinutes = Math.round(minutes / 15) * 15;

  // If rounded minutes == 60, treat it as an extra hour
  let adjustedHours = hours;
  if (roundedMinutes === 60) {
    adjustedHours += 1;
    roundedMinutes = 0;
 }

  const total = (hourlyRate * adjustedHours) + (hourlyRate * (roundedMinutes / 60));

  document.getElementById('result').innerHTML = `
    <h2>Results</h2>
    <p><strong>Destination:</strong> ${destination}</p>
    <p><strong>Hourly Rate:</strong> ${hourlyRate} ${currency}</p>
    <p><strong>Total Payable:</strong> ${total.toFixed(2)} ${currency}</p>
  `;
});

//Day Trip Calculation
document.getElementById('day-trips-form').addEventListener('submit', function (e) {

  e.preventDefault();

  const outboundHours = parseInt(document.getElementById('hours-outbound').value);
  const outboundMinutes = parseInt(document.getElementById('minutes-outbound').value);
  const inboundHours= parseInt(document.getElementById('hours-inbound').value);
  const inboundMinutes = parseInt(document.getElementById('minutes-inbound').value);
  const signoffTime = document.getElementById('end-duty-time').value;

  if (!signoffTime) {
    alert("Please enter sign-off time.");
    return;
  }

  //Conversion to Minutes
  const outboundTotalMinutes = (outboundHours * 60) + outboundMinutes;
  const inboundTotalMinutes = (inboundHours * 60) + inboundMinutes;

  //Rest at Home Base Calculation
  const restAtHome = ((outboundTotalMinutes + inboundTotalMinutes)*2) + 65;

  //Rest at Home Converted Back to Minutes and Hours
  const restAtHomeHours = Math.floor(restAtHome / 60);
  const restAtHomeMinutes = restAtHome % 60;

  // Split sign-off time
  const [hours, minutes] = signoffTime.split(":").map(Number);

  // Create date object
  const signOffEnds = new Date();
  
  signOffEnds.setHours(hours, minutes, 0, 0);

  // Add rest hours
  signOffEnds.setHours(signOffEnds.getHours() + restAtHome);

  // Format result HH:MM
  const signOffEndsFormatted =
    String(signOffEnds.getHours()).padStart(2, "0") +
    String(signOffEnds.getMinutes()).padStart(2, "0");

  document.getElementById('result').innerHTML = `
    <h2>Results</h2>
    <p><strong>Rest at Home:</strong> ${restAtHomeHours} Hours and ${restAtHomeMinutes} Minutes</p>
    <p><strong>Time When Rest Ends:</strong> ${signOffEndsFormatted} Hours</p>
  `;
});

// Disruption Rest Calculation

document.getElementById('disruption-form').addEventListener('submit', function (e) {

  e.preventDefault();

  const dutyTimeHours = parseInt(document.getElementById('hours-duty').value);
  const dutyTimeMinutes = parseInt(document.getElementById('minutes-duty').value);
  const arrivalTime = document.getElementById('arrival-time').value;



  if (!arrivalTime) {
    alert("Please enter arrival time.");
    return;
  }

  // Calculate applicable rest
  const actualRest = dutyTimeHours - 1 + (dutyTimeMinutes >= 30 ? 1 : 0);

  // Split arrival time
  const [hours, minutes] = arrivalTime.split(":").map(Number);

  // Create date object
  const restEnds = new Date();

  restEnds.setHours(hours, minutes, 0, 0);

  // Add rest hours
  restEnds.setHours(restEnds.getHours() + actualRest);

  //Arrival time formatted
  const arrivalTimeFormatted = arrivalTime.replace(':', '') + " Hours";

  // Rest ends formatted
  const restEndsFormatted =
    String(restEnds.getHours()).padStart(2, "0") +
    String(restEnds.getMinutes()).padStart(2, "0");


  document.getElementById('result').innerHTML = `

    <h2>Results</h2>
    <p><strong>Duty Time:</strong> ${dutyTimeHours} Hours and ${dutyTimeMinutes} Minutes</p>
    <p><strong>Applicable Rest:</strong> ${actualRest} Hours</p>
    <p><strong>Arrival at Hotel:</strong> ${arrivalTimeFormatted}</p>
    <p><strong>Rest Ends:</strong> ${restEndsFormatted} Hours</p>
  `;


});

// Calculator swipe carousel

const track = document.querySelector(".carousel-track");
const pages = document.querySelectorAll(".calculator-page");
const title = document.getElementById("calculator-title");

const titles = [
  "TOD Allowance Calculator",
  "Day Trips Calculator",
  "Disruption Rest Calculator"
];


let currentPage = 0;


function updateCarousel(){

  track.style.transform =
    `translateX(-${currentPage * 100}%)`;

  title.textContent = titles[currentPage];

}

document.getElementById("swipe-left")
.addEventListener("click",()=>{

  if(currentPage > 0){
    currentPage--;
    updateCarousel();
  }

});


document.getElementById("swipe-right")
.addEventListener("click",()=>{

  if(currentPage < pages.length-1){
    currentPage++;
    updateCarousel();
  }

});

// Touch swipe
let startX = 0;


track.addEventListener("touchstart",(e)=>{

  startX = e.touches[0].clientX;

});

track.addEventListener("touchend",(e)=>{

  let endX = e.changedTouches[0].clientX;

  if(startX - endX > 50){

    if(currentPage < pages.length-1){
      currentPage++;
      updateCarousel();
    }

  }

  if(endX - startX > 50){

    if(currentPage > 0){
      currentPage--;
      updateCarousel();
    }

  }

});

// Clear buttons

document.querySelectorAll('.clear-button').forEach(button => {

  button.addEventListener('click', function() {

    // Find the form this button belongs to
    const form = this.closest('form');

    // Clear all inputs
    form.reset();

    // Clear results
    document.getElementById('result').innerHTML = "";

  });

});
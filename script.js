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


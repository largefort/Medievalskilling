// adscript.js

// Function to create and display the ad
function displayAd() {
  const adContainer = document.getElementById('ad-container');
  
  // Create an ad-like element (you can replace this with actual ad code)
  const adElement = document.createElement('div');
  adElement.className = 'ad';
  adElement.textContent = 'Your Ad Here'; // Replace with ad content or code
  
  // Append the ad element to the container
  adContainer.appendChild(adElement);
}

// Call the displayAd function when the page loads
window.onload = displayAd;

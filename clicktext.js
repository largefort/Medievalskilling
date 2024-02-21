// clicktext.js

// Function to initialize the clicker game
function initializeClickerGame() {
  // Get the castle image element
  const castleImage = document.getElementById('castle');

  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = castleImage.width;
  canvas.height = castleImage.height;
  canvas.style.position = 'absolute';
  canvas.style.top = castleImage.offsetTop + 'px';
  canvas.style.left = castleImage.offsetLeft + 'px';
  document.body.appendChild(canvas);

  // Get the 2D context of the canvas
  const ctx = canvas.getContext('2d');

  // Variable to store the number of gold coins
  let goldCoins = 0;

  // Variable to store the total number of clicks
  let clickCount = 0;

  // Create an HTML element to display the click count
  const clickCountElement = document.createElement('div');
  clickCountElement.id = 'clickCount';
  clickCountElement.textContent = 'Clicks: 0';
  document.body.appendChild(clickCountElement);

  // Function to handle click events on the castle
  function clickCastle() {
    // Increment the click count
    clickCount++;

    // Update the display
    updateClickCountDisplay();

    // Get the coordinates of the click relative to the canvas
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    // Check if the click is inside the castle
    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      // Increment the gold coins
      goldCoins++;

      // Display the number text
      displayNumberText(x, y, goldCoins);
    }
  }

  // Function to update the click count display
  function updateClickCountDisplay() {
    clickCountElement.textContent = 'Clicks: ' + clickCount;
  }

  // Function to display the number text
  function displayNumberText(x, y, value) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set text style
    ctx.font = '24px Arial';
    ctx.fillStyle = 'gold';
    ctx.textAlign = 'center';

    // Draw the number text at the click position
    ctx.fillText('+' + value, x, y);

    // Clear the number text after a short delay
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 1000);
  }

  // Attach the click event handler to the castle image
  castleImage.addEventListener('click', clickCastle);
}

// Call the function to initialize the clicker game when the window loads
window.onload = initializeClickerGame;

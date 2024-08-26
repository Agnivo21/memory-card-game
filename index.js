const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

// Get references to modal elements
const matchModal = document.getElementById("matchModal");
const modalMessage = document.getElementById("modalMessage");
const closeModal = document.getElementById("closeModal");

// Element to display score
document.querySelector(".score").textContent = score;

// Fetch card data and initialize the game
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

// Function to shuffle the cards
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// Function to generate card elements
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <div class="front-text">${card.keyword}</div> <!-- Changed from image to text -->
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// Function to handle card flip
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

// Function to check if two cards match
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    // If cards match, show a message after a short delay
    setTimeout(() => {
      const matchedCardName = firstCard.dataset.name;
      showMatchMessage(matchedCardName); // New function to display message
      disableCards();
    }, 500); // 500ms delay for better UI experience
  } else {
    unflipCards();
  }
}

// Function to display a message when cards match using a modal
function showMatchMessage(cardName) {
  // Find the card object from the cards array
  const matchedCard = cards.find(card => card.name === cardName);

  // Check if the matchedCard is found and has a message property
  if (matchedCard && matchedCard.message) {
    modalMessage.textContent = matchedCard.message; // Set message text
    matchModal.style.display = "flex"; // Show modal
  } else {
    console.error("No message found for the matched card:", cardName);
  }
}

// Function to disable matched cards
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

// Function to unflip cards if not matched
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// Function to reset the board state
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Function to restart the game
function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}

// Event listener for closing the modal
closeModal.addEventListener("click", () => {
  matchModal.style.display = "none";
  resetBoard();
});

// Optional: Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target == matchModal) {
    matchModal.style.display = "none";
    resetBoard();
  }
});

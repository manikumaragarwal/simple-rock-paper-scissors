// script.js
// Game state
const gameState = {
  players: [],
  currentRound: 1,
  totalRounds: 5,
  min: 0,
  max: 100,
  target: null,
  guesses: {},
  prompts: {
    truth: [
      "what's the longest you went without taking a shower.",
      "What are your scared of regarding your future.",
      "Who was the worst person in JNV?"
    ],
    dare: [
      "Call a random JNV friend who you're not in contact with anymore.",
      "Cook something for your family.. but put extra salt in it.",
      "Watch a Horror movie at your roof-top alone at night."
    ]
  },
  strikes: {},
  currentPlayer: 0
};

// DOM elements
const elements = {
  playerCount: document.getElementById('player-count'),
  playerInputs: document.getElementById('player-inputs'),
  rounds: document.getElementById('rounds'),
  truthInput: document.getElementById('truth-input'),
  dareInput: document.getElementById('dare-input'),
  truthList: document.getElementById('truth-list'),
  dareList: document.getElementById('dare-list'),
  startGame: document.getElementById('start-game'),
  currentRound: document.getElementById('current-round'),
  guessingPlayers: document.getElementById('guessing-players'),
  guessInput: document.getElementById('guess-input'),
  submitGuess: document.getElementById('submit-guess'),
  minValue: document.getElementById('min-value'),
  maxValue: document.getElementById('max-value'),
  targetValue: document.getElementById('target-value'),
  resultsPlayers: document.getElementById('results-players'),
  showPunishment: document.getElementById('show-punishment'),
  punishmentType: document.getElementById('punishment-type'),
  punishmentText: document.getElementById('punishment-text'),
  punishmentPlayer: document.getElementById('punishment-player'),
  nextRound: document.getElementById('next-round'),
  screens: {
    setup: document.getElementById('setup-screen'),
    guessing: document.getElementById('guessing-screen'),
    results: document.getElementById('results-screen'),
    punishment: document.getElementById('punishment-screen')
  }
};

// Initialize the game
function initGame() {
  generatePlayerInputs();
  loadDefaultPrompts();

  // Add event listeners
  elements.playerCount.addEventListener('change', generatePlayerInputs);
  document.getElementById('add-truth').addEventListener('click', () => addPrompt('truth'));
  document.getElementById('add-dare').addEventListener('click', () => addPrompt('dare'));
  elements.startGame.addEventListener('click', startGame);
  elements.submitGuess.addEventListener('click', submitGuess);
  elements.showPunishment.addEventListener('click', showPunishment);
  elements.nextRound.addEventListener('click', nextRound);

  // Allow Enter key to submit guess
  elements.guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitGuess();
    }
  });
}

// Generate player inputs based on selected count
function generatePlayerInputs() {
  const container = elements.playerInputs;
  const count = parseInt(elements.playerCount.value);
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    container.innerHTML += `
            <div class="player-card">
                <div class="player-icon">👤</div>
                <input type="text" class="player-name-input" placeholder="Player ${i + 1}" required>
            </div>
        `;
  }
}

// Load default prompts
function loadDefaultPrompts() {
  elements.truthList.innerHTML = '';
  elements.dareList.innerHTML = '';

  gameState.prompts.truth.forEach(prompt => {
    elements.truthList.innerHTML += `<li>${prompt}</li>`;
  });

  gameState.prompts.dare.forEach(prompt => {
    elements.dareList.innerHTML += `<li>${prompt}</li>`;
  });
}

// Add a new prompt
function addPrompt(type) {
  const input = type === 'truth' ? elements.truthInput : elements.dareInput;
  const list = type === 'truth' ? elements.truthList : elements.dareList;
  const text = input.value.trim();

  if (text) {
    gameState.prompts[type].push(text);
    list.innerHTML += `<li>${text}</li>`;
    input.value = '';
    showNotification(`New ${type} prompt added!`);
  }
}

// Start the game
function startGame() {
  // Get player names
  const playerInputs = document.querySelectorAll('.player-name-input');
  gameState.players = Array.from(playerInputs).map(input => input.value.trim()).filter(name => name);

  if (gameState.players.length < 2) {
    showNotification("You need at least 2 players!");
    return;
  }

  // Get rounds
  gameState.totalRounds = parseInt(elements.rounds.value) || 5;

  // Initialize strikes
  gameState.players.forEach(player => {
    gameState.strikes[player] = 0;
  });

  // Start first round
  showScreen('guessing');
  elements.currentRound.textContent = gameState.currentRound;

  // Set min/max values
  elements.minValue.textContent = gameState.min;
  elements.maxValue.textContent = gameState.max;

  // Generate target number
  gameState.target = generateTarget();

  // Reset guesses and current player
  gameState.guesses = {};
  gameState.currentPlayer = 0;

  // Display players
  updateGuessingScreen();
}

// Show specific screen
function showScreen(screenName) {
  Object.values(elements.screens).forEach(screen => {
    screen.classList.add('hidden');
  });
  elements.screens[screenName].classList.remove('hidden');
}

// Generate a random target number
function generateTarget() {
  return Math.floor(Math.random() * (gameState.max - gameState.min + 1)) + gameState.min;
}

// Update the guessing screen with players
function updateGuessingScreen() {
  const container = elements.guessingPlayers;
  container.innerHTML = '';

  gameState.players.forEach(player => {
    const hasGuessed = gameState.guesses[player] !== undefined;
    container.innerHTML += `
            <div class="player-card ${hasGuessed ? 'active' : ''}">
                <div class="player-icon">${hasGuessed ? '✅' : '🤔'}</div>
                <div class="player-name">${player}</div>
                <div class="player-status">${hasGuessed ? 'Guessed' : 'Thinking...'}</div>
            </div>
        `;
  });
}

// Submit a guess
function submitGuess() {
  const guess = parseInt(elements.guessInput.value);

  if (isNaN(guess)) {
    showNotification("Please enter a valid number!");
    return;
  }

  if (guess < gameState.min || guess > gameState.max) {
    showNotification(`Guess must be between ${gameState.min} and ${gameState.max}!`);
    return;
  }

  // Save guess for current player
  const currentPlayer = gameState.players[gameState.currentPlayer];
  gameState.guesses[currentPlayer] = guess;
  elements.guessInput.value = '';

  // Move to next player or show results
  gameState.currentPlayer++;

  if (gameState.currentPlayer < gameState.players.length) {
    // Update UI for next player
    showNotification(`${currentPlayer} guessed! Next player's turn.`);
    updateGuessingScreen();
  } else {
    // All players have guessed
    setTimeout(showResults, 1000);
  }
}

// Show results
function showResults() {
  showScreen('results');

  // Reveal target number with animation
  elements.targetValue.textContent = gameState.target;

  // Create fireworks effect
  createFireworks();

  // Calculate results
  const results = calculateResults();

  // Display player results
  displayPlayerResults(results);
}

// Calculate game results
function calculateResults() {
  const differences = [];

  // Calculate differences
  gameState.players.forEach(player => {
    if (gameState.guesses[player] !== undefined) {
      const diff = Math.abs(gameState.target - gameState.guesses[player]);
      differences.push({ player, diff, guess: gameState.guesses[player] });
    }
  });

  // Find min and max differences
  const minDiff = Math.min(...differences.map(d => d.diff));
  const maxDiff = Math.max(...differences.map(d => d.diff));

  // Determine winners and loser
  const winners = differences.filter(d => d.diff === minDiff).map(d => d.player);
  const losers = differences.filter(d => d.diff === maxDiff).map(d => d.player);

  // If multiple losers, select one randomly
  const loser = losers[Math.floor(Math.random() * losers.length)];

  return { winners, loser, differences };
}

// Display player results
function displayPlayerResults(results) {
  const container = elements.resultsPlayers;
  container.innerHTML = '';

  results.differences.forEach(playerData => {
    const isWinner = results.winners.includes(playerData.player);
    const isLoser = playerData.player === results.loser;

    container.innerHTML += `
            <div class="player-card ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}">
                <div class="player-icon">${isWinner ? '🏆' : isLoser ? '💀' : '👤'}</div>
                <div class="player-name">${playerData.player}</div>
                <div class="player-status">Guessed: ${playerData.guess}</div>
                <div class="player-status">Difference: ${playerData.diff}</div>
                <div class="player-status">${isWinner ? 'Winner!' : isLoser ? 'Loser!' : ''}</div>
            </div>
        `;
  });
}

// Show punishment screen
function showPunishment() {
  showScreen('punishment');

  // Calculate results again to get the loser
  const results = calculateResults();
  const loser = results.loser;

  // Assign punishment
  const punishment = assignPunishment(loser);

  // Display punishment
  elements.punishmentType.textContent = punishment.type.toUpperCase();
  elements.punishmentText.textContent = punishment.prompt;
  elements.punishmentPlayer.textContent = loser;

  // Update strikes display
  updateStrikesDisplay(loser);
}

// Assign punishment to the loser
function assignPunishment(loser) {
  // Increment strikes
  gameState.strikes[loser] = (gameState.strikes[loser] || 0) + 1;

  // Determine punishment type
  let type;
  if (gameState.strikes[loser] >= 3) {
    type = "dare";
  } else {
    type = Math.random() > 0.5 ? "truth" : "dare";
  }

  // Select random prompt
  const prompts = gameState.prompts[type];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  return { type, prompt };
}

// Update strikes display
function updateStrikesDisplay(player) {
  const strikesContainer = document.querySelector('.strikes-container');
  const strikes = gameState.strikes[player] || 0;

  // Reset strikes
  strikesContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const strike = document.createElement('div');
    strike.classList.add('strike');
    if (i < strikes) {
      strike.classList.add('active');
    }
    strikesContainer.appendChild(strike);
  }
}

// Move to next round
function nextRound() {
  gameState.currentRound++;
  gameState.currentPlayer = 0;

  if (gameState.currentRound > gameState.totalRounds) {
    endGame();
    return;
  }

  // Reset for next round
  gameState.target = generateTarget();
  gameState.guesses = {};

  showScreen('guessing');

  elements.currentRound.textContent = gameState.currentRound;
  updateGuessingScreen();
}

// End the game
function endGame() {
  document.body.innerHTML = `
        <div class="game-container">
            <header>
                <div class="logo">
                    <div class="logo-icon">🎉</div>
                    <h1>Game Over!</h1>
                </div>
            </header>
            <div class="screen">
                <h2>Game Completed</h2>
                <p>Thanks for playing Chaos Truth and Dare!</p>
                <div class="action-buttons">
                    <button onclick="location.reload()">Play Again</button>
                </div>
            </div>
        </div>
    `;
// I know, I should have made this a little more secure, but IDGAF. nobody's going to use this shit!
  
  // Create confetti effect
  createConfetti();
}

// Show notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Create fireworks effect
function createFireworks() {
  const fireworksContainer = document.getElementById('fireworks');
  fireworksContainer.innerHTML = '';

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const firework = document.createElement('div');
      firework.classList.add('firework');
      firework.style.left = `${Math.random() * 100}%`;
      firework.style.top = `${Math.random() * 100}%`;
      firework.style.backgroundColor = getRandomColor();
      firework.style.boxShadow = `0 0 10px ${getRandomColor()}`;
      fireworksContainer.appendChild(firework);

      setTimeout(() => {
        firework.remove();
      }, 1000);
    }, i * 50);
  }
}

// Create confetti effect
function createConfetti() {
  const container = document.querySelector('.game-container');

  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = getRandomColor();
      container.appendChild(confetti);

      // Animation
      const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 3000 + Math.random() * 3000,
        easing: 'cubic-bezier(0,0.9,0.57,1)'
      });

      animation.onfinish = () => confetti.remove();
    }, i * 100);
  }
}

// Get random color
function getRandomColor() {
  const colors = ['#ff6b6b', '#4ade80', '#60a5fa', '#fbbf24', '#c084fc', '#22d3ee'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', initGame);

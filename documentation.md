# Chaos Truth & Dare Game - Complete Code Guide

okay, so this is the whole overview of my project.. I think if You go through this, you might be able to build your own in a day.. It took me almost a month tho :(

## Table of Contents

1. [Project Overview](#project-overview)
2. [HTML Structure](#html-structure)
3. [CSS Design System](#css-design-system)
4. [JavaScript Game Logic](#javascript-game-logic)
5. [Game Flow](#game-flow)
6. [Special Effects](#special-effects)
7. [Responsive Design](#responsive-design)
8. [Key Functions Explained](#key-functions-explained)
9. [Customization Guide](#customization-guide)

## 1. Project Overview <a name="project-overview"></a>

Chaos Truth & Dare is a web-based party game where:

- Each players guess a number between 0-100. (a random target number is automatically generated per round)
- The player farthest from the target number gets a punishment
- Punishments are either truth questions or dare challenges. (these dares and truths are selected by the player themselves, but would be randomly generated.)
- Game features multiple rounds with strike(points) tracking
- Visual effects like fireworks and confetti enhance gameplay (it wass verry verry hardd!!!! :'(

## 2. HTML Structure <a name="html-structure"></a>

The game uses a multi-screen approach:

- I am thinking of making it multiplayer.. but I don't know how to configure a firebase.. the backend handling is quite tough.. but the backend handling is quite tough.. but I'll figure it out somehow. hopefully.

### Key Sections:

```html
<div class="game-container">
  <header>...</header>

  <!-- Setup Screen -->
  <div id="setup-screen" class="screen">...</div>

  <!-- Guessing Screen -->
  <div id="guessing-screen" class="screen hidden">...</div>

  <!-- Results Screen -->
  <div id="results-screen" class="screen hidden">...</div>

  <!-- Punishment Screen -->
  <div id="punishment-screen" class="screen hidden">...</div>
</div>

<!-- Special Effects -->
<div class="fireworks" id="fireworks"></div>
<div id="notification" class="notification">...</div>
```

### Important IDs and Classes:

| Element        | ID/Class             | Purpose                           |
| -------------- | -------------------- | --------------------------------- |
| Game container | `.game-container`    | Main wrapper for all game content |
| Screens        | `.screen`            | Base class for all game screens   |
|                | `.hidden`            | Hides inactive screens            |
| Setup          | `#setup-screen`      | Game configuration screen         |
|                | `#player-count`      | Dropdown for number of players    |
|                | `#player-inputs`     | Container for player name inputs  |
| Guessing       | `#guessing-screen`   | Where players input guesses       |
|                | `#guess-input`       | Input field for number guesses    |
| Results        | `#results-screen`    | Shows round results               |
|                | `#target-value`      | Displays the target number        |
| Punishment     | `#punishment-screen` | Displays punishments              |
|                | `#punishment-type`   | Shows "TRUTH" or "DARE"           |
|                | `#punishment-text`   | The actual punishment text        |

## 3. CSS Design System <a name="css-design-system"></a>

The game uses CSS variables for consistent theming:

### Color Variables:

```css
:root {
  --primary: #8a2be2; /* Purple - main accent color */
  --secondary: #4b0082; /* Dark purple - secondary color */
  --accent: #ff6b6b; /* Coral - highlight color */
  --background: #1a1a2e; /* Dark blue - main background */
  --card-bg: #16213e; /* Slightly lighter blue - card backgrounds */
  --text: #e6e6e6; /* Light gray - text color */
  --success: #4ade80; /* Green - for winners */
  --warning: #f59e0b; /* Orange - warnings */
  --danger: #ef4444; /* Red - for losers */
}
```

### Key Design Features:

1. **Gradient Background**: Creates a cosmic feel
   ```css
   background: linear-gradient(135deg, var(--background), #0f3460);
   ```
2. **Card-Based UI**: Player cards and screens use card styling
   ```css
   .player-card {
     background: var(--card-bg);
     border-radius: 15px;
     padding: 20px;
     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
   }
   ```
3. **Visual States**: (in the #results-screen)

   - Active player: `player-card.active` (gold border)
   - Winner: `player-card.winner` (green border)
   - Loser: `player-card.loser` (red border)

4. **Text Gradients**: Used in headers for visual interest (in the #setup-screen)
   ```css
   h1 {
     background: linear-gradient(45deg, var(--accent), var(--primary));
     -webkit-background-clip: text;
     background-clip: text;
     color: transparent;
   }
   ```

## 4. JavaScript Game Logic <a name="javascript-game-logic"></a>

The game state is managed in a central object:

### Game State Structure:

```javascript
const gameState = {
  players: [],          // Array of player names
  currentRound: 1,      // Current round number
  totalRounds: 5,       // Total rounds to play
  min: 0,               // Minimum guess value
  max: 100,             // Maximum guess value
  target: null,         // Target number for current round
  guesses: {},          // {player: guess} mapping
  prompts: {            // Truth and dare questions
    truth: ["What's your most embarrassing moment?", ...],
    dare: ["Do 10 pushups right now", ...]
  },
  strikes: {},          // {player: strikeCount} tracking
  currentPlayer: 0      // Index of current player
};
```

### Key Game Mechanics:

1. **Player Setup**:

   - Dynamically generate input fields based on selected player count
   - Validate all players have names before starting

2. **Round Progression**:

   - Each round has a new random target number
   - Players take turns guessing numbers
   - After all guesses, results are calculated

3. **Result Calculation**:

   - Find player closest to target (winner)
   - Find player farthest from target (loser)
   - If multiple players are farthest, randomly select one

4. **Punishment System**:
   - Loser gets either truth or dare
   - After 3 strikes, player always gets a dare
   - Punishments are randomly selected from the prompts list

## 5. Game Flow <a name="game-flow"></a>

The game follows this sequence:

1. **Setup Phase**:

   - Configure number of players
   - Enter player names
   - Set number of rounds
   - Add custom truth/dare prompts
   - Click "Start Game"

2. **Guessing Phase**:

   - Players take turns guessing a number between 0-100
   - Interface shows who has guessed and who hasn't
   - Submit guesses one by one

3. **Results Phase**:

   - Target number is revealed with fireworks
   - All guesses are shown with differences
   - Winners and losers are highlighted
   - Click "Continue" to see punishment

4. **Punishment Phase**:

   - Loser is revealed
   - Punishment type (truth/dare) is shown
   - Specific punishment text is displayed
   - Strike count is shown for the loser
   - Click "Next Round" to continue

5. **Game Completion**:
   - After all rounds, game over screen appears
   - Confetti celebration
   - Option to play again

## 6. Special Effects <a name="special-effects"></a>

The game includes two visual effects systems:

### 1. Fireworks

- Displayed when revealing the winner & the random target Number
- Created dynamically with JavaScript: [DOM MANIPULATION]

```javascript
function createFireworks() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const firework = document.createElement("div");
      firework.classList.add("firework");
      // Set random position and color
      // Add to fireworks container
    }, i * 50);
  }
}
```

### 2. Confetti

- Displayed at game completion
- Animated falling effect:

```javascript
function createConfetti() {
  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      // Set random position and color
      // Animate falling with Web Animations API
    }, i * 100);
  }
}
```

## 7. Responsive Design <a name="responsive-design"></a>

The game works on all device sizes with these features:

### Mobile Optimization:

```css
@media (max-width: 768px) {
  /* Adjust padding and font sizes */
}

@media (orientation: portrait) {
  /* Rotate game container for better mobile experience */
  .game-container {
    transform: rotate(90deg);
    transform-origin: left top;
    width: 100vh;
    height: 100vw;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
```

### Flexible Layouts:

- Grid-based player containers:
  ```css
  .players-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  ```
- Flexbox for action buttons:
  ```css
  .action-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  ```

## 8. Key Functions Explained <a name="key-functions-explained"></a>

### 1. `generatePlayerInputs()`

- Creates input fields for player names
- Number of fields based on selected player count
- Uses DOM manipulation to build HTML

### 2. `startGame()`

- Validates player names
- Initializes game state
- Starts first round
- Transitions to guessing screen

### 3. `submitGuess()`

- Validates input is a number in range
- Saves guess to game state
- Moves to next player or shows results

### 4. `calculateResults()`

- Compares all guesses to target
- Finds closest and farthest guesses
- Returns winners and loser

### 5. `assignPunishment(loser)`

- Increments strike count for loser
- Chooses punishment type based on strikes
- Selects random prompt from appropriate list

### 6. `nextRound()`

- Resets guesses
- Increments round counter
- Generates new target number
- Returns to guessing screen

### 7. `showNotification(message)`

- Displays temporary message in top-right
- Uses CSS transitions for smooth appearance
- Automatically disappears after 3 seconds

## 9. Customization Guide <a name="customization-guide"></a>

### Easy Customizations:

1. **Change Colors**: Modify the CSS variables in `:root`
2. **Add Prompts**: Edit the default prompts in `gameState.prompts`
3. **Adjust Difficulty**: Change `min` and `max` values in gameState
4. **Modify Strikes**: Change the strike threshold in `assignPunishment()`

### Adding New Features:

1. **Custom Punishments**:

   - Add new categories beyond truth/dare
   - Create new prompt lists in gameState
   - Modify punishment assignment logic

2. **Power-ups**:

   - Add special abilities players can earn
   - Implement in `submitGuess()` or results calculation

3. **Themes**:

   - Create theme selector in setup screen
   - Dynamically change CSS variables based on selection

4. **Sound Effects**:
   - Add audio elements for key events
   - Play sounds on guess submission, results, etc.

This comprehensive guide should help you understand every aspect of the Chaos Truth & Dare game. The code is organized to be readable and modifiable, with clear separation between HTML structure, CSS styling, and JavaScript logic.

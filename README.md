# Laser Party 🎮

A high-stakes grid-based survival game built with Phaser 3. Navigate an 8×8 grid, select safe cells, and avoid randomly placed lasers to survive each round. Watch your multiplier grow with each successful evasion!
Vercel link : https://laserpart.vercel.app?_vercel_share=qKFRXcq588lKoElB34qzmVXwd9kaK2fF

Git repo: https://github.com/yraval112/LaserParty.git

## 🎮 Game Overview

**Laser Party** is an intense web-based game where strategy meets luck. Each round, a laser fires across a random row or column. If your selected cell is in that laser's path, you lose everything. Survive, and your winnings multiply!

### How to Play

1. **Place Your Bet** - Set your wager amount using the +/- buttons (default: $10)
2. **Select a Safe Cell** - Click any cell on the 8×8 grid (think you can avoid the laser?)
3. **Face the Laser** - A laser fires at a random row or column
4. **Survive or Lose** - If your cell is hit, game over. Survive and the grid shrinks.
5. **Multiply Your Winnings** - Each survival increases your multiplier (1.06x → 95.9x maximum)
6. **Cash Out or Risk It** - Withdraw your winnings anytime, or go for the jackpot

## ✨ Features

- **Dynamic Grid** - 8×8 grid that shrinks as you survive, increasing difficulty
- **Progressive Multipliers** - 18 escalating multiplier tiers (1.06x to 95.9x)
- **Real-time UI** - Live updates of current round, multiplier, and winnings
- **Sound Effects** - Immersive audio feedback for laser warnings and game events
- **State Management** - Robust game state tracking (IDLE → PLAYING → LOCKED → ENDED)
- **Responsive Design** - Works on desktop with full visual feedback
- **Unit Tests** - Comprehensive test suite for game logic validation

## 🏗️ Architecture

The codebase follows a **modular manager pattern** for clean separation of concerns:

### Core Components

- **GameManager** (`src/Managers/GameManager.js`)
  - Main game logic and state management
  - Handles game flow: start, select, laser, win/lose
  - Coordinates between UI and sound managers
  - Manages grid, multipliers, and player selections

- **UIManager** (`src/Managers/UIManager.js`)
  - All visual UI elements and animations
  - Top panel: round counter, multiplier display, current winnings
  - Bottom panel: bet controls, cash out button
  - Game state messages (start, win, lose, cash out screens)
  - Animated transitions and visual feedback

- **SoundManager** (`src/Managers/SoundManager.js`)
  - Audio asset preloading during game initialization
  - Sound effect playback with volume control
  - Master, SFX, and music volume controls
  - Event-triggered audio (laser fire, survival, win, lose)

### Game Engine

- **LaserGameEngine** (`src/Core/LaserGameEngine.js`)
  - Pure game logic (no graphics/UI)
  - State machine: IDLE, PLAYING, LOCKED, ENDED
  - Laser generation and hit detection
  - Grid management and survivor evaluation
  - Multiplier and winnings calculation

- **GridModel** (`src/Core/GridModel.js`)
  - Grid state tracking (rows × columns)
  - Cell removal logic after survival
  - 1×1 detection for win conditions

- **MultiplierTable** (`src/Core/MultiplierTable.js`)
  - Hardcoded multiplier progression
  - Lookup by survived rounds count

## 📁 Project Structure

```
LaserParty/
├── src/
│   ├── main.js                 # Game entry point
│   ├── style.css               # Global styling
│   ├── Core/
│   │   ├── GridModel.js
│   │   ├── LaserGameEngine.js
│   │   └── MultiplierTable.js
│   ├── Managers/
│   │   ├── GameManager.js
│   │   ├── UIManager.js
│   │   └── SoundManager.js
│   ├── Scene/
│   │   ├── BootScene.js
│   │   └── GameScene.js
│   └── Tests/
│       └── LaserGameEngine.test.js
├── public/
│   └── GameSound/
│       └── Laser.wav
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone or navigate to project directory
cd LaserParty

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Running the Game

After `npm run dev`, open your browser to `http://localhost:5174`

## 🧪 Testing

The project includes unit tests for game logic using **Vitest**:

```bash
npm run test
```

### Current Test Coverage

- State transitions (IDLE → PLAYING)
- Laser hit detection and loss condition
- Grid reduction and win condition (1×1)
- Multiplier progression
- Winnings calculation

## 🎯 Game Mechanics

### State Machine

```
IDLE → PLAYING → LOCKED → ENDED
  ↓              ↑
  └──────────────┘ (on restart)
```

- **IDLE**: Initial state, awaiting game start
- **PLAYING**: Player can select cells
- **LOCKED**: Laser firing animation in progress
- **ENDED**: Game over (win/lose), ready for restart

### Laser Logic

1. Select a cell on the grid
2. A random laser fires at a row or column
3. Hit detection checks: `(isRow && selectedRow === laserRow) || (!isRow && selectedCol === laserCol)`
4. **Hit** → Loss, game ends
5. **Survival** → Grid shrinks (remove hit row/column), multiplier increases, ready for next round
6. **1×1 Reached** → Victory! Player wins accumulated winnings

### Multiplier Progression

Each survived round increases your multiplier:

| Rounds | Multiplier | Rounds | Multiplier |
| ------ | ---------- | ------ | ---------- |
| 0-2    | 1.06-1.33  | 10-12  | 4.79-7.99  |
| 3-5    | 1.50-1.95  | 13-15  | 10.6-15.9  |
| 6-9    | 2.28-3.83  | 16-17  | 23.9-47.9  |

## 🔊 Audio

Audio files are located in `public/GameSound/`:

- `Laser.wav` - Laser firing sound effect

Additional sound effects can be added by placing `.wav` or `.mp3` files in the `public/GameSound/` directory and registering them in `SoundManager.preload()`.

## 🛠️ Tech Stack

- **Phaser 3.x** - Game framework
- **Vite** - Bundler & dev server
- **Vitest** - Unit testing framework
- **Vanilla JavaScript** - ES6 modules

## 📝 Development Notes

### Adding New Features

1. **Game Logic** - Modify `LaserGameEngine.js` or relevant Core classes
2. **UI/Visual** - Update `UIManager.js` with new graphics/animations
3. **Audio** - Add audio files to `public/GameSound/` and register in `SoundManager.preload()`
4. **Game Flow** - Coordinate changes in `GameManager.js`

### Code Quality

- Each manager has a single responsibility
- Callbacks connect managers without tight coupling
- Pure game logic separated from rendering/audio
- Comprehensive test coverage for game engine

## 📄 License

Open source - modify and distribute freely.

---

**Framework:** Phaser 3  
**Last Updated:** February 2026

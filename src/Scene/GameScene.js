import Phaser from "phaser"
import LaserGameEngine from "../Core/LaserGameEngine"

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene")
  }

  create() {
    this.engine = new LaserGameEngine(6, 10)

    this.cellSize = 60
    this.createGrid()

    this.infoText = this.add.text(10, 10, "", {
      fontSize: "20px",
      color: "#ffffff"
    })

    this.updateUI()
  }

  createGrid() {
    this.cells = []

    for (let r = 0; r < this.engine.grid.rows; r++) {
      this.cells[r] = []

      for (let c = 0; c < this.engine.grid.cols; c++) {
        const cell = this.add.rectangle(
          200 + c * this.cellSize,
          100 + r * this.cellSize,
          this.cellSize - 4,
          this.cellSize - 4,
          0x000000
        ).setOrigin(0)

        cell.setStrokeStyle(2, 0x00ff00)
        cell.setInteractive()

        cell.on("pointerdown", () => {
          this.handleClick(r, c)
        })

        this.cells[r][c] = cell
      }
    }
  }

  handleClick(row, col) {
    if (this.engine.state === "IDLE") {
      this.engine.start()
    }

    this.engine.select(row, col)

    const laser = this.engine.generateLaser()
    if (!laser) return

    const result = this.engine.resolveLaser(
      laser.isRow,
      laser.index
    )

    console.log(result)

    this.updateUI()
  }

  updateUI() {
    this.infoText.setText(
      `State: ${this.engine.state}
Rounds: ${this.engine.survivedRounds}
Multiplier: ${this.engine.getMultiplier().toFixed(2)}x
Winnings: $${this.engine.getWinnings().toFixed(2)}`
    )
  }
}

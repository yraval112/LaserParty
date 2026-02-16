import GridModel from "./GridModel.js"
import MultiplierTable from "./MultiplierTable.js"

export default class LaserGameEngine {
  constructor(gridSize = 8, betAmount = 10) {
    this.betAmount = betAmount

    this.grid = new GridModel(gridSize)
    this.multiplierTable = new MultiplierTable()

    this.reset()
  }

  reset() {
    this.grid.reset()
    this.state = "IDLE"
    this.survivedRounds = 0
    this.selected = null
  }

  start() {
    if (this.state === "IDLE") {
      this.state = "PLAYING"
    }
  }

  select(row, col) {
    if (this.state !== "PLAYING") return
    this.selected = { row, col }
  }

  generateLaser() {
    if (this.state !== "PLAYING") return null

    this.state = "LOCKED"

    if (this.grid.isOneByOne()) {
      return { type: "WIN" }
    }

    let isRow

    if (this.grid.rows === 1) {
      isRow = false
    } else if (this.grid.cols === 1) {
      isRow = true
    } else {
      isRow = Math.random() < 0.5
    }

    const index = isRow
      ? Math.floor(Math.random() * this.grid.rows)
      : Math.floor(Math.random() * this.grid.cols)

    return { isRow, index }
  }

  resolveLaser(isRow, index) {
    if (!this.selected) return { result: "INVALID" }

    const hit =
      (isRow && this.selected.row === index) ||
      (!isRow && this.selected.col === index)

    if (hit) {
      this.state = "ENDED"
      return { result: "LOSE" }
    }

    // survived
    this.survivedRounds++

    if (isRow) {
      this.grid.removeRow()
    } else {
      this.grid.removeColumn()
    }

    this.selected = null
    this.state = "PLAYING"

    if (this.grid.isOneByOne()) {
      this.state = "ENDED"
      return { result: "WIN" }
    }

    return { result: "SURVIVED" }
  }

  getMultiplier() {
    return this.multiplierTable.getMultiplier(this.survivedRounds)
  }

  getWinnings() {
    return this.betAmount * this.getMultiplier()
  }
}

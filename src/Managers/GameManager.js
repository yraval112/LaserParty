import Phaser from 'phaser'
import UIManager from './UIManager.js'
import SoundManager from '../Core/SoundManager.js'

export default class GameManager extends Phaser.Scene {
  constructor() {
    super('GameScene')

    this.gridSize = 8
    this.cellSize = 60

    this.state = 'IDLE' // IDLE, PLAYING, LOCKED, ENDED, CASHED_OUT
    this.cells = []
    this.selectedPosition = null
    this.currentLaser = null
    this.survivedRounds = 0
    this.betAmount = 10
    this.currentMultiplier = 1.0
    
    this.multipliers = [
      1.06, 1.18, 1.33, 1.50, 1.71, 1.95, 2.28, 2.66, 3.19, 3.83,
      4.79, 5.99, 7.99, 10.6, 15.9, 23.9, 47.9, 95.9
    ]

    this.ui = null
  }
preload() {
    SoundManager.preload(this)
  }
  create() {
    this.gameWidth = this.cameras.main.width
    this.gameHeight = this.cameras.main.height
    
    this.state = 'IDLE'
    this.survivedRounds = 0
    this.currentMultiplier = 1.0
    this.selectedPosition = null
    this.currentLaser = null
    
    this.soundManager = new SoundManager(this)
    this.soundManager.create()
    this.ui = new UIManager(this)
    this.ui.createAll(
      this.betAmount,
      (bet) => this.onBetChanged(bet),
      () => this.cashOut()
    )
    
    this.createGrid(this.gridSize)
    this.showStartScreen()
  }

  /* =========================
        CENTER CALCULATION
  ========================== */

  getCenterOffset() {
    const rows = this.cells.length || this.gridSize
    const cols = (this.cells[0] && this.cells[0].length) || this.gridSize
    
    const gridWidth = cols * this.cellSize
    const gridHeight = rows * this.cellSize
    
    return {
      x: (this.gameWidth - gridWidth) / 2+25,
      y: (this.gameHeight - gridHeight) / 2
    }
  }

  /* =========================
        CALLBACK METHODS
  ========================== */

  onBetChanged(amount) {
    if (this.state === 'IDLE') {
      this.betAmount = amount
      this.ui.messageText.setText('Click any tile to START\nBet: $' + amount)
    }
  }

  showStartScreen() {
    this.ui.showStartScreen(this.betAmount)
  }

  updateUI() {
    this.ui.updateGameInfo(this.survivedRounds, this.currentMultiplier, this.betAmount)
  }

  /* =========================
        MULTIPLIER CALCULATION
  ========================== */

  getMultiplier() {
    if (this.survivedRounds === 0) return 1.0
    const index = Math.min(this.survivedRounds - 1, this.multipliers.length - 1)
    return this.multipliers[index]
  }

  /* =========================
        CASH OUT
  ========================== */

  cashOut() {
    if (this.state !== 'PLAYING') return
    
    this.state = 'CASHED_OUT'
    const winnings = (this.betAmount * this.currentMultiplier).toFixed(2)
    
    this.ui.hideCashOut()
    this.ui.showCashOutMessage(winnings, this.currentMultiplier.toFixed(2))
    
    this.input.once('pointerdown', () => this.restartGame())
  }

  restartGame() {
    this.scene.restart()
  }

  /* =========================
        GRID CREATION
  ========================== */

  createGrid(size) {
    this.cells = []
    const offset = this.getCenterOffset()

    for (let r = 0; r < size; r++) {
      this.cells[r] = []

      for (let c = 0; c < size; c++) {
        const x = offset.x + c * this.cellSize
        const y = offset.y + r * this.cellSize

        const cell = this.add.rectangle(
          x,
          y,
          this.cellSize - 4,
          this.cellSize - 4,
          0x0a0a1a
        )

        cell.setStrokeStyle(2, 0x00ff00)
        cell.setInteractive()

        cell.on('pointerdown', () => {
          const pos = this.getCellPosition(cell)
          if (pos) {
            this.handlePlayerClick(pos.row, pos.col)
          }
        })

        cell.on('pointerover', () => {
          if (this.state === 'PLAYING' || this.state === 'IDLE') {
            cell.setFillStyle(0x1a1a3a)
            cell.setStrokeStyle(3, 0x00ffff)
          }
        })

        cell.on('pointerout', () => {
          if (this.state === 'PLAYING' || this.state === 'IDLE') {
            const pos = this.getCellPosition(cell)
            if (pos && this.selectedPosition && 
                pos.row === this.selectedPosition.row && 
                pos.col === this.selectedPosition.col) {
              cell.setFillStyle(0xffff00, 0.3)
              cell.setStrokeStyle(4, 0xffff00)
            } else {
              cell.setFillStyle(0x0a0a1a)
              cell.setStrokeStyle(2, 0x00ff00)
            }
          }
        })

        this.cells[r][c] = cell
      }
    }
  }

  /* =========================
        SAFE POSITION FINDER
  ========================== */

  getCellPosition(cell) {
    for (let r = 0; r < this.cells.length; r++) {
      for (let c = 0; c < this.cells[r].length; c++) {
        if (this.cells[r][c] === cell) {
          return { row: r, col: c }
        }
      }
    }
    return null
  }

  /* =========================
        PLAYER CLICK
  ========================== */

  handlePlayerClick(row, col) {
    if (this.state === 'ENDED' || this.state === 'CASHED_OUT') {
      this.restartGame()
      return
    }
    
    if (this.state === 'IDLE') {
      this.state = 'PLAYING'
      this.ui.clearMessage()
      this.ui.hideTitle()
      this.ui.showCashOut()
      this.ui.disableBetControls()
    }
    
    if (this.state !== 'PLAYING') return

    this.selectCell(row, col)
    this.currentMultiplier = this.getMultiplier()
    this.updateUI()
    this.startLaserSequence()
  }

  selectCell(row, col) {
    this.clearHighlight()

    if (!this.cells[row] || !this.cells[row][col]) return

    this.selectedPosition = { row, col }
    this.cells[row][col].setFillStyle(0xffff00, 0.3)
    this.cells[row][col].setStrokeStyle(4, 0xffff00)
  }

  clearHighlight() {
    if (!this.selectedPosition) return

    const { row, col } = this.selectedPosition

    if (this.cells[row] && this.cells[row][col]) {
      this.cells[row][col].setFillStyle(0x0a0a1a)
      this.cells[row][col].setStrokeStyle(2, 0x00ff00)
    }
  }

  /* =========================
        LASER SYSTEM
  ========================== */

  startLaserSequence() {
    this.state = 'LOCKED'

    const totalRows = this.cells.length
    const totalCols = this.cells[0].length

    if (totalRows === 1 && totalCols === 1) {
      this.gameOver(true)
      return
    }

    let isRow

    if (totalRows === 1) {
      isRow = false
    } else if (totalCols === 1) {
      isRow = true
    } else {
      isRow = Phaser.Math.Between(0, 1) === 0
    }

    const index = isRow
      ? Phaser.Math.Between(0, totalRows - 1)
      : Phaser.Math.Between(0, totalCols - 1)

    this.currentLaser = { isRow, index }

    this.showLaserWarning(isRow, index)

    this.time.delayedCall(900, () => {
      this.fireLaser()
    })
  }

  showLaserWarning(isRow, index) {
    const width = this.cells[0].length * this.cellSize
    const height = this.cells.length * this.cellSize
    const offset = this.getCenterOffset()

    if (isRow) {
      const y = offset.y + index * this.cellSize

      this.laserLine = this.add.rectangle(
        offset.x + width / 2 - this.cellSize / 2,
        y,
        width,
        this.cellSize - 4,
        0xff0000,
        0.4
      )
    } else {
      const x = offset.x + index * this.cellSize

      this.laserLine = this.add.rectangle(
        x,
        offset.y + height / 2 - this.cellSize / 2,
        this.cellSize - 4,
        height,
        0xff0000,
        0.4
      )
    }

    this.tweens.add({
      targets: this.laserLine,
      alpha: 0.9,
      yoyo: true,
      repeat: 3,
      duration: 150
    })
  }

  fireLaser() {
    const { isRow, index } = this.currentLaser
     this.soundManager.playSFX('laser', {
      rate: Phaser.Math.FloatBetween(0.95, 1.05)
    })
    this.cameras.main.flash(200, 255, 0, 0)
    this.cameras.main.shake(200, 0.01)

    if (this.laserLine) this.laserLine.destroy()

    if (
      this.selectedPosition &&
      (
        (isRow && this.selectedPosition.row === index) ||
        (!isRow && this.selectedPosition.col === index)
      )
    ) {
      this.gameOver(false)
      return
    }

    this.survivedRounds++

    if (isRow) {
      this.removeRow(index)
    } else {
      this.removeColumn(index)
    }

    this.time.delayedCall(400, () => {
      this.checkWinCondition()
      this.selectedPosition = null
      this.state = 'PLAYING'
      this.updateUI()
    })
  }

  /* =========================
        REMOVE ROW
  ========================== */

  removeRow(row) {
    if (!this.cells[row]) return

    const rowCells = this.cells[row]

    rowCells.forEach(cell => {
      this.tweens.add({
        targets: cell,
        scale: 0,
        alpha: 0,
        duration: 300
      })
    })

    this.time.delayedCall(320, () => {
      rowCells.forEach(cell => cell.destroy())
      this.cells.splice(row, 1)
      this.repositionGrid()
    })
  }

  /* =========================
        REMOVE COLUMN
  ========================== */

  removeColumn(col) {
    for (let r = 0; r < this.cells.length; r++) {
      if (!this.cells[r][col]) continue

      this.tweens.add({
        targets: this.cells[r][col],
        scale: 0,
        alpha: 0,
        duration: 300
      })
    }

    this.time.delayedCall(320, () => {
      for (let r = 0; r < this.cells.length; r++) {
        if (this.cells[r][col]) {
          this.cells[r][col].destroy()
          this.cells[r].splice(col, 1)
        }
      }

      this.repositionGrid()
    })
  }

  /* =========================
        GRID REPOSITION
  ========================== */

  repositionGrid() {
    const offset = this.getCenterOffset()
    
    for (let r = 0; r < this.cells.length; r++) {
      for (let c = 0; c < this.cells[r].length; c++) {
        const x = offset.x + c * this.cellSize
        const y = offset.y + r * this.cellSize

        this.tweens.add({
          targets: this.cells[r][c],
          x,
          y,
          duration: 200
        })
      }
    }
  }

  /* =========================
        WIN CHECK
  ========================== */

  checkWinCondition() {
    if (
      this.cells.length === 1 &&
      this.cells[0].length === 1
    ) {
      this.gameOver(true)
    }
  }

  /* =========================
        GAME OVER
  ========================== */

  gameOver(won) {
    this.state = 'ENDED'
    
    this.ui.hideCashOut()

    if (won) {
      this.soundManager.playSFX('win')
      const winnings = (this.betAmount * this.currentMultiplier).toFixed(2)
      this.ui.showWinMessage(winnings, this.currentMultiplier.toFixed(2), this.survivedRounds)
    } else {
      this.soundManager.playSFX('lose')
      this.ui.showLoseMessage(this.betAmount, this.survivedRounds, this.currentMultiplier.toFixed(2))
    }
    
    this.input.once('pointerdown', () => this.restartGame())
  }
}

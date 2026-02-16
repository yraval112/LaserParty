export default class UIManager {
  constructor(scene) {
    this.scene = scene
    this.gameWidth = scene.cameras.main.width
    this.gameHeight = scene.cameras.main.height
    
    this.roundValueText = null
    this.multiplierText = null
    this.winningsText = null
    this.messageText = null
    this.betText = null
    this.cashOutButton = null
    this.cashOutText = null
    this.decreaseBetButton = null
    this.increaseBetButton = null
    this.titleText = null
  }

  /* =========================
        INITIALIZATION
  ========================== */

  createAll(betAmount, onBetChange, onCashOut) {
    this.betAmount = betAmount
    this.onBetChange = onBetChange
    this.onCashOut = onCashOut
    
    this.createBackground()
    this.createTopPanel()
    this.createBottomPanel()
  }

  /* =========================
        BACKGROUND
  ========================== */

  createBackground() {
    this.scene.add.rectangle(
      this.gameWidth / 2, 
      this.gameHeight / 2, 
      this.gameWidth, 
      this.gameHeight, 
      0x0f0f2a
    )
    
    // Add subtle animated circles for visual interest
    for (let i = 0; i < 10; i++) {
      const circle = this.scene.add.circle(
        Phaser.Math.Between(0, this.gameWidth),
        Phaser.Math.Between(0, this.gameHeight),
        Phaser.Math.Between(2, 5),
        0x00ff00,
        0.1
      )
      
      this.scene.tweens.add({
        targets: circle,
        alpha: 0.3,
        y: circle.y - Phaser.Math.Between(100, 300),
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      })
    }
  }

  /* =========================
        TOP PANEL
  ========================== */

  createTopPanel() {
    const centerX = this.gameWidth / 2
    
    this.scene.add.rectangle(centerX, 40, this.gameWidth, 80, 0x1a1a2e, 0.9).setDepth(5)
    
    this.scene.add.text(20, 20, 'ROUND', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setDepth(6)
    
    this.roundValueText = this.scene.add.text(20, 40, '0', {
      fontSize: '28px',
      color: '#ffff00',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setDepth(6)

    this.scene.add.text(centerX, 20, 'MULTIPLIER', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5).setDepth(6)
    
    this.multiplierText = this.scene.add.text(centerX, 45, '1.00x', {
      fontSize: '32px',
      color: '#00ff00',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(6)

    this.scene.add.text(this.gameWidth - 20, 20, 'WINNINGS', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(1, 0).setDepth(6)
    
    this.winningsText = this.scene.add.text(this.gameWidth - 20, 40, '$0.00', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(1, 0).setDepth(6)

    const centerY = this.gameHeight / 2
    this.messageText = this.scene.add.text(centerX, centerY, '', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100)
  }

  /* =========================
        BOTTOM PANEL
  ========================== */

  createBottomPanel() {
    const centerX = this.gameWidth / 2
    
    this.scene.add.rectangle(centerX, this.gameHeight - 60, this.gameWidth, 120, 0x1a1a2e, 0.9).setDepth(5)

    this.betText = this.scene.add.text(centerX, this.gameHeight - 90, '$' + this.betAmount.toFixed(2), {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(6)

    this.scene.add.text(centerX, this.gameHeight - 110, 'BET AMOUNT', {
      fontSize: '12px',
      color: '#888888',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(6)

    this.createBetControls()
    
    this.createCashOutButton()
  }

  /* =========================
        BET CONTROLS
  ========================== */

  createBetControls() {
    const centerX = this.gameWidth / 2
    const y = this.gameHeight - 90
    
    this.decreaseBetButton = this.scene.add.rectangle(centerX - 120, y, 50, 40, 0x444444)
      .setInteractive()
      .setDepth(6)
    
    this.scene.add.text(centerX - 120, y, '−', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(7)

    this.decreaseBetButton.on('pointerdown', () => this.changeBet(-5))
    this.decreaseBetButton.on('pointerover', () => this.decreaseBetButton.setFillStyle(0x555555))
    this.decreaseBetButton.on('pointerout', () => this.decreaseBetButton.setFillStyle(0x444444))

    this.increaseBetButton = this.scene.add.rectangle(centerX + 120, y, 50, 40, 0x444444)
      .setInteractive()
      .setDepth(6)
    
    this.scene.add.text(centerX + 120, y, '+', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(7)

    this.increaseBetButton.on('pointerdown', () => this.changeBet(5))
    this.increaseBetButton.on('pointerover', () => this.increaseBetButton.setFillStyle(0x555555))
    this.increaseBetButton.on('pointerout', () => this.increaseBetButton.setFillStyle(0x444444))
  }

  /* =========================
        CASH OUT BUTTON
  ========================== */

  createCashOutButton() {
    const centerX = this.gameWidth / 2
    
    this.cashOutButton = this.scene.add.rectangle(centerX, this.gameHeight - 40, 200, 50, 0x00aa00)
      .setInteractive()
      .setVisible(false)
      .setDepth(10)
    
    this.cashOutText = this.scene.add.text(centerX, this.gameHeight - 40, 'CASH OUT', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false).setDepth(11)

    this.cashOutButton.on('pointerdown', () => {
      if (this.onCashOut) this.onCashOut()
    })
    
    this.cashOutButton.on('pointerover', () => {
      this.cashOutButton.setFillStyle(0x00ff00)
      this.cashOutButton.setScale(1.05)
    })
    
    this.cashOutButton.on('pointerout', () => {
      this.cashOutButton.setFillStyle(0x00aa00)
      this.cashOutButton.setScale(1)
    })
  }

  /* =========================
        BET AMOUNT
  ========================== */

  changeBet(amount) {
    this.betAmount += amount
    
    if (this.betAmount < 5) this.betAmount = 5
    if (this.betAmount > 500) this.betAmount = 500
    
    this.betText.setText('$' + this.betAmount.toFixed(2))
    
    if (this.onBetChange) {
      this.onBetChange(this.betAmount)
    }
  }

  getBetAmount() {
    return this.betAmount
  }

  /* =========================
        UPDATE UI
  ========================== */

  updateGameInfo(rounds, multiplier, betAmount) {
    this.roundValueText.setText(rounds.toString())
    this.multiplierText.setText(multiplier.toFixed(2) + 'x')
    const winnings = (betAmount * multiplier).toFixed(2)
    this.winningsText.setText('$' + winnings)
  }

  /* =========================
        START SCREEN
  ========================== */

  showStartScreen(betAmount) {
    this.betAmount = betAmount
    
    this.messageText.setScale(1)
    this.messageText.setAlpha(1)
    this.messageText.setColor('#ffffff')
    this.messageText.setFontSize('28px')
    
    this.titleText = this.scene.add.text(
      this.gameWidth / 2, 
      this.gameHeight /2-400 , 
      '⚡ LASER PARTY ⚡', 
      {
        fontSize: '48px',
        color: '#00ff00',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(101)
    
    this.scene.tweens.add({
      targets: this.titleText,
      scale: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    this.messageText.setText(
      'Click any tile to START\n\nBet: $' + betAmount + '\n\nSurvive the lasers!\nCash out before you die!'
    )
    
    this.enableBetControls()
  }

  hideTitle() {
    if (this.titleText) {
      this.scene.tweens.killTweensOf(this.titleText)
      this.titleText.destroy()
      this.titleText = null
    }
  }

  clearMessage() {
    this.messageText.setText('')
  }

  /* =========================
        CASH OUT DISPLAY
  ========================== */

  showCashOut() {
    this.cashOutButton.setVisible(true)
    this.cashOutText.setVisible(true)
  }

  hideCashOut() {
    this.cashOutButton.setVisible(false)
    this.cashOutText.setVisible(false)
  }

  /* =========================
        BET CONTROLS STATE
  ========================== */

  disableBetControls() {
    this.decreaseBetButton.setFillStyle(0x222222).disableInteractive()
    this.increaseBetButton.setFillStyle(0x222222).disableInteractive()
  }

  enableBetControls() {
    this.decreaseBetButton.setFillStyle(0x444444).setInteractive()
    this.increaseBetButton.setFillStyle(0x444444).setInteractive()
  }

  /* =========================
        GAME MESSAGES
  ========================== */

  showCashOutMessage(winnings, multiplier) {
    this.messageText.setColor('#00ff00')
    this.messageText.setFontSize('36px')
    this.messageText.setText(
      `💰 CASHED OUT! 💰\n\nYou won: $${winnings}\nMultiplier: ${multiplier}x\n\nClick to play again`
    )
    
    // Win animation
    this.scene.cameras.main.flash(500, 0, 255, 0, false)
    
    // Pulse effect on message
    this.scene.tweens.add({
      targets: this.messageText,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut'
    })
  }

  showWinMessage(winnings, multiplier, rounds) {
    this.messageText.setColor('#00ff00')
    this.messageText.setFontSize('36px')
    this.messageText.setText(
      `🎉 MAXIMUM WIN! 🎉\n\nYou won: $${winnings}\nMultiplier: ${multiplier}x\nRounds: ${rounds}\n\nClick to play again`
    )
    
    this.scene.cameras.main.flash(800, 0, 255, 0, false)
    
    // Victory pulse
    this.scene.tweens.add({
      targets: this.messageText,
      scale: 1.15,
      duration: 600,
      yoyo: true,
      repeat: 3,
      ease: 'Back.easeOut'
    })
  }

  showLoseMessage(betAmount, rounds, multiplier) {
    this.messageText.setColor('#ff0000')
    this.messageText.setFontSize('32px')
    this.messageText.setText(
      `💀 GAME OVER 💀\n\nYou lost: $${betAmount}\nRounds survived: ${rounds}\nMultiplier reached: ${multiplier}x\n\nClick to play again`
    )
    
    this.scene.cameras.main.shake(300, 0.02)
    
    // Death shake effect
    this.scene.tweens.add({
      targets: this.messageText,
      alpha: 0.5,
      duration: 200,
      yoyo: true,
      repeat: 2
    })
  }
}

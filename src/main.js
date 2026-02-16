import Phaser from 'phaser'
import GameManager from "./Managers/GameManager.js"

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 1080,
  backgroundColor: '#0f172a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [GameManager]
}

new Phaser.Game(config)
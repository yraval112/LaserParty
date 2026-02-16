export default class SoundManager {
  constructor(scene) {
    this.scene = scene
    this.sounds = {}
    this.music = null
  }
  static preload(scene) {
    scene.load.audio('laser', 'assets/sounds/LaserShoot.mp3')
    scene.load.audio('win', 'assets/sounds/Win.mp3')
    scene.load.audio('lose', 'assets/sounds/GameOver.mp3')
   
  }
   create() {
    this.sounds.laser = this.scene.sound.add('laser')
    this.sounds.win = this.scene.sound.add('win')
    this.sounds.lose = this.scene.sound.add('lose')
   }
   playSFX(key, config = {}) {
    this.scene.sound.play(key, {
      volume: 0.8,
      ...config
    })
  }
}
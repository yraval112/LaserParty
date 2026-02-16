export default class MultiplierTable {
  constructor() {
    this.table = [
      1.06, 1.18, 1.33, 1.50, 1.71, 1.95,
      2.28, 2.66, 3.19, 3.83,
      4.79, 5.99, 7.99, 10.6,
      15.9, 23.9, 47.9, 95.9
    ]
  }

  getMultiplier(rounds) {
    if (rounds <= 0) return 1.0

    const index = Math.min(rounds - 1, this.table.length - 1)
    return this.table[index]
  }
}
export default class GridModel {
  constructor(size) {
    this.initialSize = size
    this.reset()
  }

  reset() {
    this.rows = this.initialSize
    this.cols = this.initialSize
  }

  removeRow() {
    if (this.rows > 1) this.rows--
  }

  removeColumn() {
    if (this.cols > 1) this.cols--
  }

  isOneByOne() {
    return this.rows === 1 && this.cols === 1
  }
}

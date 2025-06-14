export default class Generator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = [];
  }

  generate() {
    for (let y = 0; y < this.height; y++) {
      this.map[y] = [];
      for (let x = 0; x < this.width; x++) {
        if (y === 0 || y === this.height - 1) {
          this.map[y][x] = '_';  // chão e teto
        } else if (x === 0 || x === this.width - 1) {
          this.map[y][x] = '|';  // paredes laterais
        } else {
          this.map[y][x] = ' ';  // vazio
        }
      }
    }
    return this.map;
  }

  toText() {
    return this.map.map(row => row.join(''));
  }
}

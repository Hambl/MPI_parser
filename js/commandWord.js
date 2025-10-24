export class CommandWord {
  #word = "";

  #units = {
    addr: "",
    transf: "",
    subaddr: "",
    numberDW: "",
  }

  constructor() {

  }
  
  get word() {
    return this.#word;
  }

  get units() {
    return this.#units;
  }

  get addr() {
    return this.#units.addr;
  }

  get transf() {
    return this.#units.transf;
  }

  get subaddr() {
    return this.#units.subaddr;
  }
  
  get numberDW() {
    return this.#units.numberDW;
  }

  #setUnits(addr, transf, subaddr, numberDW) {
    this.#units.addr = addr;
    this.#units.transf = transf;
    this.#units.subaddr = subaddr;
    this.#units.numberDW = numberDW;
  }

  parse(commandWordBinary) {
    this.#word = String(commandWordBinary);

    console.assert(this.#word.length == 16, "CommandWord class. КС для разбора должно быть 16 бит");

    this.#units.addr = this.#word.slice(0, 5);
    this.#units.transf = this.#word.slice(5, 6);
    this.#units.subaddr = this.#word.slice(6, 11);
    this.#units.numberDW = this.#word.slice(11, 16);
  }
  
  pack(addr, transf, subaddr, numberDW) {

    this.#setUnits(addr, transf, subaddr, numberDW);

    this.#word = "";

    for (const unit in this.#units) {
      this.#word += this.#units[unit];
    }

    console.assert(this.#word.length == 16, "CommandWord class. Собранное КС меньше 16 бит");

    return this.#word;
  }

}


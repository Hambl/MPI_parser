export class Formatter {

  constructor() {
    
  }

  static toSystem(number, fromNumeralSystem, toNumeralSystem) {
    if (fromNumeralSystem == toNumeralSystem) return number;
    else return parseInt(number, fromNumeralSystem).toString(toNumeralSystem);
  }

  static toBin(number, fromNumeralSystem, bits) {

    console.assert(number != "", "Formatter class. Невозможно преобразовать пустую переменную в бинарный вид");

    if(fromNumeralSystem == 2) return number.padStart(bits, "0");
    else {
      return parseInt(number, fromNumeralSystem).toString(2).padStart(bits, "0");
    }
  }

  static numBitsToDec(numBits) {
    let bits = "";
    for (let i = 0; i < numBits; i++) {
      bits += "1";
    }
    return Number(parseInt(bits, 2).toString(10));
  }
}
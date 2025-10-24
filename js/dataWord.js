import { Formatter } from "./formatter.js";

export class DataWord {
  
  #maskFormat = {
    var: "",
    pos: "",
  }

  #action = "";

  #varsArr = null;
  #bitsArr = null;

  constructor() {

  }

  set varsArr(varsArr) {
    this.#varsArr = varsArr;
  }

  set bitsArr(bitsArr) {
    this.#bitsArr = bitsArr;
  }

  setMaskFormat(varMask, posMask) {
    this.#maskFormat.var = varMask;
    this.#maskFormat.pos = posMask;
  }

  parse(varsArr = this.#varsArr, bitsArr = this.#bitsArr) {

    console.assert(varsArr.length == bitsArr.length, "Data Word. Массивы для распарски должны быть одинаковой размерности");

    this.#varsArr = varsArr;
    this.#bitsArr = bitsArr;
    this.#action = "parse";

    return this.#calcMask();
  }

  pack(varsArr = this.#varsArr, bitsArr = this.#bitsArr) {

    console.assert(varsArr.length == bitsArr.length, "Data Word. Массивы для упаковки должны быть одинаковой размерности");

    this.#varsArr = varsArr;
    this.#bitsArr = bitsArr;
    this.#action = "pack";

    return this.#calcMask();
  }

  #calcMask() {

    let posMask = 16;
    let varMask = "";
    let emptyCount = 0;
    let masksData = [];

    for (let i = 0; i < this.#varsArr.length; i++) {
      let varName = this.#varsArr[i];
      let varBits = Number(this.#bitsArr[i]);

      posMask -= varBits;
      
      if (/empty/i.test(varName)) {
        emptyCount++;
        continue;
      }

      if (this.#action == "parse") {
        varMask = 65535 & Formatter.numBitsToDec(varBits) << posMask;
      } 
      else if (this.#action == "pack"){
        varMask = Formatter.numBitsToDec(varBits);
      }

      varMask = "0x" + Formatter.toSystem(varMask, 10, 16).toUpperCase().padStart(4, "0");

      let varMaskFormat = this.#maskFormat.var.replace("[var]", `${varName}`)
                                              .replace("[msk]", `${varMask}`);
      let posMaskFormat = this.#maskFormat.pos.replace("[var]", `${varName}`)
                                              .replace("[msk]", `${posMask}`);

      masksData[`${i - emptyCount}`] = {
        var: varMaskFormat,
        pos: posMaskFormat
      }
    }

    return masksData;
  }
}
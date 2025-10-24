import { CommandWord } from "./commandWord.js";
import { Formatter } from "./formatter.js";
import { CommandParseValid } from "./valid/commandParseValid.js";
import { CommandPackValid } from "./valid/commandPackValid.js";

let commandWord = new CommandWord();

let commandWordInp = document.getElementById("commandWord");
let partsWordInps = document.querySelector("#packInputs").getElementsByTagName("input");

let numSys = {
  parse: Number(document.querySelector('input[name="parseNumeralSystem"]:checked').value),
  pack: Number(document.querySelector('input[name="packNumeralSystem"]:checked').value)
}

let parseValidator = new CommandParseValid(document.querySelector("#parseErrorMassages"), commandWordInp, numSys.parse);
let packValidator = new CommandPackValid(document.querySelector("#packErrorMassages"), partsWordInps, numSys.pack);

document.querySelectorAll('input[name="parseNumeralSystem"]')
.forEach(input => {
  input.addEventListener("change", function(){
    parseValidator.numeralSystem = numSys.parse = Number(this.value);
    switch (numSys.parse) {
      case 2:
        commandWordInp.placeholder = "1111111100100000";
        commandWordInp.setAttribute('maxlength', '16');
        break;
      case 10:
        commandWordInp.placeholder = "61741";
        commandWordInp.setAttribute('maxlength', '5');
        break;
      case 16:
        commandWordInp.placeholder = "FF20";
        commandWordInp.setAttribute('maxlength', '4');
        break;
    }
    parseValidator.clearAll();
  })
})

document.querySelector("#commandPars")
.addEventListener("click", () => {

  if(!parseValidator.valid()) return;

  commandWord.parse(Formatter.toBin(commandWordInp.value, numSys.parse, 16));

  setParseOutput();
})

document.querySelector("#parseCommandClear")
.addEventListener("click", () => {
  parseValidator.clearAll();
})

function setParseOutput() {
  let output = document.querySelector("#parseOutput");
  output.innerHTML = ""; 

  output.append(output.nextElementSibling.content.cloneNode(true));

  +function setParseTags() {
    let setTag = (output, title) => {
      output.innerHTML += `<span class="form-label m-0 badge bg-info-subtle border border-info-subtle text-info-emphasis rounded-pill fs-6">
                          ${title}
                          </span>`;
    }
  
    let output = document.querySelector("#parseTags");
  
    if(commandWord.addr == "11111") setTag(output, "Групповое");

    console.log(commandWord.transf);
  
    if (commandWord.transf == "0") setTag(output, "КШ->ОУ");
    else setTag(output, "ОУ->КШ");
  
    if(commandWord.numberDW == "00000") setTag(output, "Макс.СД");
    else if(commandWord.numberDW == "00001") setTag(output, "Мин.СД");
  }();
  
  +function setParseTable() {
  
    let tablesBin = document.querySelector("#rowBin").getElementsByTagName("td");
    let tablesDec = document.querySelector("#rowDec").getElementsByTagName("td");
    let tablesHex = document.querySelector("#rowHex").getElementsByTagName("td");
  
    let keys = Object.keys(commandWord.units);
    for (let i = 0; i < keys.length; i++) {
      tablesBin[i].textContent = commandWord.units[keys[i]];
      tablesDec[i].textContent = Formatter.toSystem(commandWord.units[keys[i]], 2, 10);
      tablesHex[i].textContent = Formatter.toSystem(commandWord.units[keys[i]], 2, 16);
    }
  }();

  output.querySelector("#parseOutputClear")
  .addEventListener("click", () => {
    output.innerHTML = "";
  })
}

let packPH = {
  bin: ["11011", "0", "00001", "10001"],
  dec: ["31", "1", "1", "17"],
  hex: ["1F", "0", "15", "C"]
}

document.querySelectorAll('input[name="packNumeralSystem"]')
.forEach(input => {
  input.addEventListener("change", function(){
    packValidator.numeralSystem = numSys.pack = Number(this.value);

    switch (numSys.pack) {
      case 2:
        for (let i = 0; i < partsWordInps.length; i++) {
          partsWordInps[i].placeholder = packPH.bin[i];
          if (partsWordInps[i].id != "packTransf") partsWordInps[i].setAttribute("maxlength", 5);
        }
        break;
      case 10:
        for (let i = 0; i < partsWordInps.length; i++) {
          partsWordInps[i].placeholder = packPH.dec[i];
          if(partsWordInps[i].id != "packTransf") partsWordInps[i].setAttribute("maxlength", 2);
        }
        break;
      case 16:
        for (let i = 0; i < partsWordInps.length; i++) {
          partsWordInps[i].placeholder = packPH.hex[i];
          if(partsWordInps[i].id != "packTransf") partsWordInps[i].setAttribute("maxlength", 2);
        }
        break;
    }

    packValidator.clearAll();
  })
})

document.querySelector("#packCommand")
.addEventListener("click", () => {

  if(!packValidator.valid()) return;

  let unitsArray = [];
  for (const input of partsWordInps) {
    if(input.id ==  "packTransf") unitsArray.push(input.value);
    else unitsArray.push(Formatter.toBin(input.value, numSys.pack, 5));
  }

  commandWord.pack(...unitsArray);

  setPackOutput();
})

document.querySelector("#packCommandClear")
.addEventListener("click", () => {
  packValidator.clearAll();
})

function setPackOutput() {
  let output = document.querySelector("#packOutput");
  output.innerHTML = "";

  output.append(output.nextElementSibling.content.cloneNode(true));

  let tableData = output.querySelectorAll("td");
  tableData[0].textContent = Formatter.toSystem(commandWord.word, 2, 16);
  tableData[1].textContent = Formatter.toSystem(commandWord.word, 2, 10);
  tableData[2].textContent = commandWord.word;

  output.querySelector("#packOutputClear")
  .addEventListener("click", () => {
    output.innerHTML = "";
  })
}

(() => {
  document.querySelector("#putBroadcast")
  .addEventListener("click", () => {
    switch (numSys.pack) {
      case 2:
        partsWordInps[0].value = "11111";
        break;
      case 10:
        partsWordInps[0].value = "31";
        break;
      case 16:
        partsWordInps[0].value = "1F";
        break;
    }
  })
  
  document.querySelector("#putReseive")
  .addEventListener("click", () => {
    partsWordInps[1].value = "1";
  })

  document.querySelector("#putTransmit")
  .addEventListener("click", () => {
    partsWordInps[1].value = "0";
  })

  document.querySelector("#putMax")
  .addEventListener("click", () => {
    switch (numSys.pack) {
      case 2:
        partsWordInps[3].value = "00000";
        break;
      case 10:
      case 16:
        partsWordInps[3].value = "0";
        break;
    }
  })

  document.querySelector("#putMin")
  .addEventListener("click", () => {
    switch (numSys.pack) {
      case 2:
        partsWordInps[3].value = "00001";
        break;
      case 10:
      case 16:
        partsWordInps[3].value = "1";
        break;
    }
  })
})();
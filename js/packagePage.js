import { DataWord } from "./dataWord.js";
import { CommandWord } from "./commandWord.js";
import { CommandParseValid } from "./valid/commandParseValid.js";
import { Formatter } from "./formatter.js";

let dataWord = new DataWord();
let commandWord = new CommandWord();
let action = "";

let numSys = Number(document.querySelector('input[name="parseNumeralSystem"]:checked').value);

let commandWordInp = document.getElementById("commandWord");
let parseValidator = new CommandParseValid(document.querySelector("#parseErrorMassages"), commandWordInp, numSys);

(function settingsMasks() {
  const DEFAULT_VAR_MASK = "DW[dw]_[var]_Msk [msk]";
  const DEFAULT_POS_MASK = "DW[dw]_[var]_Pos [msk]";
  let varInp = document.querySelector("#inputVarMaskFormat"); 
  let posInp = document.querySelector("#inputPosMaskFormat");
  let varMsk = document.querySelector("#varMaskFormat");
  let posMsk = document.querySelector("#posMaskFormat");

  function updateMaskFormat() {
    if (localStorage.getItem("packageVarMaskFormat")) {
      varMsk.textContent = localStorage.getItem("packageVarMaskFormat");
      posMsk.textContent = localStorage.getItem("packagePosMaskFormat");
    } else {
      varMsk.textContent = DEFAULT_VAR_MASK;
      posMsk.textContent = DEFAULT_POS_MASK;
    }

    dataWord.setMaskFormat(varMsk.textContent, posMsk.textContent);
  };
  updateMaskFormat();

  document.querySelector("#changeMaskFormat")
  .addEventListener("click", () => {
    varInp.value = varMsk.textContent.trim();
    posInp.value = posMsk.textContent.trim();
  })
  
  document.querySelector("#defaultMaskFormat")
  .addEventListener("click", () => {
    localStorage.clear();
    updateMaskFormat();
  })
  
  document.querySelector("#saveMaskFormat")
  .addEventListener("click", () => {
    localStorage.setItem("packageVarMaskFormat", `${varInp.value.trim()}`);
    localStorage.setItem("packagePosMaskFormat", `${posInp.value.trim()}`);
    updateMaskFormat();
  })
})();

document.querySelectorAll('input[name="parseNumeralSystem"]')
.forEach(input => {
  input.addEventListener("change", function(){
    parseValidator.numeralSystem = numSys = Number(this.value);
    switch (numSys) {
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

document.querySelector("#commandClear")
.addEventListener("click", () => {
  parseValidator.clearAll();
})

document.querySelector("#createTable")
.addEventListener("click", () => {
  if(!parseValidator.valid()) return;

  commandWord.parse(Formatter.toBin(commandWordInp.value, numSys, 16));

  let tableWrapper = document.querySelector("#tableWrapper");
  tableWrapper.innerHTML = "";
  tableWrapper.append(document.querySelector("#tableWrapperTemplate").content.cloneNode(true));
  let table = tableWrapper.querySelector("#tablePack");

  function createTable(dataWordNumber) {
    let createRow = (title) => {
      let trow = document.createElement("tr");
      let th = document.createElement("th");
      th.textContent = title;
      th.setAttribute("scope", "row");
      th.addEventListener("click", () => {
        th.parentElement.querySelectorAll("td").forEach(td => {
          td.classList.toggle("is-selected");
        })
      });
      trow.append(th);

      let lastBit;
      for (let i = 15; i >= 0; i--) {
        let td = document.createElement("td");
        td.setAttribute("data-bit", i);
        td.addEventListener("click", function(event) {
          this.classList.toggle("is-selected");
          if(event.shiftKey) {
            let thisBit = this.getAttribute("data-bit");
            for (let i = Math.min(thisBit, lastBit); i < Math.max(thisBit, lastBit); i++) {
              let td = this.parentElement.querySelector(`td[data-bit="${i}"]`);
              if(td == null) continue;
              else td.classList.add("is-selected");
            }
          }
          lastBit = this.getAttribute("data-bit");
        })

        trow.append(td);
      }
      return trow;
    }
  
    let tableBody = table.tBodies[0];
    tableBody.classList.add("selectable");
    for(let i = 0; i < dataWordNumber; i++) {
      tableBody.append(createRow(i));
    }
  }

  if(commandWord.numberDW == "00000") createTable(32);
  else createTable(Formatter.toSystem(commandWord.numberDW, 2, 10));
  document.querySelector("#tablePack").scrollIntoView();

  document.querySelector("#addVars")
  .addEventListener("click", addVars);

  document.querySelector("#poolBits")
  .addEventListener("click", () => {
    let row = document.querySelector("#tablePack tr:has(td.is-selected)");
    while(row) {
      let selectedLine = [];
      let cols = 0;
      let td = row.querySelector("td.is-selected");
  
      while (td) {
        selectedLine.push(td);
        td.hasAttribute("colspan") ? cols += Number(td.getAttribute("colspan")) : cols++;
        let nextTd = td.nextElementSibling;
        if(!nextTd) break;
        else if(nextTd.classList.contains("is-selected")) {
          td = nextTd;
        } else break;
      }
  
      selectedLine[0].setAttribute("colspan", cols);
      selectedLine[0].classList.remove("is-selected");
      for (let i = 1; i < selectedLine.length; i++) {
        selectedLine[i].remove();
      }

      row = document.querySelector("#tablePack tr:has(td.is-selected)");
    }
  });

  document.querySelector("#deleteTable")
  .addEventListener("click", () => {
    tableWrapper.innerHTML = "";
    tableWrapper.textContent = 'Укажите настройки пакета и нажмите на кнопку "Создать таблицу"';
  });
})

function addVars() {
  let tableWrapper = document.querySelector("#tableWrapper");
  tableWrapper.querySelector("#poolBits").remove();
  tableWrapper.querySelector("#addVars").remove();

  let btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add("btn", "btn-primary");
  btn.textContent = "Рассчитать маски";
  btn.addEventListener("click", generateMasks);
  tableWrapper.append(btn);

  tableWrapper.querySelectorAll(".selectable").forEach(item => {
    item.classList.remove("selectable");
  })

  tableWrapper.querySelectorAll("td")
  .forEach(td => {
    td.contentEditable = true;
    td.classList.remove("is-selected");
  })
}

function generateMasks() {

  (function setAction() {
    let target = document.querySelector("input[name='target']:checked").value;
    if(Number(commandWord.transf) && target == "busController" ||
      !Number(commandWord.transf) && target == "targetDevise") {
      action = "parse";
    } 
    else if(!Number(commandWord.transf) && target == "busController" ||
             Number(commandWord.transf) && target == "targetDevise") {
      action = "pack";
    }

  })();

  function getAllArrays() {
    let rows = document.querySelector("#tablePack > tbody").querySelectorAll("tr");
    let allArrays = [];
    for (let i = 0; i < rows.length; i++) {
      let varsArray = [];
      let bitsArray = [];
      rows[i].querySelectorAll("td").forEach(td => {
        td.textContent ? varsArray.push(td.textContent) : varsArray.push("Empty");
        td.hasAttribute("colspan") ? bitsArray.push(Number(td.getAttribute("colspan"))) : bitsArray.push(1);
      });
      console.assert(varsArray.length == bitsArray.length, "packeagePage. Массив переменных и битов слова данных должен быть одинаковой размерности");
      allArrays[i] = {vars: varsArray, bits: bitsArray};
    }
    return allArrays;
  }

  function calcMasks(arrays) {
    let dataWordNum = Formatter.toSystem(commandWord.numberDW, 2, 10);
    if(dataWordNum == 0) dataWordNum = 32;
    let outArr = [];
  
    for (let i = 0; i < dataWordNum; i++) {
      let masksData;
      if (action == "pack") masksData = dataWord.pack(arrays[i].vars, arrays[i].bits);
      else masksData = dataWord.parse(arrays[i].vars, arrays[i].bits);
      console.log(masksData);
  
      for (let j = 0; j < masksData.length; j++) {
        outArr.push(masksData[j].var.replace("[dw]", `${i}`));
        outArr.push(masksData[j].pos.replace("[dw]", `${i}`));
      }
    }
    return outArr;
  }

  let masksList = calcMasks(getAllArrays());
  setOutput(masksList);
}

function setOutput(masksList) {
  let masksOutput = document.querySelector("#masksOutput");
  masksOutput.innerHTML = "";

  masksOutput.append(document.querySelector("#masksOutputTemplate").content.cloneNode(true));

  let tag = masksOutput.querySelector("#actionTag");
  if (action == "pack") tag.textContent = "Маски для упаковки"
  else tag.textContent = "Маски для распарски";

  let outputArea = masksOutput.querySelector("output");
  for (let i = 0; i < masksList.length; i++) {
    outputArea.innerHTML += `<span>${masksList[i]}</span>\n`;
  }

  (function setCopyMasksBtn() {
    document.querySelector("#copyMasks")
    .addEventListener("click", function() {
      navigator.clipboard.writeText(masksOutput.querySelector("output").value)
      .then(() => {
          this.classList.toggle("btn-success");
          setTimeout(() => {
              this.classList.toggle("btn-success");
          }, 500);
  
      })
      .catch(error => {
          this.classList.toggle("btn-danger");
          setTimeout(() => {
              this.classList.toggle("btn-danger");
          }, 500);
          console.warn("Не удалось скопировать маски: " + error);
      })
    })
  })();
  
  document.querySelector("#clearMasks")
  .addEventListener("click", () => {
    masksOutput.innerHTML = "";
  })

  masksOutput.scrollIntoView();
}

import { DataWord } from "./dataWord.js";
import { DataValid } from "./valid/dataValid.js";

let dataWord = new DataWord();
let dataValidator = new DataValid(document.querySelector("#errorMessages"));

let varNumber = document.getElementById("varNumber");
let action = document.querySelector("input[name='dataAction']:checked").value;

(function settingsMasks() {
  const DEFAULT_VAR_MASK = "[var]_Msk [msk]";
  const DEFAULT_POS_MASK = "[var]_Pos [msk]";
  let varInp = document.querySelector("#inputVarMaskFormat"); 
  let posInp = document.querySelector("#inputPosMaskFormat");
  let varMsk = document.querySelector("#varMaskFormat");
  let posMsk = document.querySelector("#posMaskFormat");

  function updateMaskFormat() {
    if (localStorage.getItem("dataVarMaskFormat")) {
      varMsk.textContent = localStorage.getItem("dataVarMaskFormat");
      posMsk.textContent = localStorage.getItem("dataPosMaskFormat");
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
  .addEventListener("click", (event) => {
    localStorage.setItem("dataVarMaskFormat", `${varInp.value.trim()}`);
    localStorage.setItem("dataPosMaskFormat", `${posInp.value.trim()}`);
    updateMaskFormat();
  })

  function maskFormatValid() {
    if(varInp.value.includes("[var]", "[msk]")) {
      return true;
    } else {
      varInp.classList.add("is-invalid");
      varInp.parentElement.innerHTML += `<div class="alert alert-danger alert-dismissible m-0 mt-4" role="alert" id="errorMessage">
                                    Укажите обозначения [var] и [msk] в формате маски
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                  </div>`;
      return false;
    }
  }
})();

(function setInputs() {
  let createRowInputs = (number) => {
    return `<div class="row my-2">
              <div class="col-1">${number}</div>
              <div class="col-6">
                  <input type="text" class="form-control" id="var${number}" data-var>
              </div>
              <div class="col-5">
                <input type="number" class="form-control" id="bit${number}" data-bit min="1" max="16">
              </div>
            </div>`;
  }

  let createTitle = () => {
    return `<div class="row my-2">
              <div class="col-1">
                №
              </div>
              <div class="col-6">
                Переменная
              </div>
              <div class="col-5">
                Биты
              </div>
            </div>`;
  }

  function updateInputs() {
    document.querySelector("#varNumberTitle").textContent = varNumber.value;
  
    let dataBord = document.querySelector("#varList");
    dataBord.innerHTML = "";
    dataBord.innerHTML += createTitle();
  
    for (let i = 1; i <= varNumber.value; i++) {
      dataBord.innerHTML += createRowInputs(i);
    }
    
    dataBord.querySelectorAll("input")
    .forEach(input => {
      input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
      })
    });
  };
  updateInputs();
  
  document.querySelector("#varNumber")
  .addEventListener("change", updateInputs);
  
  document.querySelector("#clearVars")
  .addEventListener("click", () => {
    dataValidator.clearAll();
  });

})();

document.querySelectorAll("input[name='dataAction']")
.forEach(input => {
  input.addEventListener("change", function(){
    action = this.value;
  })
})

document.querySelector("#calcMasks")
.addEventListener("click", () => {

  let varInputs = document.querySelectorAll("[data-var]");
  let bitInputs = document.querySelectorAll("[data-bit]");

  dataValidator.varInputs = varInputs;
  dataValidator.bitInputs = bitInputs;
  if(!dataValidator.valid()) return;

  let varsArray = [];
  let bitsArray = [];

  for (let i = 0; i < varInputs.length; i++) {
    varsArray.push(varInputs[i].value);
    bitsArray.push(bitInputs[i].value);
  }

  dataWord.setMaskFormat(document.querySelector("#varMaskFormat").textContent, 
                         document.querySelector("#posMaskFormat").textContent);

  if(action == "parse") {
    setOutput(dataWord.parse(varsArray, bitsArray));
  } else if (action == "pack") {
    setOutput(dataWord.pack(varsArray, bitsArray));
  }
})

function setOutput(maskData) {

  let masksOutput = document.querySelector("#masksOutput");
  masksOutput.innerHTML = "";

  masksOutput.append(document.querySelector("#masksOutputTemplate").content.cloneNode(true));

  let tag = masksOutput.querySelector("#actionTag");
  if(action == "parse") tag.textContent = "Маски для распарски";
  else tag.textContent = "Маски для упаковки";

  let outputArea = masksOutput.querySelector("output");
  for (let i = 0; i < maskData.length; i++) {
    outputArea.innerHTML += `<span>${maskData[i].var}</span>\n`;
    outputArea.innerHTML += `<span>${maskData[i].pos}</span>\n`;
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
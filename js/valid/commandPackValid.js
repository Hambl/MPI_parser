import { Formatter } from "../formatter.js";

export class CommandPackValid {

  #errorsArea;
  #partsInputs;
  #numeralSystem;

  constructor(errorsArea, partsInputs, numeralSystem = 2) {
    this.#errorsArea = errorsArea;
    this.#partsInputs = partsInputs;
    this.#numeralSystem = numeralSystem;

    for (const input of this.#partsInputs) {
      input.addEventListener("input", function() {
        this.classList.remove("is-invalid");
      })
    }
  }

  set numeralSystem(numSys) {
    this.#numeralSystem = numSys;
  }

  #set(message) {
    this.#errorsArea.innerHTML += `<div class="alert alert-danger alert-dismissible m-0 mt-4" role="alert" id="errorMessage">
                                    ${message}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                  </div>`;
  }

  clearAll() {
    this.#clearErrors();
    for (const input of this.#partsInputs) {
      input.classList.remove("is-invalid");
      input.value = "";
    }
  }

  #clearErrors() {
    this.#errorsArea.innerHTML = "";
  }

  valid() {

    this.#clearErrors();

    try {
      this.#checkEmpty();
      this.#checkSymbols();
      this.#checkBits();
    } catch (error) {
      this.#set(error.message);
      return false;
    }

    return true;
  }

  #checkEmpty() {
    let error = false;
    for (const input of this.#partsInputs) {
      if(input.value == "") {
        input.classList.add("is-invalid");
        error = true;
      }
    }
    if(error) throw Error("Заполните поле");
  }

  #checkSymbols() {
    let error = false;
    switch (this.#numeralSystem) {
      case 2:
        for (const input of this.#partsInputs) {
          if(/[^0-1]/.test(input.value)) {
            input.classList.add("is-invalid");
            error = true;
          }
        }
        if(error) throw Error("Некорректное число, используйте символы двоичной системы");
        break;
      case 10:
        for (const input of this.#partsInputs) {
          if(/[^0-9]/.test(input.value)) {
            input.classList.add("is-invalid");
            error = true;
          }
        }
        if(error) throw Error("Некорректное число, используйте символы десятичной системы");
        break;
      case 16:
        for (const input of this.#partsInputs) {
          if(/[^0-9 ^A-F]/i.test(input.value)) {
            input.classList.add("is-invalid");
            error = true;
          }
        }
        if(error) throw Error("Некорректное число, используйте символы шестнадцатиричной системы");
        break;
    }
  }

  #checkBits() {
    for (const input of this.#partsInputs) {

      if(input.id == "packTransf") {
        let value = Formatter.toSystem(input.value, this.#numeralSystem, 10);
        
        if(value > 1) {
          input.classList.add("is-invalid");
          throw Error("Команда приема/передачи должна занимать 1 бит");
        }
      }
      else {
        let value = Formatter.toSystem(input.value, this.#numeralSystem, 10);

        if(value > 31) {
          input.classList.add("is-invalid");
          throw Error("Введите не более 5 бит");
        }
      }
    }
  }

}
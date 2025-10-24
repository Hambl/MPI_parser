export class CommandParseValid {

  #errorsArea;
  #commandInput;
  #numeralSystem;

  constructor(errorsArea, commandInput, numeralSystem = 2) {
    this.#errorsArea = errorsArea;
    this.#commandInput = commandInput;
    this.#numeralSystem = numeralSystem;

    this.#commandInput.addEventListener("input", function() {
      this.classList.remove("is-invalid");
    })
  }

  set numeralSystem(numSys) {
    this.#numeralSystem = numSys;
  }

  #set(message) {
    this.#errorsArea.innerHTML += `<div class="alert alert-danger alert-dismissible m-0 mt-4" role="alert" id="errorMessage">
                                    ${message}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                  </div>`;
    this.#commandInput.classList.add("is-invalid");
  }

  clearAll() {
    this.#commandInput.value = "";
    this.#commandInput.classList.remove("is-invalid");
    this.#clearErrors();
  }

  #clearErrors() {
    this.#errorsArea.innerHTML = "";
  }

  valid() {

    try {
      this.#check(this.#commandInput.value);
    } catch (error) {
      this.#set(error.message);
      return false;
    }

    return true;
  }

  #check(command) {

    this.#clearErrors();

    if (command == "") throw Error("Введите командное слово");

    switch (this.#numeralSystem) {
      case 2:
        if (/[^0-1]/.test(command)) throw Error("Некорреткное КС, используйте символы двоичной системы");
        break;
      case 10:
        if (/[^0-9]/.test(command)) throw Error("Некорректное КС, используйте символы десятичной системы");
        if(command > 65535) throw Error("Введите КС не болше 16 бит");
        break;
      case 16:
        if (/[^0-9 ^A-F]/i.test(command)) throw Error("Некорректное КС, используйте символы шестнадцатиричной системы");
        break;
    }
  }

}
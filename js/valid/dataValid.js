export class DataValid {
  
  #errorsArea;
  #varInputs;
  #bitInputs;

  constructor(errorsArea) {
    this.#errorsArea = errorsArea;
  }

  set varInputs(inputsList) {
    this.#varInputs = inputsList;
  }

  set bitInputs(inputsList) {
    this.#bitInputs = inputsList;
  }

  #set(message) {
    this.#errorsArea.innerHTML += `<div class="alert alert-danger alert-dismissible m-0 mt-4" role="alert" id="errorMessage">
                                    ${message}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                  </div>`;
  }

  clearAll() {
    this.#clearErrors();
    for (let i = 0; i < this.#varInputs.length; i++) {
      this.#varInputs[i].classList.remove("is-invalid");
      this.#bitInputs[i].classList.remove("is-invalid");
      this.#varInputs[i].value = "";
      this.#bitInputs[i].value = "";
    }
  }

  #clearErrors() {
    this.#errorsArea.innerHTML = "";
  }

  valid() {

    this.#clearErrors();

    try {
      this.#checkEmpty();
      this.#checkBits();
    } catch (error) {
      this.#set(error.message);
      return false;
    }

    return true;
  }

  #checkEmpty() {
    let error = false;
    this.#bitInputs.forEach(input => {
      if(input.value == "") {
        input.classList.add("is-invalid");
        error = true;
      }
    });

    this.#varInputs.forEach(input => {
      if(input.value == "") {
        input.classList.add("is-invalid");
        error = true;
      }
    });

    if(error) throw Error("Заполните поле");
  }

  #checkBits() {
    let bits = 0;
    this.#bitInputs.forEach(input => {
      if(+input.value > 16) {
        input.classList.add("is-invalid");
        throw Error("Переменная не может быть больше 16 бит");
      }

      bits += Number(input.value);
    });

    if(bits > 16) throw Error("Слово данных не может быть больше 16 бит");
  }
}
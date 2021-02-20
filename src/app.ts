// validation
interface Validatable {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}
function validate(config: Validatable) {
  let isValid = true
  const { value } = config

  if (config.required) {
    isValid = isValid && value.toString().trim().length !== 0
  }
  if (config.minLength != null && typeof value === 'string') {
    isValid = isValid && value.toString().trim().length >= config.minLength
  }
  if (config.maxLength != null && typeof value === 'string') {
    isValid = isValid && value.toString().trim().length <= config.maxLength
  }
  if (config.min != null) {
    isValid = isValid && +value >= config.min
  }
  if (config.max != null) {
    isValid = isValid && +value <= config.max
  }

  return isValid
}

// autobind decorator
function autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return descriptor.value.bind(this)
    },
  }
  return adjDescriptor
}

class ProjectInput {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLFormElement
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
    this.hostElement = document.getElementById('app')! as HTMLDivElement

    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLFormElement
    this.element.id = 'user-input'

    this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement
    this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement

    this.configure()
    this.attach()
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionInputElement.value
    const enteredPeople = this.peopleInputElement.value

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    }
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    }
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 2,
    }

    if (
      validate(titleValidatable) &&
      validate(descriptionValidatable) &&
      validate(peopleValidatable)
    ) {
      return [enteredTitle, enteredDescription, +enteredPeople]
    } else {
      alert('invalid input, please try again!')
    }
  }

  private clearInputs() {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      console.table(userInput)
      this.clearInputs()
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
}

const prjInput = new ProjectInput()

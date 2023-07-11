class ValidationHandler {
  // static emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}/;
  static emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  // /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/
  // /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined || value.toString() === '';
  }

  static isValidEmailFormat(value: string): boolean {
    return this.emailRegex.test(value);
  }
}

export default ValidationHandler;

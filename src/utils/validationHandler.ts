class ValidationHandler {
  static emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g; // /g = All matches (don't return after first match)

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined || value.toString() === '';
  }

  static isValidEmailFormat(value: string): boolean {
    return (
      !this.isNullOrUndefined(value) && value.match(this.emailRegex) !== null
    );
  }
}

export default ValidationHandler;

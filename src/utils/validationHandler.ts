import moment from 'moment-timezone';

class ValidationHandler {
  private static emailRegex =
    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined || value.toString() === '';
  }

  static isValidNumber(value: any): boolean {
    if (this.isNullOrUndefined(value)) {
      return false;
    }
    if (Number.isNaN(parseInt(value))) {
      return false;
    }
    if (isNaN(value)) {
      return false;
    }

    return true;
  }

  static isValidEmailFormat(value: string): boolean {
    return !this.isNullOrUndefined(value) && this.emailRegex.test(value);
  }

  static isValidDatetime(value: Date): boolean {
    if (this.isNullOrUndefined(value)) {
      return false;
    }
    if (!moment(value).isValid()) {
      return false;
    }
    return true;
  }

  static isEmptyObject(value: unknown): boolean {
    return Object.keys(value).length === 0;
  }

  static isValidDuration(startDatetime: Date, endDatetime: Date): boolean {
    if (
      !this.isValidDatetime(startDatetime) ||
      !this.isValidDatetime(endDatetime) ||
      moment(startDatetime).isAfter(moment(endDatetime)) ||
      moment(startDatetime).isSame(moment(endDatetime))
    ) {
      return false;
    }
    return true;
  }

  static isValidTime(value: string): boolean {
    const validTime = moment(value, 'HH:mm:ss').isValid();
    return validTime;
  }

  static isValidTimeDuration(startTime: string, endTime: string): boolean {
    const validTimeDuration = moment(startTime, 'HH:mm:ss').isBefore(
      moment(endTime, 'HH:mm:ss')
    );
    return validTimeDuration;
  }
}

export default ValidationHandler;

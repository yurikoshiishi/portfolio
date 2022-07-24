export class StringStorage<T extends string> {
  key: string;
  validator: (data: any) => data is T;
  constructor(key: string, validator: (data: any) => data is T) {
    this.key = key;
    this.validator = validator;
  }

  set(data: T) {
    try {
      localStorage.setItem(this.key, data);
    } catch (error) {}
  }

  get(): T | null {
    try {
      const text = localStorage.getItem(this.key);

      if (!text) {
        return null;
      }

      if (this.validator(text)) {
        return text;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

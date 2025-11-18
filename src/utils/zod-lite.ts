export type ParseResult<T> = T;

abstract class BaseSchema<T> {
  protected optionalFlag = false;

  optional(): this {
    this.optionalFlag = true;
    return this;
  }

  parse(value: unknown): T {
    if (value === undefined && this.optionalFlag) {
      return value as T;
    }
    return this.validate(value, []);
  }

  public abstract validate(value: unknown, path: string[]): T;

  protected fail(message: string, path: string[]): never {
    const location = path.length ? ` at ${path.join('.')}` : '';
    throw new Error(`${message}${location}`);
  }
}

class StringSchema extends BaseSchema<string> {
  private minLength?: number;
  private maxLength?: number;
  private pattern?: RegExp;
  private exactLength?: number;
  private requireUrl = false;

  min(value: number): this {
    this.minLength = value;
    return this;
  }

  max(value: number): this {
    this.maxLength = value;
    return this;
  }

  length(value: number): this {
    this.exactLength = value;
    return this;
  }

  regex(pattern: RegExp): this {
    this.pattern = pattern;
    return this;
  }

  url(): this {
    this.requireUrl = true;
    return this;
  }

  public validate(value: unknown, path: string[]): string {
    if (typeof value !== 'string') {
      this.fail('Expected string', path);
    }

    if (this.minLength !== undefined && value.length < this.minLength) {
      this.fail(`Expected minimum length ${this.minLength}`, path);
    }

    if (this.maxLength !== undefined && value.length > this.maxLength) {
      this.fail(`Expected maximum length ${this.maxLength}`, path);
    }

    if (this.exactLength !== undefined && value.length !== this.exactLength) {
      this.fail(`Expected length ${this.exactLength}`, path);
    }

    if (this.pattern && !this.pattern.test(value)) {
      this.fail('String does not match required pattern', path);
    }

    if (this.requireUrl) {
      try {
        new URL(value);
      } catch (error) {
        this.fail('Expected valid URL', path);
      }
    }

    return value;
  }
}

class NumberSchema extends BaseSchema<number> {
  private minValue?: number;
  private maxValue?: number;
  private intFlag = false;
  private positiveFlag = false;

  min(value: number): this {
    this.minValue = value;
    return this;
  }

  max(value: number): this {
    this.maxValue = value;
    return this;
  }

  int(): this {
    this.intFlag = true;
    return this;
  }

  positive(): this {
    this.positiveFlag = true;
    return this;
  }

  public validate(value: unknown, path: string[]): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      this.fail('Expected number', path);
    }

    if (this.intFlag && !Number.isInteger(value)) {
      this.fail('Expected integer', path);
    }

    if (this.minValue !== undefined && value < this.minValue) {
      this.fail(`Expected number >= ${this.minValue}`, path);
    }

    if (this.maxValue !== undefined && value > this.maxValue) {
      this.fail(`Expected number <= ${this.maxValue}`, path);
    }

    if (this.positiveFlag && value <= 0) {
      this.fail('Expected positive number', path);
    }

    return value;
  }
}

class BooleanSchema extends BaseSchema<boolean> {
  public validate(value: unknown, path: string[]): boolean {
    if (typeof value !== 'boolean') {
      this.fail('Expected boolean', path);
    }

    return value;
  }
}

class EnumSchema<T extends string> extends BaseSchema<T> {
  private options: readonly T[];

  constructor(options: readonly T[]) {
    super();
    this.options = options;
  }

  public validate(value: unknown, path: string[]): T {
    if (typeof value !== 'string' || !this.options.includes(value as T)) {
      this.fail(`Expected one of: ${this.options.join(', ')}`, path);
    }

    return value as T;
  }
}

class ArraySchema<T> extends BaseSchema<T[]> {
  private schema: BaseSchema<T>;

  constructor(schema: BaseSchema<T>) {
    super();
    this.schema = schema;
  }

  public validate(value: unknown, path: string[]): T[] {
    if (!Array.isArray(value)) {
      this.fail('Expected array', path);
    }

    return value.map((item, index) => this.schema.validate(item, [...path, String(index)]));
  }
}

class ObjectSchema<T extends Record<string, any>> extends BaseSchema<T> {
  private shape: { [K in keyof T]: BaseSchema<T[K]> };

  constructor(shape: { [K in keyof T]: BaseSchema<T[K]> }) {
    super();
    this.shape = shape;
  }

  public validate(value: unknown, path: string[]): T {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      this.fail('Expected object', path);
    }

    const result: Record<string, unknown> = {};
    for (const key of Object.keys(this.shape)) {
      const schema = this.shape[key];
      result[key] = schema.parse((value as Record<string, unknown>)[key]);
    }

    return result as T;
  }
}

export const z = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  boolean: () => new BooleanSchema(),
  enum: <T extends string>(options: readonly T[]) => new EnumSchema(options),
  array: <T>(schema: BaseSchema<T>) => new ArraySchema(schema),
  object: <T extends Record<string, any>>(shape: { [K in keyof T]: BaseSchema<T[K]> }) => new ObjectSchema(shape),
};

export type ZodTypeAny = BaseSchema<any>;

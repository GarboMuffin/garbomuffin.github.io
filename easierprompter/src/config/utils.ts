import { ConfigGetter, ConfigSetter } from "./option";

export type ValueType = "number" | "text" | "checkbox";
// I don't understand typescript overloads.
export function getterFrom(el: HTMLElement, type?: "text" | ValueType): ConfigGetter<string>;
export function getterFrom(el: HTMLElement, type: "checkbox"): ConfigGetter<boolean>;
export function getterFrom(el: HTMLElement, type: "number"): ConfigGetter<number>;
export function getterFrom(el: HTMLElement, type: ValueType = "text"): ConfigGetter<any> {
  let getter: ConfigGetter<any> = () => el.textContent || "";

  if (el instanceof HTMLTextAreaElement) {
    getter = () => el.value;
  }

  if (el instanceof HTMLInputElement) {
    if (el.type === "checkbox") {
      getter = () => el.checked;
    } else {
      getter = () => el.value;
    }
  }

  if (type === "number") {
    return () => {
      const val = getter().trim();

      if (val === "") {
        return 0;
      } else {
        return Number(val);
      }
    };
  }

  return getter;
}

export interface ISetterFromOptions<T = any> {
  transform?: (value: T) => T | any;
  callback?: (value: T) => void;
  onchange?: boolean;
}
export function setterFrom(e: HTMLElement, t: "text" | ValueType, o?: ISetterFromOptions<string>): ConfigSetter<string>;
export function setterFrom(el: HTMLElement, type: "checkbox", o?: ISetterFromOptions<boolean>): ConfigSetter<boolean>;
export function setterFrom(el: HTMLElement, type: "number", opts?: ISetterFromOptions<number>): ConfigSetter<number>;
export function setterFrom(el: HTMLElement, type: ValueType, opts: ISetterFromOptions<any> = {}): ConfigSetter<any> {
  const getBaseSetter = () => {
    if (el instanceof HTMLTextAreaElement) {
      return (value: any) => el.value = value;
    }

    if (el instanceof HTMLInputElement) {
      if (type === "text") {
        return (value: any) => el.value = value;
      } else if (type === "number") {
        return (value: any) => el.value = value.toString();
      } else if (type === "checkbox") {
        return (value: any) => el.checked = value;
      } else {
        console.warn(`Unsupported input type: ${type}`);
      }
    }

    return (value: any) => el.textContent = value;
  };

  const setter = getBaseSetter();

  const stack: Func[] = [];
  if (opts.transform) {
    stack.push(opts.transform);
  }
  stack.push(setter);
  if (opts.callback) {
    stack.push(opts.callback);
  }

  const functionStack = createFunctionPipe(stack);
  if (opts.onchange) {
    const getter = getterFrom(el);
    el.onchange = () => {
      functionStack(getter());
    };
  }

  return functionStack;
}

type Func = (...args: any[]) => any;
// Basic idea of a "Function Pipe":
// Given functions A, B, C and an inital value:
// A will be called with that inital value and its return value is stored as the new value
// B will be called with the result of A and its return value is stored as the new value
// C will be called with the result of B and its return value is stored as the new value
// etc...
// So basically: C(B(A("some inital value")))
function createFunctionPipe(functions: Func[] = []) {
  return (value: any) => {
    for (const func of functions) {
      value = func(value);
    }
    return value;
  };
}

/**
 * Remove elements matching the specified query
 * from the DOM tree
 */
export const removeElements = (
  query: string,
  ancestor: ParentNode = document
) => {
  const elements = ancestor.querySelectorAll(query);

  elements.forEach((element) => {
    element.parentNode!.removeChild(element);
  });
};

interface CreateElementOptions {
  tag: keyof HTMLElementTagNameMap;
  classes?: string;
  id?: string
  styles?: Partial<CSSStyleDeclaration>;
}

const DEFAULT_CREATE_OPTIONS: CreateElementOptions = {
  tag: "div",
  classes: "",
};

export const createElement = (
  options: CreateElementOptions = DEFAULT_CREATE_OPTIONS
): HTMLElement => {
  const element = document.createElement(options.tag);

  // Set the class names
  element.className = options.classes || "";
  element.id = options.id || "";

  // Apply styles and return
  return setStylesForElement(element, options.styles);
};

/**
 *
 * @param {HTMLElement} element
 * @param {CSSStyleDeclaration} styles
 */
export const setStylesForElement = (
  element: HTMLElement,
  styles?: Partial<CSSStyleDeclaration>
): HTMLElement => {
  if (!styles) {
    return element;
  }

  const styleKeys = Object.keys(styles) as Array<Exclude<
    keyof CSSStyleDeclaration,
    "length" | "parentRule"
  >>;
  styleKeys.forEach((styleKey) => {
    element.style[styleKey] = styles[styleKey];
  });

  return element;
};

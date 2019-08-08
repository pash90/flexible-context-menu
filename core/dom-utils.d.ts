/**
 * Remove elements matching the specified query
 * from the DOM tree
 */
export declare const removeElements: (query: string, ancestor?: ParentNode) => void;
interface CreateElementOptions {
    tag: keyof HTMLElementTagNameMap;
    classes?: string;
    id?: string;
    styles?: Partial<CSSStyleDeclaration>;
}
export declare const createElement: (options?: CreateElementOptions) => HTMLElement;
/**
 *
 * @param {HTMLElement} element
 * @param {CSSStyleDeclaration} styles
 */
export declare const setStylesForElement: (element: HTMLElement, styles?: Partial<CSSStyleDeclaration> | undefined) => HTMLElement;
export {};

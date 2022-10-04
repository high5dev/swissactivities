export * from './algolia'

/**
 * Helps in cases when you want to be sure that current variable is an array and avoid checks.
 * Useful for render methods, because empty array will not return any layouts.
 * @param {any} a 
 * @returns {Array}
 */
export const getArray = (a) => Array.isArray(a) ? a : [];

/**
 * Service to work with global window object
 */
export class WindowService {
    static hideScroll(flag = true) {
        const htmlStyles = `overflow: ${flag ? 'hidden' : 'unset'}; padding-right: ${(flag && !this.isMobile) ? '15px' : '0'}`
        document.body.parentElement.setAttribute('style', htmlStyles);
    }
    static addListener(event, callback) {
        window.addEventListener(event, callback);
    }
    static removeListener(event, callback) {
        window.removeEventListener(event, callback);
    }
    static get isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    }
}

/**
 * Wrap passed children with wrapper
 * @param {boolean} condition
 * @param {function} wrapper
 * @param children
 * @returns {*}
 */
export const ConditionalWrapper = ({ condition, wrapper, children }) => condition ? wrapper(children) : children

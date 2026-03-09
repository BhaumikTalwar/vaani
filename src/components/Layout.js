// @ts-check

/**
 * @typedef {object} ContainerConfig
 * @property {string | HTMLElement} children - Container content
 * @property {'sm'|'md'|'lg'|'xl'|'full'} [size='lg'] - Max width
 * @property {boolean} [centered=true] - Center content horizontally
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Creates a responsive container wrapper
 * @function createContainer
 * @param {ContainerConfig} config - Container configuration
 * @returns {HTMLDivElement} The container element
 */
export function createContainer(config) {
    const { children, size = "lg", centered = true, className = "" } = config || {};

    const container = document.createElement("div");

    const sizeClasses = {
        sm: "max-w-2xl",
        md: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        full: "max-w-full",
    };

    const baseClasses = "w-full mx-auto px-4 sm:px-6 lg:px-8";
    const widthClass = sizeClasses[size] || sizeClasses.lg;

    container.className = `${baseClasses} ${centered ? widthClass : ""} ${className}`.trim();

    if (children) {
        if (typeof children === "string") {
            container.innerHTML = children;
        } else {
            container.appendChild(children);
        }
    }

    return container;
}

/**
 * @typedef {object} FlexConfig
 * @property {string | HTMLElement} children - Flex content
 * @property {'row'|'col'} [direction='row'] - Flex direction
 * @property {'start'|'center'|'end'|'between'|'around'|'evenly'} [justify='start'] - Justify content
 * @property {'start'|'center'|'end'|'stretch'|'baseline'} [align='stretch'] - Align items
 * @property {boolean} [wrap=false] - Enable flex wrap
 * @property {string} [gap] - Gap (e.g., '4', '6', '1rem')
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Creates a flexbox wrapper
 * @function createFlex
 * @param {FlexConfig} config - Flex configuration
 * @returns {HTMLDivElement} The flex element
 */
export function createFlex(config) {
    const {
        children,
        direction = "row",
        justify = "start",
        align = "stretch",
        wrap = false,
        gap,
        className = "",
    } = config || {};

    const flex = document.createElement("div");

    const directionClasses = {
        row: "flex-row",
        col: "flex-col",
    };

    const justifyClasses = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
    };

    const alignClasses = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
    };

    const gapClass = gap ? `gap-${gap}` : "";

    flex.className = `
        flex
        ${directionClasses[direction]}
        ${justifyClasses[justify]}
        ${alignClasses[align]}
        ${wrap ? "flex-wrap" : "flex-nowrap"}
        ${gapClass}
        ${className}
    `.trim().replace(/\s+/g, " ");

    if (children) {
        if (typeof children === "string") {
            flex.innerHTML = children;
        } else {
            flex.appendChild(children);
        }
    }

    return flex;
}

/**
 * @typedef {object} GridConfig
 * @property {string | HTMLElement} children - Grid content
 * @property {number} [cols=1] - Number of columns (1-6)
 * @property {'sm'|'md'|'lg'|'xl'} [responsive] - Responsive breakpoints
 * @property {string} [gap] - Gap size
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Creates a CSS grid wrapper
 * @function createGrid
 * @param {GridConfig} config - Grid configuration
 * @returns {HTMLDivElement} The grid element
 */
export function createGrid(config) {
    const { children, cols = 1, responsive, gap, className = "" } = config || {};

    const grid = document.createElement("div");

    const colClasses = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
    };

    const responsiveClasses = responsive ? {
        sm: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        md: "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        lg: "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
        xl: "xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4",
    }[responsive] : "";

    const gapClass = gap ? `gap-${gap}` : "";

    grid.className = `
        grid
        ${colClasses[cols] || `grid-cols-${cols}`}
        ${responsiveClasses}
        ${gapClass}
        ${className}
    `.trim().replace(/\s+/g, " ");

    if (children) {
        if (typeof children === "string") {
            grid.innerHTML = children;
        } else {
            grid.appendChild(children);
        }
    }

    return grid;
}

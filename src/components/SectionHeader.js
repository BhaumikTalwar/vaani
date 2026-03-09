// @ts-check

/**
 * @typedef {object} SectionHeaderConfig
 * @property {string} heading - Main heading text
 * @property {string} [subheading] - Optional subheading text
 * @property {'left'|'center'|'right'} [align='left'] - Text alignment
 */

/**
 * Creates a reusable section header component with enhanced typography
 * @function createSectionHeader
 * @param {SectionHeaderConfig} config - Section header configuration
 * @returns {HTMLDivElement} The section header element
 */
export function createSectionHeader(config) {
    const { heading = "", subheading, align = "left" } = config || {};

    const container = document.createElement("div");
    const alignClass =
        align === "center"
            ? "text-center items-center"
            : align === "right"
                ? "text-right items-end"
                : "text-left items-start";
    container.className = `flex flex-col gap-3 ${alignClass} mb-12`;

    const headingElement = document.createElement("h2");
    headingElement.textContent = heading;
    headingElement.className =
        "text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight";

    container.appendChild(headingElement);

    if (subheading) {
        const subheadingElement = document.createElement("p");
        subheadingElement.textContent = subheading;
        subheadingElement.className = "text-lg md:text-xl text-text-secondary mt-2 max-w-2xl leading-relaxed";

        container.appendChild(subheadingElement);
    }

    return container;
}

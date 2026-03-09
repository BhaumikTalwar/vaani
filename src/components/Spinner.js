// @ts-check

/**
 * @typedef {object} SpinnerConfig
 * @property {'sm'|'md'|'lg'} [size='md'] - Spinner size
 * @property {string} [color='primary'] - Spinner color
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Creates a reusable spinner/loading indicator
 * @function createSpinner
 * @param {SpinnerConfig} config - Spinner configuration
 * @returns {HTMLDivElement} The spinner element
 */
export function createSpinner(config) {
    const { size = "md", color = "primary", className = "" } = config || {};

    const sizeMap = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    const colorMap = {
        primary: "border-[var(--color-primary)]",
        secondary: "border-[var(--color-secondary)]",
        white: "border-white",
        success: "border-[var(--color-success)]",
        error: "border-[var(--color-error)]",
    };

    const spinner = document.createElement("div");
    spinner.className = `
        inline-block rounded-full animate-spin
        ${sizeMap[size]}
        ${colorMap[color] || colorMap.primary}
        border-t-transparent
        ${className}
    `.trim().replace(/\s+/g, " ");

    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-label", "Loading");

    return spinner;
}

/**
 * Creates a full-screen loading overlay
 * @function createLoadingOverlay
 * @param {string} [message] - Loading message
 * @returns {HTMLDivElement} The overlay element
 */
export function createLoadingOverlay(message = "Loading...") {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-[var(--z-modal)] gap-4";
    overlay.id = "loading-overlay";

    const spinner = createSpinner({ size: "lg", color: "primary" });

    const text = document.createElement("p");
    text.className = "text-[var(--color-text-secondary)] text-lg font-medium";
    text.textContent = message;

    overlay.appendChild(spinner);
    overlay.appendChild(text);

    return overlay;
}

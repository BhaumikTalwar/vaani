// @ts-check

/**
 * @typedef {object} ButtonConfig
 * @property {string} text - Button text
 * @property {'button'|'submit'|'reset'} [type='button'] - Button type
 * @property {'primary' | 'secondary' | 'ghost' | 'accent' | 'outline'} [variant='primary'] - Button variant
 * @property {'small' | 'medium' | 'large'} [size='medium'] - Button size
 * @property {boolean} [fullWidth=false] - Whether button should be full width
 * @property {() => void} [onClick] - Click handler
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Creates a reusable button component with eye-candy styling
 * @function createButton
 * @param {ButtonConfig} config - Button configuration
 * @returns {HTMLButtonElement} The button element
 */
export function createButton(config) {
    const {
        text = "",
        type = "button",
        variant = "primary",
        size = "medium",
        fullWidth = false,
        onClick,
        className = "",
    } = config || {};

    const button = document.createElement("button");
    button.type = type;
    button.textContent = text;

    const baseClasses =
        "relative inline-flex items-center justify-center font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 ease-out transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

    const variantClasses = {
        primary:
            "bg-gradient-to-r from-primary to-secondary text-white shadow-soft hover:shadow-glow focus:ring-primary border-transparent",

        secondary:
            "bg-white text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary/5 focus:ring-primary shadow-sm hover:shadow-md",

        ghost:
            "bg-transparent text-text-secondary hover:text-primary hover:bg-primary/10 focus:ring-primary shadow-none",

        accent:
            "bg-gradient-to-r from-accent to-yellow-500 text-white shadow-md hover:shadow-lg focus:ring-accent",

        outline:
            "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary",
    };

    const sizeClasses = {
        small: "px-4 py-2 text-sm",
        medium: "px-6 py-3",
        large: "px-8 py-4 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    button.className =
        `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

    if (onClick) {
        button.addEventListener("click", onClick);
    }

    return button;
}

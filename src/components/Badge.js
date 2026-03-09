// @ts-check

/**
 * @typedef {object} BadgeConfig
 * @property {string} text - Badge text
 * @property {'default'|'success'|'warning'|'error'|'info'|'primary'} [variant='default'] - Badge variant
 * @property {'sm'|'md'} [size='md'] - Badge size
 * @property {'filled'|'outline'|'soft'} [style='filled'] - Badge style
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Creates a reusable badge/status indicator component
 * @function createBadge
 * @param {BadgeConfig} config - Badge configuration
 * @returns {HTMLSpanElement} The badge element
 */
export function createBadge(config) {
    const {
        text,
        variant = "default",
        size = "md",
        style = "filled",
        className = "",
    } = config || {};

    const badge = document.createElement("span");
    badge.textContent = text;

    const sizeClasses = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
    };

    const variantClasses = {
        default: {
            filled: "bg-[var(--color-background-muted)] text-[var(--color-text-secondary)]",
            outline: "border border-[var(--color-border)] text-[var(--color-text-secondary)]",
            soft: "bg-[var(--color-background-subtle)] text-[var(--color-text-secondary)]",
        },
        success: {
            filled: "bg-[var(--color-success)] text-white",
            outline: "border border-[var(--color-success)] text-[var(--color-success)]",
            soft: "bg-[var(--color-success-light)] text-[var(--color-success)]",
        },
        warning: {
            filled: "bg-[var(--color-warning)] text-white",
            outline: "border border-[var(--color-warning)] text-[var(--color-warning)]",
            soft: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
        },
        error: {
            filled: "bg-[var(--color-error)] text-white",
            outline: "border border-[var(--color-error)] text-[var(--color-error)]",
            soft: "bg-[var(--color-error-light)] text-[var(--color-error)]",
        },
        info: {
            filled: "bg-[var(--color-info)] text-white",
            outline: "border border-[var(--color-info)] text-[var(--color-info)]",
            soft: "bg-[var(--color-info-light)] text-[var(--color-info)]",
        },
        primary: {
            filled: "bg-[var(--color-primary)] text-white",
            outline: "border border-[var(--color-primary)] text-[var(--color-primary)]",
            soft: "bg-[var(--color-primary-light)] bg-opacity-20 text-[var(--color-primary-dark)]",
        },
    };

    const baseClasses = "inline-flex items-center justify-center font-medium rounded-full";

    badge.className = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]?.[style] || variantClasses.default.filled}
        ${className}
    `.trim().replace(/\s+/g, " ");

    return badge;
}

/**
 * Creates a dot indicator badge
 * @function createDotBadge
 * @param {string} text - Badge text
 * @param {string} [color] - Dot color
 * @returns {HTMLSpanElement} The dot badge element
 */
export function createDotBadge(text, color = "primary") {
    const badge = document.createElement("span");
    badge.className = "inline-flex items-center gap-1.5";

    const dotColors = {
        primary: "bg-[var(--color-primary)]",
        success: "bg-[var(--color-success)]",
        warning: "bg-[var(--color-warning)]",
        error: "bg-[var(--color-error)]",
        info: "bg-[var(--color-info)]",
    };

    const dot = document.createElement("span");
    dot.className = `w-2 h-2 rounded-full ${dotColors[color] || dotColors.primary}`;
    dot.setAttribute("aria-hidden", "true");

    const textSpan = document.createElement("span");
    textSpan.textContent = text;

    badge.appendChild(dot);
    badge.appendChild(textSpan);

    return badge;
}

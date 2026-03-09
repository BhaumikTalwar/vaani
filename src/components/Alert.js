// @ts-check

/**
 * @typedef {object} AlertConfig
 * @property {string} message - Alert message
 * @property {string} [title] - Optional title
 * @property {'success'|'warning'|'error'|'info'} [variant='info'] - Alert variant
 * @property {boolean} [dismissible=false] - Show close button
 * @property {() => void} [onDismiss] - Dismiss handler
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Creates a reusable alert/notification component
 * @function createAlert
 * @param {AlertConfig} config - Alert configuration
 * @returns {HTMLDivElement} The alert element
 */
export function createAlert(config) {
    const {
        message,
        title,
        variant = "info",
        dismissible = false,
        onDismiss,
        className = "",
    } = config || {};

    const alert = document.createElement("div");

    const variantStyle = variant;

    const variantClasses = {
        success: {
            bg: "bg-[var(--color-success-light)]",
            border: "border-l-4 border-[var(--color-success)]",
            icon: "<svg class=\"w-5 h-5 text-[var(--color-success)]\" fill=\"currentColor\" viewBox=\"0 0 20 20\"><path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\"/></svg>",
        },
        warning: {
            bg: "bg-[var(--color-warning-light)]",
            border: "border-l-4 border-[var(--color-warning)]",
            icon: "<svg class=\"w-5 h-5 text-[var(--color-warning)]\" fill=\"currentColor\" viewBox=\"0 0 20 20\"><path fill-rule=\"evenodd\" d=\"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z\" clip-rule=\"evenodd\"/></svg>",
        },
        error: {
            bg: "bg-[var(--color-error-light)]",
            border: "border-l-4 border-[var(--color-error)]",
            icon: "<svg class=\"w-5 h-5 text-[var(--color-error)]\" fill=\"currentColor\" viewBox=\"0 0 20 20\"><path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z\" clip-rule=\"evenodd\"/></svg>",
        },
        info: {
            bg: "bg-[var(--color-info-light)]",
            border: "border-l-4 border-[var(--color-info)]",
            icon: "<svg class=\"w-5 h-5 text-[var(--color-info)]\" fill=\"currentColor\" viewBox=\"0 0 20 20\"><path fill-rule=\"evenodd\" d=\"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\" clip-rule=\"evenodd\"/></svg>",
        },
    };

    const variantData = variantClasses[variantStyle] || variantClasses.info;

    alert.className = `
        ${variantData.bg} ${variantData.border}
        rounded-r-lg p-4 flex items-start gap-3
        ${className}
    `.trim().replace(/\s+/g, " ");

    const iconContainer = document.createElement("div");
    iconContainer.className = "flex-shrink-0";
    iconContainer.innerHTML = variantData.icon;
    alert.appendChild(iconContainer);

    const content = document.createElement("div");
    content.className = "flex-1";

    if (title) {
        const titleEl = document.createElement("p");
        titleEl.className = "font-semibold text-[var(--color-text-primary)]";
        titleEl.textContent = title;
        content.appendChild(titleEl);
    }

    const messageEl = document.createElement("p");
    messageEl.className = title ? "mt-1 text-sm text-[var(--color-text-secondary)]" : "text-sm text-[var(--color-text-secondary)]";
    messageEl.textContent = message;
    content.appendChild(messageEl);

    alert.appendChild(content);

    if (dismissible) {
        const dismissBtn = document.createElement("button");
        dismissBtn.type = "button";
        dismissBtn.className = "flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors";
        dismissBtn.setAttribute("aria-label", "Dismiss");
        dismissBtn.innerHTML = `
            <svg class="w-4 h-4 text-[var(--color-text-secondary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
        `;

        dismissBtn.addEventListener("click", () => {
            if (onDismiss) {
                onDismiss();
            }
            alert.remove();
        });

        alert.appendChild(dismissBtn);
    }

    return alert;
}

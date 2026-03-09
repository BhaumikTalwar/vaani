// @ts-check

/**
 * @typedef {object} InputConfig
 * @property {string} [name] - Input name attribute
 * @property {string} [value] - Input value
 * @property {string} [type='text'] - Input type
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [label] - Label text
 * @property {string} [helperText] - Helper text below input
 * @property {string} [error] - Error message
 * @property {boolean} [disabled=false] - Disabled state
 * @property {boolean} [required=false] - Required state
 * @property {boolean} [readOnly=false] - Readonly state
 * @property {string} [className] - Additional CSS classes
 * @property {(value: string) => void} [onChange] - Change handler
 * @property {HTMLElement} [prefixIcon] - Icon element before input
 * @property {HTMLElement} [suffixIcon] - Icon element after input
 */

/**
 * Creates a reusable input component with label, error state, and icons
 * @function createInput
 * @param {InputConfig} config - Input configuration
 * @returns {HTMLDivElement} The input wrapper element containing label, input, and helper text
 */
export function createInput(config) {
    const {
        name,
        value = "",
        type = "text",
        placeholder = "",
        label,
        helperText,
        error,
        disabled = false,
        required = false,
        readOnly = false,
        className = "",
        onChange,
        prefixIcon,
        suffixIcon,
    } = config || {};

    const wrapper = document.createElement("div");
    wrapper.className = `input-wrapper flex flex-col gap-1.5 ${className}`.trim();

    if (label) {
        const labelEl = document.createElement("label");
        labelEl.htmlFor = name;
        labelEl.className = "text-sm font-medium text-[var(--color-text-primary)]";
        labelEl.textContent = required ? `${label} *` : label;
        wrapper.appendChild(labelEl);
    }

    const inputContainer = document.createElement("div");
    inputContainer.className = "relative flex items-center";

    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = value;
    input.placeholder = placeholder;
    input.disabled = disabled;
    input.required = required;
    input.readOnly = readOnly;
    input.autocomplete = "off";

    const baseClasses = "w-full px-4 py-2.5 text-base rounded-lg border transition-all duration-200 outline-none";
    const stateClasses = error
        ? "border-[var(--color-error)] bg-[var(--color-error-light)] focus:ring-2 focus:ring-[var(--color-error)] focus:border-transparent"
        : "border-[var(--color-border)] bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:ring-opacity-30";

    const iconPadding = prefixIcon ? "pl-11" : "";
    const suffixPadding = suffixIcon ? "pr-11" : "";

    input.className = `${baseClasses} ${stateClasses} ${iconPadding} ${suffixPadding} ${
        disabled ? "opacity-50 cursor-not-allowed bg-[var(--color-background-muted)]" : ""
    }`.trim();

    if (onChange) {
        input.addEventListener("input", (e) => {
            onChange(/** @type {HTMLInputElement} */ (e.target).value);
        });
    }

    inputContainer.appendChild(input);

    if (prefixIcon) {
        const iconWrapper = document.createElement("div");
        iconWrapper.className = "absolute left-3 flex items-center pointer-events-none text-[var(--color-text-muted)]";
        iconWrapper.appendChild(prefixIcon);
        inputContainer.appendChild(iconWrapper);
    }

    if (suffixIcon) {
        const iconWrapper = document.createElement("div");
        iconWrapper.className = "absolute right-3 flex items-center pointer-events-none text-[var(--color-text-muted)]";
        iconWrapper.appendChild(suffixIcon);
        inputContainer.appendChild(iconWrapper);
    }

    wrapper.appendChild(inputContainer);

    if (error) {
        const errorEl = document.createElement("span");
        errorEl.className = "text-sm text-[var(--color-error)]";
        errorEl.textContent = error;
        wrapper.appendChild(errorEl);
    } else if (helperText) {
        const helperEl = document.createElement("span");
        helperEl.className = "text-sm text-[var(--color-text-muted)]";
        helperEl.textContent = helperText;
        wrapper.appendChild(helperEl);
    }

    return wrapper;
}

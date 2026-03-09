// @ts-check

/**
 * @typedef {object} CardConfig
 * @property {string | HTMLElement} [header] - Card header content
 * @property {string | HTMLElement} [body] - Card body content
 * @property {string | HTMLElement} [footer] - Card footer content
 * @property {boolean} [hoverable=false] - Enable hover effect
 * @property {boolean} [bordered=true] - Show border
 * @property {'sm'|'md'|'lg'} [size='md'] - Card padding size
 * @property {string} [className] - Additional CSS classes
 * @property {() => void} [onClick] - Click handler
 */

/**
 * Creates a reusable card component with header, body, footer sections
 * @function createCard
 * @param {CardConfig} config - Card configuration
 * @returns {HTMLDivElement} The card element
 */
export function createCard(config) {
    const {
        header,
        body,
        footer,
        hoverable = false,
        bordered = true,
        size = "md",
        className = "",
        onClick,
    } = config || {};

    const card = document.createElement("div");

    const sizeClasses = {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    const baseClasses = "bg-white rounded-[var(--radius-xl)]";
    const borderClasses = bordered ? "border border-[var(--color-border)]" : "";
    const hoverClasses = hoverable
        ? "transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 cursor-pointer"
        : "shadow-[var(--shadow-soft)]";

    card.className = `${baseClasses} ${borderClasses} ${hoverClasses} ${className}`.trim();

    if (onClick) {
        card.addEventListener("click", onClick);
        card.tabIndex = 0;
        card.role = "button";
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
            }
        });
    }

    if (header) {
        const headerEl = document.createElement("div");
        headerEl.className = `border-b border-[var(--color-border-light)] ${sizeClasses[size]}`;

        if (typeof header === "string") {
            headerEl.innerHTML = header;
        } else {
            headerEl.appendChild(header);
        }
        card.appendChild(headerEl);
    }

    if (body) {
        const bodyEl = document.createElement("div");
        bodyEl.className = sizeClasses[size];

        if (typeof body === "string") {
            bodyEl.innerHTML = body;
        } else {
            bodyEl.appendChild(body);
        }
        card.appendChild(bodyEl);
    }

    if (footer) {
        const footerEl = document.createElement("div");
        footerEl.className = `border-t border-[var(--color-border-light)] ${sizeClasses[size]}`;

        if (typeof footer === "string") {
            footerEl.innerHTML = footer;
        } else {
            footerEl.appendChild(footer);
        }
        card.appendChild(footerEl);
    }

    return card;
}

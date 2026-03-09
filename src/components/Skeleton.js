// @ts-check

/**
 * @typedef {object} SkeletonConfig
 * @property {'text'|'circular'|'rectangular'} [variant='text'] - Skeleton shape
 * @property {string} [width] - Width (e.g., '100px', '50%')
 * @property {string} [height] - Height (e.g., '20px', '100px')
 * @property {number} [lines=1] - Number of text lines (for text variant)
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Creates a skeleton/placeholder loading element
 * @function createSkeleton
 * @param {SkeletonConfig} config - Skeleton configuration
 * @returns {HTMLDivElement} The skeleton element
 */
export function createSkeleton(config) {
    const {
        variant = "text",
        width,
        height,
        lines = 1,
        className = "",
    } = config || {};

    const baseClasses = "animate-pulse bg-[var(--color-background-muted)]";

    if (variant === "circular") {
        const el = document.createElement("div");
        el.className = `${baseClasses} rounded-full ${className}`.trim();
        el.style.width = width || "40px";
        el.style.height = height || width || "40px";
        return el;
    }

    if (variant === "rectangular") {
        const el = document.createElement("div");
        el.className = `${baseClasses} rounded-lg ${className}`.trim();
        if (width) el.style.width = width;
        if (height) el.style.height = height;
        return el;
    }

    const container = document.createElement("div");
    container.className = `flex flex-col gap-2 w-full ${className}`.trim();

    for (let i = 0; i < lines; i++) {
        const line = document.createElement("div");
        line.className = `${baseClasses} rounded h-4`;

        if (width) {
            line.style.width = width;
        } else {
            line.style.width = i === lines - 1 ? "60%" : "100%";
        }

        container.appendChild(line);
    }

    return container;
}

/**
 * Creates a card skeleton placeholder
 * @function createCardSkeleton
 * @param {object} [config] - Configuration
 * @param {boolean} [config.showHeader] - Show header placeholder
 * @param {boolean} [config.showFooter] - Show footer placeholder
 * @returns {HTMLDivElement} The card skeleton
 */
export function createCardSkeleton(config = {}) {
    const { showHeader = true, showFooter = true } = config;

    const card = document.createElement("div");
    card.className = "bg-white rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 shadow-[var(--shadow-soft)]";

    if (showHeader) {
        const header = document.createElement("div");
        header.className = "flex items-center gap-3 mb-4";

        const avatar = createSkeleton({ variant: "circular", width: "48px", height: "48px" });
        const textLines = createSkeleton({ lines: 2 });

        header.appendChild(avatar);
        header.appendChild(textLines);
        card.appendChild(header);
    }

    const body = document.createElement("div");
    body.className = "flex flex-col gap-2 mb-4";

    for (let i = 0; i < 3; i++) {
        const line = createSkeleton({ lines: 1, width: i === 2 ? "70%" : "100%" });
        body.appendChild(line);
    }
    card.appendChild(body);

    if (showFooter) {
        const footer = document.createElement("div");
        footer.className = "flex gap-2";

        const btn1 = createSkeleton({ variant: "rectangular", width: "80px", height: "36px" });
        const btn2 = createSkeleton({ variant: "rectangular", width: "80px", height: "36px" });

        footer.appendChild(btn1);
        footer.appendChild(btn2);
        card.appendChild(footer);
    }

    return card;
}

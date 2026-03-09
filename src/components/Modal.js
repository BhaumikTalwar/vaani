// @ts-check

import { createFlex } from "./Layout.js";

/**
 * @typedef {object} ModalConfig
 * @property {string | HTMLElement} content - Modal body content
 * @property {string | HTMLElement} [header] - Modal header
 * @property {string | HTMLElement} [footer] - Modal footer
 * @property {boolean} [closeOnBackdrop=true] - Close when clicking backdrop
 * @property {boolean} [closeOnEscape=true] - Close on Escape key
 * @property {boolean} [showCloseButton=true] - Show close button
 * @property {'sm'|'md'|'lg'|'xl'|'full'} [size='md'] - Modal size
 * @property {() => void} [onClose] - Close handler
 */

/**
 * Creates a reusable modal/dialog component
 * @function createModal
 * @param {ModalConfig} config - Modal configuration
 * @returns {HTMLDivElement} The modal element with backdrop
 */
export function createModal(config) {
    const {
        content,
        header,
        footer,
        closeOnBackdrop = true,
        closeOnEscape = true,
        showCloseButton = true,
        size = "md",
        onClose,
    } = config || {};

    const backdrop = document.createElement("div");
    backdrop.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[var(--z-modal-backdrop)] animate-fade-in";
    backdrop.id = `modal-${Date.now()}`;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[90vw] max-h-[90vh]",
    };

    const modal = document.createElement("div");
    modal.className = `
        bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]
        w-full ${sizeClasses[size]} max-h-[85vh] overflow-hidden
        flex flex-col animate-slide-up
    `.trim().replace(/\s+/g, " ");

    if (header) {
        const headerEl = document.createElement("div");
        headerEl.className = "flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]";

        const headerContent = document.createElement("div");
        if (typeof header === "string") {
            const title = document.createElement("h3");
            title.className = "text-lg font-semibold text-[var(--color-text-primary)]";
            title.textContent = header;
            headerContent.appendChild(title);
        } else {
            headerContent.appendChild(header);
        }
        headerEl.appendChild(headerContent);

        if (showCloseButton) {
            const closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.className = "p-1 rounded-md hover:bg-[var(--color-background-muted)] transition-colors";
            closeBtn.setAttribute("aria-label", "Close modal");
            closeBtn.innerHTML = `
                <svg class="w-5 h-5 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            `;
            closeBtn.addEventListener("click", () => closeModal());
            headerEl.appendChild(closeBtn);
        }

        modal.appendChild(headerEl);
    }

    const body = document.createElement("div");
    body.className = "flex-1 overflow-y-auto p-6";
    if (typeof content === "string") {
        body.innerHTML = content;
    } else {
        body.appendChild(content);
    }
    modal.appendChild(body);

    if (footer) {
        const footerEl = document.createElement("div");
        footerEl.className = "px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-background-subtle)]";

        if (typeof footer === "string") {
            footerEl.innerHTML = footer;
        } else {
            footerEl.appendChild(footer);
        }
        modal.appendChild(footerEl);
    }

    backdrop.appendChild(modal);

    let escapeHandler = /** @type {((e: KeyboardEvent) => void) | null} */ (null);
    let backdropHandler = /** @type {(() => void) | null} */ (null);

    /**
     *
     */
    function closeModal() {
        if (escapeHandler) {
            document.removeEventListener("keydown", escapeHandler);
            escapeHandler = null;
        }
        if (backdropHandler) {
            backdrop.removeEventListener("click", backdropHandler);
            backdropHandler = null;
        }
        if (onClose) {
            onClose();
        }
        backdrop.remove();
        document.body.style.overflow = "";
    }

    if (closeOnEscape) {
        escapeHandler = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };
        document.addEventListener("keydown", escapeHandler);
    }

    if (closeOnBackdrop) {
        backdropHandler = (e) => {
            if (e.target === backdrop) {
                closeModal();
            }
        };
        backdrop.addEventListener("click", backdropHandler);
    }

    document.body.style.overflow = "hidden";
    document.body.appendChild(backdrop);

    return {
        backdrop,
        modal,
        close: closeModal,
    };
}

/**
 * Creates a simple confirmation modal
 * @function createConfirmModal
 * @param {string} message - Confirmation message
 * @param {string} [title] - Modal title
 * @param {string} [confirmText] - Confirm button text
 * @param {string} [cancelText] - Cancel button text
 * @param {'primary'|'danger'} [type] - Confirm button type
 * @returns {Promise<boolean>} User's response
 */
export function createConfirmModal(message, title = "Confirm", confirmText = "Confirm", cancelText = "Cancel", type = "primary") {
    return new Promise((resolve) => {
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = confirmText;
        confirmBtn.className = type === "danger"
            ? "px-4 py-2 bg-[var(--color-error)] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            : "px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-opacity-90 transition-colors";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = cancelText;
        cancelBtn.className = "px-4 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-background-muted)] transition-colors";

        const footer = createFlex({
            children: [cancelBtn, confirmBtn],
            justify: "end",
            gap: "3",
        });

        const modal = createModal({
            header: title,
            content: `<p class="text-[var(--color-text-secondary)]">${message}</p>`,
            footer,
            closeOnBackdrop: false,
            closeOnEscape: false,
        });

        confirmBtn.addEventListener("click", () => {
            modal.close();
            resolve(true);
        });

        cancelBtn.addEventListener("click", () => {
            modal.close();
            resolve(false);
        });
    });
}

import DOMPurify from "dompurify";

/**
 * Function to Sanitize the HTML content
 * @param {string} html The risky html
 * @returns {string} html
 */
export function sanitizeHTML(html) {
    return DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
    });
}

// @ts-check

/**
 * @typedef {object} ScrollObserverOptions
 * @property {string} targetSelector - The CSS selector for elements to observe.
 * @property {string} animationClass - The CSS class to add when the element is in view.
 * @property {number} [threshold=0.1] - The visibility threshold for the observer.
 * @property {boolean} [unobserveOnIntersect=true] - Whether to stop observing the element after it has been animated.
 */

/**
 * Applies a CSS class to elements when they scroll into the viewport.
 * @param {ScrollObserverOptions} options - The options for the scroll observer.
 * @returns {() => void | null} The func to disconnect the oberserver
 */
export function createScrollObserver(options) {
    const {
        targetSelector,
        animationClass,
        threshold = 0.1,
        unobserveOnIntersect = true,
    } = options;

    if (!targetSelector || !animationClass) {
        console.error(
            "ScrollObserver: `targetSelector` and `animationClass` are required.",
        );

        return () => null;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animationClass);
                    if (unobserveOnIntersect) {
                        obs.unobserve(entry.target);
                    }
                }
            });
        },
        { threshold },
    );

    const elements = document.querySelectorAll(targetSelector);
    elements.forEach((el) => observer.observe(el));

    return () => {
        observer.disconnect();
    };
}

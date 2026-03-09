// @ts-check

import { createButton } from "../components/Button.js";
import { createSectionHeader } from "../components/SectionHeader.js";
import { router } from "../core/router.js";

/**
 * Creates the 404 Not Found page
 * @async
 * @function NotFoundPage
 * @returns {Promise<HTMLElement>} The not found page element
 */
export async function NotFoundPage() {
    const container = document.createElement("div");
    container.className =
        "flex-1 flex flex-col items-center justify-center text-center p-8";

    const header = createSectionHeader({
        heading: "404 - Page Not Found",
        subheading: "Oops! The page you are looking for does not exist.",
        align: "center",
    });

    const homeButton = createButton({
        text: "Go to Homepage",
        variant: "primary",
        className: "mt-8",
        onClick: () => router.navigate("/"),
    });

    container.appendChild(header);
    container.appendChild(homeButton);

    return container;
}

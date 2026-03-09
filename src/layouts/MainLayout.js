// @ts-check

import { Router } from "../core/router.js";

/**
 * Creates the main application layout
 * @async
 * @returns {Promise<HTMLElement>} The main layout element
 */
export async function MainLayout() {
    const container = document.createElement("div");
    container.className = "flex flex-col min-h-screen bg-background selection:bg-primary selection:text-white";

    //TODO:- Have your componet here for base layout

    const main = document.createElement("main");
    main.className = "flex-1 flex flex-col";
    main.setAttribute(Router.OUTLET_ATTR, "");

    container.appendChild(main);

    return container;
}

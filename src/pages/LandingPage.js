// @ts-check

import { createContainer, createFlex, createGrid, createCard } from "../components/index.js";
import "./styles/landingStyle.css";

/**
 * Open external URL - works in both browser and Tauri
 * @param {string} url - The URL to open
 */
async function openExternalUrl(url) {
    if (window.__TAURI__) {
        const { open } = await import("@tauri-apps/plugin-shell");
        await open(url);
    } else {
        window.open(url, "_blank", "noopener,noreferrer");
    }
}

/**
 * Creates the Vaani landing page - "Get back to your roots"
 * @function createLandingPage
 * @returns {HTMLElement} The landing page element
 */
export function createLandingPage() {
    const style = document.createElement("style");
    document.head.appendChild(style);

    const landing = document.createElement("div");
    landing.className = "vaani-landing";

    const container = createContainer({ children: "", size: "xl", className: "" });

    const hero = document.createElement("div");
    hero.className = "vaani-hero";

    const heroGrid = document.createElement("div");
    heroGrid.className = "vaani-hero-grid";
    hero.appendChild(heroGrid);

    const heroContent = createFlex({
        children: "",
        direction: "col",
        align: "center",
        justify: "center",
        gap: "4 md:gap-6",
        className: "vaani-hero-content py-12 md:py-24 text-center relative px-4",
    });

    const logo = document.createElement("h1");
    logo.className = "vaani-logo";
    logo.innerHTML = "Vaani <span class=\"vaani-logo-accent\">.</span>";

    const tagline = document.createElement("p");
    tagline.className = "vaani-tagline";
    tagline.textContent = "Get back to your roots";

    const subtitle = document.createElement("p");
    subtitle.className = "text-lg mt-4 text-[#7a746d] max-w-xl";
    subtitle.textContent = "A vanilla JavaScript frontend template built from scratch. No frameworks. No bloat. Just pure web development.";

    const ctaButtons = createFlex({
        children: "",
        direction: "row",
        justify: "center",
        gap: "4",
        className: "mt-8 flex-wrap",
    });

    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/BhaumikTalwar/vaani";
    githubLink.className = "vaani-cta-button";
    githubLink.innerHTML = `
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.10-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.10 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
        </svg>
        View on GitHub
    `;
    githubLink.addEventListener("click", (e) => {
        e.preventDefault();
        openExternalUrl("https://github.com/BhaumikTalwar/vaani");
    });

    ctaButtons.appendChild(githubLink);

    heroContent.appendChild(logo);
    heroContent.appendChild(tagline);
    heroContent.appendChild(subtitle);
    heroContent.appendChild(ctaButtons);

    hero.appendChild(heroContent);
    container.appendChild(hero);

    const statsSection = createContainer({ children: "", size: "lg", className: "py-8 md:py-16 px-4" });
    const statsGrid = createGrid({ children: "", cols: 2, responsive: "sm", gap: "4 md:6" });

    const stats = [
        { value: "0", label: "Frameworks" },
        { value: "Low", label: "Bundle Size" },
        { value: "100%", label: "Control" },
        { value: "0%", label: "HeadAche" },
    ];

    stats.forEach((stat) => {
        const statCard = document.createElement("div");
        statCard.className = "vaani-stat-card";
        statCard.innerHTML = `
            <div class="vaani-stat-value">${stat.value}</div>
            <div class="vaani-stat-label">${stat.label}</div>
        `;
        statsGrid.appendChild(statCard);
    });

    statsSection.appendChild(statsGrid);
    container.appendChild(statsSection);

    const featuresSection = createContainer({ children: "", size: "xl", className: "py-8 md:py-16 px-4" });

    const featuresHeader = createFlex({
        children: "",
        direction: "col",
        align: "center",
        justify: "center",
        gap: "2",
        className: "vaani-section-header mb-8 md:mb-12",
    });

    const featuresTitle = document.createElement("h2");
    featuresTitle.className = "vaani-section-title";
    featuresTitle.textContent = "What's Inside";

    const featuresSubtitle = document.createElement("p");
    featuresSubtitle.className = "vaani-section-subtitle";
    featuresSubtitle.textContent = "Everything you need to build modern web applications";

    featuresHeader.appendChild(featuresTitle);
    featuresHeader.appendChild(featuresSubtitle);
    featuresSection.appendChild(featuresHeader);

    const featuresGrid = createGrid({ children: "", cols: 2, responsive: "md", gap: "4 md:6" });

    const featureCards = [
        {
            icon: "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6\"/></svg>",
            title: "Router",
            desc: "SPA routing with guards, layouts, and params. ~2KB gzipped.",
            color: "#c4785a",
        },
        {
            icon: "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4\"/></svg>",
            title: "State",
            desc: "Reactive state with pub/sub, computed values, and batching.",
            color: "#8b9a7d",
        },
        {
            icon: "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z\"/></svg>",
            title: "API Client",
            desc: "HTTP with interceptors, retries, CSRF, and typed errors.",
            color: "#c4785a",
        },
        {
            icon: "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z\"/></svg>",
            title: "TypeScript-like",
            desc: "JSDoc type checking. Catch errors at build time, not runtime.",
            color: "#8b9a7d",
        },
        {
            icon: "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01\"/></svg>",
            title: "TailwindCSS 4",
            desc: "Utility-first CSS with custom design tokens and theming.",
            color: "#c4785a",
        },
        {
            icon: "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4\"/></svg>",
            title: "Components",
            desc: "Reusable UI components. Input, Card, Modal, Alert, and more.",
            color: "#8b9a7d",
        },
        {
            icon: "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z\"/></svg>",
            title: "Vite",
            desc: "Blazing fast dev server. Hot module replacement. Optimized builds.",
            color: "#c4785a",
        },
        {
            icon: "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12h14M12 5l7 7-7 7\"/></svg>",
            title: "Zero Deps",
            desc: "No React, no Vue. Just vanilla JS. You have full control.",
            color: "#8b9a7d",
        },
    ];

    featureCards.forEach((feature) => {
        const card = createCard({
            body: `
                <div class="vaani-feature-icon" style="background: ${feature.color}15; color: ${feature.color}">
                    ${feature.icon}
                </div>
                <h3 class="vaani-feature-title">${feature.title}</h3>
                <p class="vaani-feature-desc">${feature.desc}</p>
            `,
            hoverable: false,
            className: "vaani-feature-card",
        });
        featuresGrid.appendChild(card);
    });

    featuresSection.appendChild(featuresGrid);
    container.appendChild(featuresSection);

    const codeSection = createContainer({ children: "", size: "xl", className: "py-8 md:py-16 px-4 bg-[#f0ebe3] -mx-4 md:mx-0 md:px-4" });

    const codeHeader = createFlex({
        children: "",
        direction: "col",
        align: "center",
        justify: "center",
        gap: "2",
        className: "vaani-section-header mb-8 md:mb-12",
    });

    const codeTitle = document.createElement("h2");
    codeTitle.className = "vaani-section-title";
    codeTitle.textContent = "Familiar Patterns";

    const codeSubtitle = document.createElement("p");
    codeSubtitle.className = "vaani-section-subtitle";
    codeSubtitle.textContent = "Code you'll actually enjoy writing";

    codeHeader.appendChild(codeTitle);
    codeHeader.appendChild(codeSubtitle);
    codeSection.appendChild(codeHeader);

    const codeContainer = document.createElement("div");
    codeContainer.className = "vaani-code-container max-w-3xl mx-auto";

    const codeHeaderBar = document.createElement("div");
    codeHeaderBar.className = "vaani-code-header";
    codeHeaderBar.innerHTML = `
        <span class="vaani-code-dot vaani-code-dot-red"></span>
        <span class="vaani-code-dot vaani-code-dot-yellow"></span>
        <span class="vaani-code-dot vaani-code-dot-green"></span>
        <span class="vaani-code-filename">main.js</span>
    `;
    codeContainer.appendChild(codeHeaderBar);

    const codeBlock = document.createElement("div");
    codeBlock.className = "vaani-code-block";

    const codeLines = [
        { num: 1, content: "<span class='vaani-code-comment'>// Define application routes</span>" },
        { num: 2, content: "<span class='vaani-code-keyword'>router</span>.<span class='vaani-code-function'>addRoute</span>({" },
        { num: 3, content: "  <span class='vaani-code-property'>path</span>: <span class='vaani-code-string'>'/'</span>," },
        { num: 4, content: "  <span class='vaani-code-property'>title</span>: <span class='vaani-code-string'>'Vaani - Get back to your roots'</span>," },
        { num: 5, content: "  <span class='vaani-code-property'>component</span>: <span class='vaani-code-keyword'>async</span> () <span class='vaani-code-operator'>=></span> {" },
        { num: 6, content: "    <span class='vaani-code-keyword'>return</span> <span class='vaani-code-function'>createLandingPage</span>();" },
        { num: 7, content: "  }" },
        { num: 8, content: "});" },
        { num: 9, content: "" },
        { num: 10, content: "<span class='vaani-code-comment'>// Dynamic route example</span>" },
        { num: 11, content: "<span class='vaani-code-keyword'>router</span>.<span class='vaani-code-function'>addRoute</span>({" },
        { num: 12, content: "  <span class='vaani-code-property'>path</span>: <span class='vaani-code-string'>'/users/:id'</span>," },
        { num: 13, content: "  <span class='vaani-code-property'>title</span>: <span class='vaani-code-string'>'User Profile'</span>," },
        { num: 14, content: "  <span class='vaani-code-property'>component</span>: <span class='vaani-code-keyword'>async</span> ({ params }) <span class='vaani-code-operator'>=></span> {" },
        { num: 15, content: "    <span class='vaani-code-keyword'>return</span> <span class='vaani-code-function'>createUserPage</span>(params.id);" },
        { num: 16, content: "  }," },
        { num: 17, content: "  <span class='vaani-code-property'>beforeEnter</span>: <span class='vaani-code-keyword'>async</span> ({ params }) <span class='vaani-code-operator'>=></span> {" },
        { num: 18, content: "    <span class='vaani-code-keyword'>if</span> (!authService.<span class='vaani-code-function'>isLoggedIn</span>()) {" },
        { num: 19, content: "      <span class='vaani-code-keyword'>return</span> <span class='vaani-code-string'>'/'</span>;" },
        { num: 20, content: "    }" },
        { num: 21, content: "  }" },
        { num: 22, content: "});" },
    ];

    codeLines.forEach((line) => {
        const lineEl = document.createElement("div");
        lineEl.className = "vaani-code-line";
        lineEl.innerHTML = `
            <span class="vaani-code-number">${line.num}</span>
            <span class="vaani-code-content">${line.content}</span>
        `;
        codeBlock.appendChild(lineEl);
    });

    codeContainer.appendChild(codeBlock);
    codeSection.appendChild(codeContainer);

    container.appendChild(codeSection);

    const footer = document.createElement("div");
    footer.className = "vaani-footer";
    footer.innerHTML = `
        <div class="text-center text-sm text-[#7a746d]">
            Vaani Template &mdash; Built with vanilla JavaScript
        </div>
    `;

    container.appendChild(footer);

    landing.appendChild(container);

    return landing;
}

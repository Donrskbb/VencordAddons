/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addServerListElement, removeServerListElement, ServerListRenderPosition } from "@api/ServerList";
import { Alerts, useState } from "@webpack/common";
import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin from "@utils/types";
import "./style.css";

function onRestartNeeded() {
    Alerts.show({
        title: "Restart required",
        body: <p>You have enabled BetterGuildList and that requires a restart.</p>,
        confirmText: "Restart now",
        cancelText: "Later!",
        onConfirm: () => location.reload()
    });
}

function offRestartNeeded() {
    Alerts.show({
        title: "Restart required",
        body: <p>You have disabled BetterGuildList and that requires a restart.</p>,
        confirmText: "Restart now",
        cancelText: "Later!",
        onConfirm: () => location.reload()
    });
}


// Expand Button Component
const ExpandButton = () => {
    const [cssLoaded, setCssLoaded] = useState(false);

    const onExpandClick = () => {
        console.log("Expand button clicked!");

        if (!cssLoaded) {
            const link1 = document.createElement("link") as HTMLLinkElement;
            link1.rel = "stylesheet";
            link1.href = "https://raw.githubusercontent.com/Donrskbb/VencordAddons/refs/heads/main/css-snippets/ServerListWidth.css";

            const link2 = document.createElement("link") as HTMLLinkElement;
            link2.rel = "stylesheet";
            link2.href = "https://raw.githubusercontent.com/Donrskbb/VencordAddons/refs/heads/main/css-snippets/ChannelListWidth.css";

            document.head.appendChild(link1);
            document.head.appendChild(link2);

            setCssLoaded(true);
        } else {
            const links = document.querySelectorAll('link[rel="stylesheet"]');
            links.forEach(link => {
                const linkElement = link as HTMLLinkElement;
                if (linkElement.href.includes("ServerListWidth.css") || linkElement.href.includes("ChannelListWidth.css")) {
                    document.head.removeChild(linkElement);
                }
            });
            setCssLoaded(false);
        }

    };

    return (
        <div className={`Background ${cssLoaded ? "expanded" : ""}`}>
            <foreignObject x="0" y="0" width={cssLoaded ? "266" : "48"} height="48">
                <div
                    className={`circleIconButton ${cssLoaded ? "expanded" : ""}`}
                    role="treeitem"
                    data-list-item-id="guildsnav___expand-button"
                    onClick={onExpandClick}
                >
                    <svg
                        className="circleIcon"
                        aria-hidden="true"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d={cssLoaded ?
                                "M20 4L14 10M14 10H17.75M14 10V6.25" :
                                "M12 12L17 7M17 7H13.25M17 7V10.75"}
                            stroke="#23a459"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d={cssLoaded ?
                                "M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" :
                                "M12 12L7 17M7 17H10.75M7 17V13.25"}
                            stroke="#23a459"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {cssLoaded && <span className="buttonText">Collapse</span>}
                </div>
            </foreignObject>
        </div>
    );
};


// Define the plugin
export default definePlugin({
    name: "BetterGuildList",
    description: "Adds an 'Expand' button to the bottom left corner to expand the width of the guild list.",
    authors: [{ name: "Kebab_420", id: 427717508359782400n }],
    dependencies: ["ServerListAPI"],

    renderExpandButton: ErrorBoundary.wrap(ExpandButton, { noop: true }),

    start() {
        if (!Vencord.Plugins.isPluginEnabled(this.name)) {
            onRestartNeeded();
        } else {
            addServerListElement(ServerListRenderPosition.Above, this.renderExpandButton);
        }
    },

    stop() {
        if (Vencord.Plugins.isPluginEnabled(this.name)) {
            offRestartNeeded();
        } else {
            removeServerListElement(ServerListRenderPosition.Above, this.renderExpandButton);
        }
    }
});

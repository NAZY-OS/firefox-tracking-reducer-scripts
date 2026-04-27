// ==UserScript==
// @name         YouTube URL Filter for All Links
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Filters out unwanted URL parameters from YouTube links for enhanced privacy, ignoring playlist links.
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Function to filter URLs by removing specific parameters
    function filterUrls() {
        // Get the current URL and create a new URL object
        let currentUrl = window.location.href;
        let url = new URL(currentUrl);

        // Check if URL is a playlist link
        const isPlaylist = url.pathname.startsWith('/playlist');

        // Remove specific query parameters if the URL is not a playlist
        if (!isPlaylist) {
            url.searchParams.delete('list');
            url.searchParams.delete('pp');
            url.searchParams.delete('start_radio');
            url.searchParams.delete('index');
        }

        // Redirect if necessary
        if (currentUrl !== url.href) {
            window.history.replaceState({}, document.title, url.href);
        }

        // Update all links in the body
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            try {
                let linkUrl = new URL(link.href);

                // Only filter non-playlist links
                if (!linkUrl.pathname.startsWith('/playlist')) {
                    linkUrl.searchParams.delete('list');
                    linkUrl.searchParams.delete('pp');
                    linkUrl.searchParams.delete('start_radio');
                    linkUrl.searchParams.delete('index');
                }

                // Update the link if it has changed
                if (link.href !== linkUrl.href) {
                    link.href = linkUrl.href;
                }
            } catch (e) {
                // Ignore links that are not valid URLs
                console.error('Invalid URL:', link.href);
            }
        });
    }

    // Initial call to filter URLs on page load
    filterUrls();

    // Set up a MutationObserver to monitor changes in the body
    const observer = new MutationObserver(() => {
        filterUrls(); // Call filterUrls when the DOM changes
    });

    // Configuration for the observer, watching for child nodes and subtree changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

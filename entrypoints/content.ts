// src/content.ts

import { defineContentScript } from "wxt/sandbox";
import { distance } from "fastest-levenshtein";
import { siteConfigs } from "../config";

interface ViewedProperty {
  address: string;
  price: number;
}

const MAX_DISTANCE = 5;
const PRICE_THRESHOLD = 5000;

export default defineContentScript({
  matches: ["*://*.zillow.com/*", "*://*.realtor.com/*", "*://*.homes.com/*", "*://*.www.homes.com/*"],
  runAt: "document_start",
  main() {
    console.log("Content script injected!");

    const hostname = location.hostname;
    const siteConfig = siteConfigs[hostname];

    if (!siteConfig) {
      console.log(`No site configuration found for ${hostname}`);
      return "";
    }

    const { listingSelector, linkSelector, getAddressFromListing, getPriceFromListing } = siteConfig;

    // Normalize address function
    function normalizeAddress(address: string): string {
      return address.toLowerCase().replace(/\s+/g, " ").trim();
    }

    // Function to handle clicks on listings
    function handleClick(event: Event) {
      const target = event.target as HTMLElement;
      const listing = target.closest<Element>(listingSelector);

      if (listing) {
        const address = getAddressFromListing(listing);
        const price = getPriceFromListing(listing);

        if (address && price !== null) {
          const normalizedAddress = normalizeAddress(address);
          console.log(`Listing clicked: ${normalizedAddress}, Price: ${price}`);

          // Store the viewed property
          chrome.storage.local.get("viewedProperties", (data) => {
            const viewedProperties: ViewedProperty[] =
              data.viewedProperties || [];

            // Check if the property is already stored
            const isAlreadyStored = viewedProperties.some((property) => {
              const levenshteinDistance = distance(
                property.address,
                normalizedAddress
              );
              return (
                levenshteinDistance <= MAX_DISTANCE &&
                Math.abs(property.price - price) <= PRICE_THRESHOLD
              );
            });

            if (!isAlreadyStored) {
              viewedProperties.push({ address: normalizedAddress, price });
              chrome.storage.local.set({ viewedProperties });
            }
          });
        }
      }
    }

    // Function to apply opacity to viewed listings
    function applyOpacity() {
      chrome.storage.local.get("viewedProperties", (data) => {
        const viewedProperties: ViewedProperty[] = data.viewedProperties || [];
        if (viewedProperties.length === 0) {
          return;
        }

        // Select all listing elements
        const listings = document.querySelectorAll<Element>(listingSelector);

        listings.forEach((listing) => {
          const address = getAddressFromListing(listing);
          const price = getPriceFromListing(listing);

          if (address && price !== null) {
            const normalizedAddress = normalizeAddress(address);

            const isViewed = viewedProperties.some((property) => {
              const levenshteinDistance = distance(
                property.address,
                normalizedAddress
              );
              return (
                levenshteinDistance <= MAX_DISTANCE &&
                Math.abs(property.price - price) <= PRICE_THRESHOLD
              );
            });

            if (isViewed) {
              // Apply opacity
              const listingElement = listing as HTMLElement;
              listingElement.style.opacity = "0.5";
            }
          }
        });
      });
    }

    // Add event listener to the document
    document.addEventListener("click", handleClick);

    // Apply opacity when the DOM is fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyOpacity);
    } else {
      applyOpacity();
    }

    // Observe for changes in the DOM (for dynamically loaded content)
    const observer = new MutationObserver(() => {
      applyOpacity();
    });

    // Start observing only when the body is available
    function startObserving() {
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        // If body is not available, retry after a short delay
        setTimeout(startObserving, 100);
      }
    }

    startObserving();
  },
});

import { SiteConfig } from "../../index";

export const usConfig: { [hostname: string]: SiteConfig } = {
  "www.zillow.com": {
    listingSelector: '[class^="ListItem"], [class^="Cardstyles__StyledCard"]',
    linkSelector: 'a[href*="/homedetails/"]',
    getAddressFromListing: (listing) => {
      const addressElement = listing.querySelector("address");
      return addressElement
        ? addressElement.textContent?.trim() || null
        : null;
    },
    getPriceFromListing: (listing) => {
      const priceElement = listing.querySelector('div[class*="PropertyCardWrapper__StyledPriceGridContainer"] span[data-test="property-card-price"]');
      return priceElement
        ? parseInt(priceElement.textContent?.replace(/[$,]/g, "") ?? "0") || null
        : null;
    },
  },
  "www.realtor.com": {
    listingSelector: '[data-testid="rdc-property-card"]',
    linkSelector: 'a[href*="/realestateandhomes-detail/"]',
    getAddressFromListing: (listing) => {
      const addressElement = listing.querySelector(".card-address");
      return addressElement
        ? addressElement.textContent?.trim() || null
        : null;
    },
    getPriceFromListing: (listing) => {
      const priceElement = listing.querySelector('div[data-testid="card-price"] span');
      return priceElement
        ? parseInt(priceElement.textContent?.replace(/[$,]/g, "") ?? "0") ||
            null
        : null;
    },
  },
  "www.homes.com": {
    listingSelector: 'article.search-placard',
    linkSelector: 'a[href*="/property/"]',
    getAddressFromListing: (listing) => {
      const addressElement = listing.querySelector('address');
      return addressElement
        ? addressElement.textContent?.trim() || null
        : null;
    },
    getPriceFromListing: (listing) => {
      const priceElement = listing.querySelector('.price-container');
      return priceElement
        ? parseInt(priceElement.textContent?.replace(/[$,]/g, "") ?? "0") || null
        : null;
    },
  },
};

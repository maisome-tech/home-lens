import { usConfig} from './portals/us/us-config';

// Import other country configs here as needed
// import { ukConfig } from './portals/uk/uk-config';
// import { caConfig } from './portals/ca/ca-config';

export const siteConfigs = {
  ...usConfig,
  // Add other country configs here as needed
  // ...ukConfig,
  // ...caConfig,
};

export interface SiteConfig {
  listingSelector: string;
  linkSelector: string;
  getAddressFromListing: (listingElement: Element) => string | null;
  getPriceFromListing: (listingElement: Element) => number | null;
}
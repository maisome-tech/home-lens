export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
      message.action === "injectCSS" &&
      sender.tab &&
      sender.tab.id !== undefined
    ) {
      const cssCode = `
      /* CSS to set opacity on listing cards */
      [class^="ListItem"],
      .StyledListCardWrapper-srp-8-105-0__sc-wtsrtn-0,
      .gpgmwS,
      .cXzrsE {
        opacity: 0.5 !important;
      }
    `;

      browser.scripting.insertCSS(
        {
          target: { tabId: sender.tab.id },
          css: cssCode,
        }
      );
    }
  });
});

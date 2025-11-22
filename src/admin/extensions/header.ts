export const overrideAdminTitle = () => {
    const NEW_TITLE = "Meraab Admin";
  
    // Set title immediately
    document.title = NEW_TITLE;
  
    // Watch for ANY changes to the <title> element
    const titleElement = document.querySelector("title");
  
    if (!titleElement) return;
  
    const observer = new MutationObserver(() => {
      // Anytime Strapi tries to change title, override it
      if (document.title !== NEW_TITLE) {
        document.title = NEW_TITLE;
      }
    });
  
    observer.observe(titleElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
};
  
# Instructions

* Start course
* Ctrl+Shift+I
    * Better: right click on an element you might interact with and click "inspect"
* Go to Console Tab
* Paste JS code
* Run stopLoop() to stop


# Tips
Sometimes elements aren't found, so right click and "inspect" the element initially then paste the code in.

# Mutation - to deal with elements not being found

    const keepTryingPatterns = [/mod.*_carousel/, /Dont_reveal_close/, /do_reveal_close/];
    const resetPatterns = [/Begin_btn/, /Reset_btn/, /next/, /Next_btn/, /continue/];
    const tryOncePerResetPatterns = [/mod.*_ctr.*_button/];

    const handleNewElement = (element) => {
      const className = element.className;

      if (keepTryingPatterns.some((pattern) => pattern.test(className))) {
        // Handle 'keep_trying_btns' elements
        console.log('New keep_trying_btns element:', element);
      } else if (resetPatterns.some((pattern) => pattern.test(className))) {
        // Handle 'reset_btns' elements
        console.log('New reset_btns element:', element);
      } else if (tryOncePerResetPatterns.some((pattern) => pattern.test(className))) {
        // Handle 'try_once_per_reset_btn' elements
        console.log('New try_once_per_reset_btn element:', element);
      }
    };

    const handleMutations = (mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              handleNewElement(node);
            }
          });
        }
      });
    };

    const initMutationObserver = () => {
      const observerOptions = {
        childList: true,
        subtree: true,
      };

      const observer = new MutationObserver(handleMutations);
      observer.observe(document.body, observerOptions);
    };

    initMutationObserver(); // Initialize the MutationObserver to handle newly loaded elements



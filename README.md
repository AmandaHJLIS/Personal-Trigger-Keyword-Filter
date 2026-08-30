# Personal Trigger Keyword Filter

Keyword Filter for PTSD and other conditions.

## Setup

### 1. Install a userscript manager

This script requires a userscript manager to run in your browser.

Recommended options:

* **Tampermonkey** — available for Chrome, Edge, Firefox, and other browsers
* **Violentmonkey** — an open-source alternative

### 2. Install the script

1. Install one of the userscript managers above.
2. Open the `personal-trigger-filter.user.js` file from this repository.
3. Copy the contents of the file.
4. Create a new userscript in Tampermonkey or Violentmonkey.
5. Replace the default code with the contents of `personal-trigger-filter.user.js`.
6. Save the userscript.

The filter should now run automatically on websites matching its configuration.

### 3. Configure your trigger keywords

The filter includes a **⚙ Filter** button in the bottom-right corner of webpages.

Click it to open the settings panel.

Enter your trigger keywords with **one keyword or phrase per line**, then click **Save**.

For example:

```text
trigger word
another phrase
example keyword
```

The filter also supports regular expressions if you enter them in `/pattern/` format.

### 4. How the filter works

When a configured keyword is detected on a webpage:

* The page is blurred.
* A content warning is displayed.
* The detected keywords are shown.
* You can choose **View Anyway** to temporarily disable the warning for the current page.
* **Settings** allows you to edit your keyword list.

The filter also monitors dynamically loaded content, making it suitable for websites that use single-page navigation or load content without refreshing the page.

### Important

This is a **personal safety/content-filtering tool**, not a guaranteed blocker. Websites may load content in ways the script cannot detect, and determined users can bypass the warning.

Use it as an additional layer of protection rather than relying on it as your only safeguard.

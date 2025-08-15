# Instructions for Setting Up a Single GitHub Repository for Trinkets

This document outlines the steps to set up a single GitHub repository that hosts both your `trinkets.json` manifest and all your individual trinket applications. In the context of this application, a **trinket** is a small, self-contained web application (typically an `index.html` file with associated CSS, JavaScript, and assets) that runs within an `<iframe>` inside the main Electron application. This approach simplifies management for a collection of related trinkets.

## 1. Repository Setup

1.  **Create a New GitHub Repository:**
    *   Go to GitHub and create a new public repository (e.g., `my-trinkets-collection`).
    *   Initialize it with a `README.md`.
2.  **Clone the Repository:**
    *   Clone this new repository to your local development machine:
        ```bash
        git clone https://github.com/your-username/my-trinkets-collection.git
        cd my-trinkets-collection
        ```

## 2. Create Your Trinket Applications

For each trinket you want to include:

1.  **Create a Dedicated Folder:**
    *   Inside your `my-trinkets-collection` repository, create a new folder for each trinket (e.g., `trinket-one/`, `trinket-two/`, `trinket-three/`).
    ```
    my-trinkets-collection/
    ├── trinket-one/
    ├── trinket-two/
    └── trinket-three/
    ```
2.  **Develop Your Trinket Content:**
    *   Inside each trinket folder, create the following files. These files will constitute your trinket application.

    *   **Required File: `index.html`**
        This is the entry point for your trinket. An LLM should generate the content for this file based on the trinket's purpose.

        Example `trinket-one/index.html` template:
        ```html
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>My Trinket Title</title>
            <!-- Link to your CSS file if you have one -->
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <h1>Welcome to My Trinket!</h1>
            <p>This is the content of my trinket.</p>
            <!-- Link to your JavaScript file if you have one -->
            <script src="script.js"></script>
        </body>
        </html>
        ```

    *   **Optional File: `style.css`**
        If your trinket requires styling, create a `style.css` file in the same folder as `index.html`.

        Example `trinket-one/style.css` template:
        ```css
        body {
            font-family: sans-serif;
            background-color: #f0f0f0;
            color: #333;
            padding: 20px;
        }
        h1 {
            color: #007bff;
        }
        ```

    *   **Optional File: `script.js`**
        If your trinket requires dynamic behavior, create a `script.js` file in the same folder as `index.html`.

        Example `trinket-one/script.js` template:
        ```javascript
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Trinket script loaded!');
            // Add your trinket's JavaScript logic here
        });
        ```

    *   **Trinket Logging (from within your trinket):**
        Your trinket can send log messages to the main Electron application's logger. This is useful for debugging and monitoring your trinket's behavior.

        To send a log message, include the following JavaScript function in your trinket's `script.js` or directly in its `index.html`:

        ```javascript
        function logTrinketMessage(level, message) {
          if (window.parent) {
            // IMPORTANT: Always specify the targetOrigin for security.
            // The main Electron app's renderer process expects the trinket's own origin.
            window.parent.postMessage({
              type: 'trinket-log', // A custom type to identify our log messages
              level: level,       // 'info', 'warn', 'error'
              message: message
            }, window.location.origin); // Use the trinket's own origin
          }
        }
        ```

        **Example Usage within your Trinket:**
        ```javascript
        // Log an informational message
        logTrinketMessage('info', 'Trinket initialized successfully!');

        // Log a warning
        logTrinketMessage('warn', 'Something unusual happened in the trinket.');

        // Log an error
        logTrinketMessage('error', 'An error occurred in the trinket!');
        ```

    *   **Other Optional Files:** You can include images, fonts, or any other assets your trinket needs within this folder.

## 3. Create the `trinkets.json` Manifest

1.  **Create `trinkets.json`:**
    *   At the root of your `my-trinkets-collection` repository, create a file named `trinkets.json`.
2.  **Populate the Manifest:**
    *   This file will be a JSON array, where each object represents a trinket. Crucially, the `appUrl` for *all* trinkets will point to your `my-trinkets-collection` repository itself.
    *   The `entryFile` will specify the path to the trinket's `index.html` *within* this repository.
    *   **Important:** You will need to calculate the `hash` for each trinket package (see next step).

    Example `trinkets.json`:
    ```json
    [
      {
        "id": "trinket-one",
        "name": "My First Trinket",
        "iconUrl": "https://raw.githubusercontent.com/your-username/my-trinkets-collection/main/trinket-one/icon.png",
        "appUrl": "https://github.com/your-username/my-trinkets-collection",
        "ref": "main",
        "entryFile": "trinket-one/index.html",
        "hash": "<SHA256_HASH_OF_TRINKET_ONE_ZIP_PACKAGE>"
      },
      {
        "id": "trinket-two",
        "name": "My Second Trinket",
        "iconUrl": "https://raw.githubusercontent.com/your-username/my-trinkets-collection/main/trinket-two/icon.png",
        "appUrl": "https://github.com/your-username/my-trinkets-collection",
        "ref": "main",
        "entryFile": "trinket-two/index.html",
        "hash": "<SHA256_HASH_OF_TRINKET_TWO_ZIP_PACKAGE>"
      },
      {
        "id": "trinket-three",
        "name": "My Third Trinket",
        "iconUrl": "https://raw.githubusercontent.com/your-username/my-trinkets-collection/main/trinket-three/icon.png",
        "appUrl": "https://github.com/your-username/my-trinkets-collection",
        "ref": "main",
        "entryFile": "trinket-three/index.html",
        "hash": "<SHA256_HASH_OF_TRINKET_THREE_ZIP_PACKAGE>"
      }
    ]
    ```
    *   **Replace `your-username` with your actual GitHub username.**
    *   **Replace `<SHA256_HASH_OF_...>` with the actual hashes you generate.**

## 4. Generate Trinket Package Hashes (SHA256)

The `hash` property is crucial for integrity verification. It must be the SHA256 checksum of the **entire zipped trinket package** (the `.zip` file that the Electron application will download).

**Steps to Generate the Hash:**
1.  **Create a Zip Archive of your Trinket:**
    *   Ensure your trinket's content (e.g., `index.html`, `style.css`, `script.js`, assets) is in a dedicated folder (e.g., `trinket-one/`).
    *   Create a `.zip` archive of this entire folder. The exact method depends on your OS (e.g., right-click -> Send to -> Compressed (zipped) folder on Windows, `zip -r trinket-one.zip trinket-one/` on Linux/macOS).
    *   **Important:** The `.zip` file you hash should ideally be the *exact* `.zip` that GitHub would generate for your repository at the specified `ref`. The easiest way to get this is to download the zipball directly from GitHub (e.g., `https://github.com/your-username/my-trinkets-collection/archive/refs/heads/main.zip` or `.../refs/tags/v1.0.0.zip`).

2.  **Calculate the SHA256 Hash of the `.zip` file:**

**Method 1: Using `sha256sum` (Linux/macOS/Git Bash):
**Navigate to your `my-trinkets-collection` repository on your local machine and run for each trinket's `.zip` file:

```bash
sha256sum trinket-one.zip | awk '{print $1}'
sha256sum trinket-two.zip | awk '{print $1}'
sha256sum trinket-three.zip | awk '{print $1}'
# ... and so on for all your trinkets
```

**Method 2: Using Node.js Script:**

You can use a simple Node.js script to calculate the hash of a file. Save this as `generate-hash.js` in a convenient location (e.g., outside your `my-trinkets-collection` repo, or in a `scripts/` folder within it):

```javascript
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const filePath = process.argv[2]; // Get file path from command line argument

if (!filePath) {
  console.error('Usage: node generate-hash.js <path_to_file>');
  process.exit(1);
}

const hash = crypto.createHash('sha256');
const stream = fs.createReadStream(filePath);

stream.on('data', (chunk) => {
  hash.update(chunk);
});

stream.on('end', () => {
  console.log(hash.digest('hex'));
});

stream.on('error', (err) => {
  console.error(`Error reading file: ${err.message}`);
  process.exit(1);
});
```

Then run it from your terminal for each trinket's `.zip` file (adjust paths as necessary):

```bash
node generate-hash.js trinket-one.zip
node generate-hash.js trinket-two.zip
node generate-hash.js trinket-three.zip
# ... and so on
```

**Copy the generated hashes** and paste them into your `trinkets.json` file.

## 5. Push Your Changes to GitHub

Commit and push all your changes (trinket folders, `trinkets.json`) to your `my-trinkets-collection` GitHub repository:

```bash
git add .
git commit -m "Add trinkets and manifest"
git push origin main
```

## 6. Update Your Electron Application

1.  **Locate `TrinketManager.js`:**
    *   Open the `TrinketManager.js` file in your Electron application's codebase.
2.  **Update `GITHUB_MANIFEST_URL`:**
    *   Find the `GITHUB_MANIFEST_URL` constant and update it to point to the raw content URL of your `trinkets.json` file in your `my-trinkets-collection` repository.

    ```javascript
    const GITHUB_MANIFEST_URL = 'https://raw.githubusercontent.com/your-username/my-trinkets-collection/main/trinkets.json';
    ```
    *   **Replace `your-username` with your actual GitHub username.**

## 7. Test Your Setup

1.  **Install Dependencies (if needed):**
    ```bash
    npm install
    ```
2.  **Run the Application in Production Mode:**
    ```bash
    npm start
    ```
3.  **Verify:**
    *   The application should launch and fetch the `trinkets.json` manifest from your GitHub repository.
    *   It will then download, cache, and verify the integrity of each trinket based on the `hash`.
    *   You should see your trinkets displayed in the application grid.
    *   Check the application logs (`app.log`) for any download or hash verification errors.

This setup allows you to manage all your trinkets and their manifest within a single, cohesive GitHub repository. Good luck!
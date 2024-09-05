# Installation Instructions

This document provides instructions for installing the Web Extension on various browsers.

## Mozilla Firefox 🔥

1. **Download the extension package**: Clone the project and run `bun run build`. The package will be created in `build/` directory.
2. **Open Mozilla Firefox and navigate to about:debugging**: Enter `about:debugging` in the address bar of Firefox and press Enter.
3. **Load the extension**: Click on the "This Firefox" button in the upper right corner of the screen, then select "Load Temporary Add-on..." from the dropdown menu.
4. **Select the extension package**: Navigate to the folder where you downloaded the extension package and select the `manifest.json` file.
5. **Confirm installation**: You should now see the extension added to the list of installed extensions.

## Google Chrome 🌐

1. **Download the extension package**: Clone the project and run `bun run build`. The package will be created in `build/` directory.
2. **Open Google Chrome and navigate to chrome://extensions**: Enter `chrome://extensions` in the address bar of Chrome and press Enter.
3. **Enable Developer Mode**: Toggle the switch in the upper right corner of the screen to enable Developer Mode.
4. **Load the extension**: Click on the "Load unpacked" button in the upper left corner of the screen.
5. **Select the extension package**: Navigate to the folder where you downloaded the extension package and select it.
6. **Confirm installation**: You should now see the extension added to the list of installed extensions.

## Microsoft Edge 🌊

1. **Download the extension package**: Clone the project and run `bun run build`. The package will be created in `build/` directory.
2. **Open Microsoft Edge and navigate to edge://extensions/**: Enter `edge://extensions/` in the address bar of Edge and press Enter.
3. **Enable Developer Mode**: Toggle the switch in the lower left corner of the screen to enable Developer Mode.
4. **Load the extension**: Click on the "Load unpacked" button in the lower left corner of the screen.
5. **Select the extension package**: Navigate to the folder where you downloaded the extension package and select it.
6. **Confirm installation**: You should now see the extension added to the list of installed extensions.

## Usage Instructions

Once the extension is installed, you can start using it immediately. Open any google form link in the browser and check the magic of docFiller auto-filling all forms by default. The specific functionality of the extension will depend on its purpose, so please refer to its documentation for more information.

## Implementation Status

| **QType**                            | **detectBoxType** | **questionExtractorEngine** | **FieldExtractorEngine** | **promptEngine** | **gptEngine** | **parserEngine** | **fillerEngine** |
| ------------------------------------ | ----------------- | --------------------------- | ------------------------ | ---------------- | ------------- | ---------------- | ---------------- |
| DROPDOWN                             | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| TEXT                                 | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| PARAGRAPH                            | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| TEXT_EMAIL                           | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| TEXT_URL                             | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| MULTI_CORRECT                        | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| MULTI_CORRECT_WITH_OTHER             | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| MULTIPLE_CHOICE                      | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| MULTIPLE_CHOICE_WITH_OTHER           | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| MULTIPLE_CHOICE_GRID                 | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| CHECKBOX_GRID                        | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| DATE                                 | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| DATE_AND_TIME                        | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| TIME                                 | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| DURATION                             | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| DATE_WITHOUT_YEAR                    | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| DATE_TIME_WITHOUT_YEAR               | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |
| DATE_TIME_WITH_MERIDIEM              | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ❌               |
| TIME_WITH_MERIDIEM                   | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ❌               |
| DATE_TIME_WITH_MERIDIEM_WITHOUT_YEAR | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ❌               |
| LINEAR_SCALE                         | ✅                | ✅                          | ✅                       | ✅               | ❌            | ❌               | ✅               |

**Legend:**

- ✅ = Supported
- ❌ = Not Implemented yet

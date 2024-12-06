# Changelog

## v1.1.0 (2024-12-06)

- **Fix**: Now `docFiller` doesn't fill on editable Google Forms as well.
- Remove unused dependencies from `package.json`
- Updated dependencies to their latest version.
- Squashed major bugs (skipping 2~3 initial forms while filling).

- feat: docfiller now supports enable/disable as well with custom fill button if disabled.
- feat: docFiller now also supports custom profiles as well, to improve the prompt and make it sound more natural.
- feat: We have improved the UI of docFiller popup to make it more helpful for naive users.
- From now on if you don't have API keys filled in popup will warn you to fill in.
- API key is now hidden by default for enhanced security and privacy!

What to expect in future?
As docFiller moves more towards stability, we want to focus more on improving UI/UX and prompts as well. One of the requested features, we acknowledge was to not fill the forms that has been manually/automatically filled earlier, to save costs and time, but it might take some time to see it in docFiller yet as it requires some arch changes.

## v1.0.2 (2024-11-19)

- **Fix**: Improved UX.
- **Added**: Terms of Use and Privacy Policy in the extension.
- **Added**: Links to fetch API keys for different AI platforms.

## v1.0.1 (2024-11-19)

- **Fix**: Resolved issue where Multiple Choice Zod validation failed.

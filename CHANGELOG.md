# Changelog

## v0.0.7-test (2024-12-25)

- Last Christmas I gave you my Heart
- This Chirstmas you are not even here

## v1.3.1 [Unreleased] (last updated on 2024-12-23)

- Dark Theme (enabled by default)
- fix: TIME and TIME_WITH_MERIDIEM fields parsing errors.

## v1.3.0 (2024-12-17)

- Added: Metric functionality for tracking form completion statistics
- New: (Magic Profile)'Codon' profile with automatic system prompt selection based on form context
- Enhanced: Form analysis and response generation
- fix: issue with API key not being reset after erase.
- feat: improve dropdown handling
- feat: skip marked questions
- chore: improved password input toggles
- feat: toast notification, instead of JS prompts

## v1.2.0 (2024-12-08)

- Change bundler from **bun** to [esbuild](https://esbuild.github.io).
- fix: UI default cases due to wrong use of `||` instead of `??`. (caused enable/disable button to be always enabled in spite of internal values).
- fix: missing Get API Links in Consensus enabled fields in options page.
- fix issues with Time and Duration fields (see more in #58, #59)
- fix: permission issue causing extension to skip running on first load

## v1.1.2 (2024-12-07)

Same as v1.1.1, re-released due to issue in Firefox AMO registry.

## v1.1.1 (2024-12-07)

- Added pirate profile as new built-in profile
- feat: Edit custom profile
- Improved system prompts for builtin prompts

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

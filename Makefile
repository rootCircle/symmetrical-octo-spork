lint:
	bun lint

format:
	bun format:check

tsc:
	bun typecheck

build-firefox:
	bun run build:firefox

build-chromium:
	bun run build:chromium

spell:
	bun run spell

webext:
	bun run webext:lint

precommit:
	bun run precommit
 
.PHONY: lint format tsc build webext precommit

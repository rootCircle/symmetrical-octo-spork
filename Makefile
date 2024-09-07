lint:
	bun lint

format:
	bun format:check

tsc:
	bun tsc

build:
	bun run build

spell:
	bun run spell

webext:
	bun run webext:lint

precommit:
	bun run precommit
 
.PHONY: lint format tsc build webext precommit

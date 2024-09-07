lint:
	bun lint

format:
	bun format:check

tsccheck:
	bun tsc

build:
	bun run build

webext:
	bun run webext:lint

precommit: tsccheck lint format build webext
 
.PHONY: lint format tsccheck build webext
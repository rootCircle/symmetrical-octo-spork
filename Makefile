lint:
	bun lint

format:
	bun format

tsccheck:
	bun tsc

build:
	bun run build

webext:
	bun run webext:lint

precommit: tsccheck lint webext format build
 
.PHONY: lint format tsccheck build webext
.PHONY: build
# build all
build: build-functions build-client

# backend
.PHONY: build-api
build-api:
	env GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ./api/bin/example ./api/main.go

# for netlify functions
.PHONY: build-functions
build-functions: clean build-api
	mkdir -p functions
	mv ./api/bin/example functions

.PHONY: clean
clean:
	rm -rf ./api/bin
	rm -rf ./functions

.PHONY: build-client
build-client:
	npm run-script build

.PHONY: run-client
run-client:
	npm start

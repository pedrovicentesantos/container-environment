install:
	npm ci

lint:
	npm run lint

test: 
	docker-compose up -d mongodb redis
	npm run test:cover
	docker-compose down

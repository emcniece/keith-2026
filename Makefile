.PHONY: deploy

deploy:
	./deploy.sh --upload
	rm -rf upload-to-nb/*
	git rev-parse HEAD > .last-deploy-sha

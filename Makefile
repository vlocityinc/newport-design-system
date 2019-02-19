# Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
# Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

DEPLOY_FOLDER = .dist

# If version info exists in local branch use that else use one from
# vloc_release
LOCAL_MAJOR_VERSION = $(shell grep 'MAJOR_VERSION' package.json | awk -F":" '{print $$2}' | sed -e 's/[ ",]*//g')
LOCAL_MINOR_VERSION = $(shell grep 'MINOR_VERSION' package.json | awk -F":" '{print $$2}' | sed -e 's/[ ",]*//g')
LOCAL_PATCH_VERSION = $(shell grep 'PATCH_VERSION' package.json | awk -F":" '{print $$2}' | sed -e 's/[ ",]*//g')

ifneq ($(LOCAL_MAJOR_VERSION),)
	PKG_MAJOR_VERSION=$(LOCAL_MAJOR_VERSION)
endif
ifneq ($(LOCAL_MINOR_VERSION),)
	PKG_MINOR_VERSION=$(LOCAL_MINOR_VERSION)
endif
ifneq ($(LOCAL_PATCH_VERSION),)
	PKG_PATCH_VERSION=$(LOCAL_PATCH_VERSION)
endif

COMPONENT_REPO = vlocity-public
COMPONENT_VERSION = $(PKG_MAJOR_VERSION).$(PKG_MINOR_VERSION).$(PKG_PATCH_VERSION)
COMPONENT_DESC = Newport Design System

updatedependencies:
	@echo "How to add or remove npm dependencies:"
	@echo "https://github.com/salesforce-ux/design-system-internal/wiki/How-to-install-or-remove-npm-dependencies"
	npm cache clear
	rm -Rf node_modules
	# Remove this next line when this issue is fixed:
	# https://github.com/dequelabs/axe-webdriverjs/issues/17
	npm install axe-core@^2.0.7
	npm install
	npm run build
	npm test
	git add package.json
	@echo "Dependency tree updated!"
	@echo "To commit, type: git commit -m 'Update dependencies'"

$(DEPLOY_FOLDER):
	@npm run build && npm run dist

publish: $(DEPLOY_FOLDER)
	@[[ -z "$(AUTH)" ]] && { echo "This target should be used in Jenkins! Specify AUTH variable to make. Eg. AUTH=<token> make <target>"; exit 1; } || exit 0;
	@cp LICENSE.txt $(DEPLOY_FOLDER)/
	@cp LICENSE-font.txt $(DEPLOY_FOLDER)/
	@cp LICENSE-icons-images.txt $(DEPLOY_FOLDER)/
	@cp package.json $(DEPLOY_FOLDER)/
	@sed -e "s/%AUTH%/$(AUTH)/g" \
		  < .npmrc \
		  > $(DEPLOY_FOLDER)/.npmrc
	@cp .yarnrc $(DEPLOY_FOLDER)/.yarnrc
	@echo "Deploying to vlocity npm repo newport-design-system: $(PKG_MAJOR_VERSION).$(PKG_MINOR_VERSION).$(PKG_PATCH_VERSION)"
	@cd $(DEPLOY_FOLDER) && yarn publish  --verbose --non-interactive

.PHONY: publish updatedependencies

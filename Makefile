#
# auth0-blog Makefile
#

build_deb: bundle build_pages check-version-variable check-deb-variables
	#
	# Accepted variables to be passed
	# WORKSPACE , GIT_URL , VERSION_NUMBER , GIT_BRANCH , GIT_COMMIT
	#

	fpm -C $(WORKSPACE) --deb-user www-data --deb-group www-data \
	--prefix /opt/auth0 \
 	--url ' $(GIT_URL)' --version $(VERSION_NUMBER) -n auth0-blog \
	-x '**/.git*' -x '*.tgz' -x '**/test/*' \
	--description 'Auth0 Blog $(VERSION_NUMBER) - git commit $(GIT_BRANCH)-$(GIT_COMMIT)' \
	-t deb -s dir auth0-blog

	git checkout .

build_pages:
	jekyll build --destination auth0-blog --trace

check-version-variable:
ifndef VERSION_NUMBER
	$(error VERSION_NUMBER is undefined)
endif

check-deb-variables:
ifndef WORKSPACE
	$(error WORKSPACE is undefined)
endif

bundle:
	gem uninstall psych -v 2.0.17
	gem list
	gem install bundler
	bundle install

#
# auth0-blog Makefile
#

build_deb: check-fpm-installed check-version-variable check-deb-variables
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

check-version-variable:
ifndef VERSION_NUMBER
	$(error VERSION_NUMBER is undefined)
endif

check-deb-variables:
ifndef WORKSPACE
	$(error WORKSPACE is undefined)
endif

check-fpm-installed:
	@command -v fpm >/dev/null 2>&1 || { echo >&2 "fpm required to build DEBs but not installed"; \
	echo >&2 "Install with: \n $ sudo apt-get install ruby-dev gcc && sudo gem install fpm"; \
	echo >&2 "Aborting"; exit 1; }

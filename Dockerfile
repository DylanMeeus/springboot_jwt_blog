FROM jfromaniello/jekyll

EXPOSE 80

# install nodejs, npm and git
RUN \
  apt-get update && \
  apt-get install -y nginx nodejs npm git git-core  # 2016-01-25

# Set up nginx as no-daemon
RUN \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx

ADD nginx.conf /etc/nginx/nginx.conf

# install gems
RUN gem install jekyll -v 2.4.0
RUN gem install psych -v 2.0.5
RUN gem install rdiscount -v 2.1.7.1
RUN gem install stringex -v  2.5.2
RUN gem install stylus -v  1.0.1

ADD . /data
WORKDIR /data

ENV JEKYLL_ENV production

RUN jekyll build

CMD ["/usr/sbin/nginx", "-c", "/etc/nginx/nginx.conf"]

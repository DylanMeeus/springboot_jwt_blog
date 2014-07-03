FROM jfromaniello/jekyll

ADD . /data

WORKDIR /data

RUN bundle install
RUN jekyll build

RUN \
  apt-get update && \
  apt-get install -y nginx && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx

ADD nginx.conf /etc/nginx/nginx.conf

CMD /usr/sbin/nginx -c /etc/nginx/nginx.conf

EXPOSE 80
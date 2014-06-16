FROM jfromaniello/jekyll

ADD . /data
WORKDIR /data

RUN bundle install

ENV PORT 5000

CMD jekyll serve --port $PORT
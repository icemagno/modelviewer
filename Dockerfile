FROM openjdk:21-jdk
MAINTAINER magno.mabreu@gmail.com
COPY ./target/modelviewer-1.0.war /opt/lib/
RUN mkdir /modelviewer
ENTRYPOINT ["java"]
ENV LANG=pt_BR.utf8 
CMD ["-jar", "/opt/lib/modelviewer-1.0.war"]
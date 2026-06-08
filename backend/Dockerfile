# =====================================================================
# GeoSnap backend — multi-stage Docker build
#
# Stage 1 ("build"): use Maven to compile the code and produce the WAR.
# Stage 2 ("run"):   copy ONLY that WAR into a Tomcat image and run it.
#
# Multi-stage keeps the final image small: Maven and the source code stay
# in stage 1 and are thrown away; the runtime image only has Tomcat + the WAR.
# =====================================================================

# ---------- Stage 1: build the WAR ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom first and pre-download dependencies.
# (Docker caches this layer, so dependencies aren't re-downloaded
#  every time only the source code changes — faster rebuilds.)
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Now copy the source and build. Result: /app/target/api-backend.war
COPY src ./src
RUN mvn -q clean package


# ---------- Stage 2: run on Tomcat ----------
FROM tomcat:11.0-jre21-temurin

# Start from a clean Tomcat (remove the default sample webapps).
RUN rm -rf /usr/local/tomcat/webapps/*

# Deploy our WAR. Keeping the name "api-backend" means the app is served at
# /api-backend (same context path as local dev), so the API stays:
#   https://<your-host>/api-backend/api/upload
COPY --from=build /app/target/api-backend.war /usr/local/tomcat/webapps/api-backend.war

# Hosts like Render/Railway inject the port to use via the PORT env variable.
# Tomcat normally hard-codes 8080, so we make its connector port configurable:
#   1. rewrite server.xml to read the port from a property "port.http"
#   2. default that property to 8080 (for local "docker run")
#   3. pass the real PORT to the JVM at startup
RUN sed -i 's/port="8080"/port="${port.http}"/' /usr/local/tomcat/conf/server.xml
ENV PORT=8080
EXPOSE 8080

# Launch Tomcat in the foreground, telling it which port to listen on.
CMD ["sh", "-c", "catalina.sh run -Dport.http=${PORT}"]

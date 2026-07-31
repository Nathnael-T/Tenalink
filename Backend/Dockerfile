# Multi-stage build for Spring Boot backend
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy parent pom and all submodule poms
COPY pom.xml .
COPY gateway-service/pom.xml gateway-service/
COPY auth-service/pom.xml auth-service/
COPY user-service/pom.xml user-service/
COPY medical-records-service/pom.xml medical-records-service/
COPY pharmacy-service/pom.xml pharmacy-service/
COPY admin-service/pom.xml admin-service/
COPY hospital-service/pom.xml hospital-service/

# Download dependencies and plugins
RUN mvn dependency:go-offline -B

# Copy source code for all modules
COPY gateway-service/src gateway-service/src
COPY auth-service/src auth-service/src
COPY user-service/src user-service/src
COPY medical-records-service/src medical-records-service/src
COPY pharmacy-service/src pharmacy-service/src
COPY admin-service/src admin-service/src
COPY hospital-service/src hospital-service/src

# Build the project (skip tests for faster builds)
RUN mvn clean package -DskipTests -q

# Runtime stage: minimal JVM
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy JAR from builder (adjust service name as needed)
COPY --from=builder /app/gateway-service/target/*.jar app.jar

# Set JVM options for container environment
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=25.0"

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

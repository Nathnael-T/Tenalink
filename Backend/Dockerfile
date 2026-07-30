# Multi-stage build for Spring Boot backend
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .

# Download dependencies and plugins
RUN mvn dependency:go-offline -B

# Copy source code
COPY . .

# Build the project (skip tests for faster builds, remove if tests needed)
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

# TenaLink - Healthcare Platform

## Quick Start (Production Ready)

### Prerequisites
- Docker Desktop installed
- Port 3000 (frontend), 8080 (API gateway), 5432 (database) available

### Start Everything
```bash
docker compose up -d
```

**Wait 3-5 minutes** for all services to compile and start.

### Check Status
```bash
docker compose ps
```

All services should show status `Up` and `(healthy)` or `(health: starting)`.

### Access the Application
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Database**: localhost:5432 (user: tenalink, password: 2001)

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f auth-service
docker compose logs -f frontend
```

### Stop Everything
```bash
docker compose down
```

### Rebuild and Clean
```bash
docker compose down -v
docker system prune -f
docker compose up -d
```

---

## Architecture

### Services
- **Gateway** (8080) - API entry point, routes to microservices
- **Auth Service** (8081) - Authentication, JWT tokens
- **User Service** (8082) - User profiles & management
- **Appointment Service** (8083) - Appointment scheduling
- **Hospital Service** (8084) - Hospital information
- **Pharmacy Service** (8085) - Pharmacy operations
- **Medical Records Service** (8086) - Medical history
- **Admin Service** (8087) - Admin operations
- **Frontend** (3000) - React Vite app (production build in Nginx)
- **Database** (5432) - PostgreSQL

### Service Communication
- Synchronous: HTTP via service names (e.g., `http://auth-service:8081`)
- All services on same Docker network: `tenalink-network`

---

## Development Mode

### Enable Hot Reload
Replace `Dockerfile` with `Dockerfile.dev` in docker-compose.yml for individual services:

```yaml
backend:
  build:
    dockerfile: Dockerfile.dev
  volumes:
    - ./Backend/gateway-service/src:/app/gateway-service/src
    - m2-cache:/root/.m2
```

Then:
```bash
docker compose up -d
docker compose logs -f backend
```

Edit files in `./Backend/*/src` → changes sync automatically → Spring Boot restarts.

---

## Troubleshooting

### Services keep restarting
Check logs: `docker compose logs <service>`

Common issues:
- Port conflicts
- Database not healthy
- Compilation errors
- Missing dependencies

### Database connection error
```bash
# Reset database
docker compose down -v
docker compose up -d
```

### Out of memory
Increase Docker Desktop memory:
- Settings → Resources → Memory (set to 8GB+)

### Rebuild a specific service
```bash
docker compose build --no-cache backend
docker compose up -d backend
```

---

## Deployment

### Build for Production
```bash
# Using production Dockerfile (multi-stage builds)
docker compose -f docker-compose.yml build

# Or individually
docker build -f ./Backend/Dockerfile -t tenalink-backend:1.0 ./Backend
docker build -f ./Frontend/Dockerfile -t tenalink-frontend:1.0 ./Frontend
```

### Push to Registry
```bash
docker tag tenalink-backend:1.0 your-registry/tenalink-backend:1.0
docker push your-registry/tenalink-backend:1.0
```

### Environment Variables
Create `.env` file for production:
```env
DB_HOST=prod-postgres
DB_USER=tenalink
DB_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
CORS_ORIGINS=https://yourdomain.com
```

Then modify docker-compose.yml to use `.env`:
```yaml
postgres:
  environment:
    - POSTGRES_PASSWORD=${DB_PASSWORD}
```

---

## API Usage

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Token (Bearer)
Add `Authorization: Bearer <token>` header to all requests.

---

## Next Steps

1. ✅ **All services running** - Start here
2. **Configure database** - Add schema migrations (Flyway)
3. **Add test data** - Populate initial data
4. **Enable authentication** - Full JWT flow
5. **Deploy** - Push to cloud (AWS, GCP, Azure)
6. **Monitor** - Add logging, metrics, alerts

---

## Support

For issues, check:
- `docker compose logs` for error messages
- Individual service logs for compilation/runtime errors
- Database connectivity with `docker exec tenalink-postgres psql -U tenalink -c "SELECT 1;"`

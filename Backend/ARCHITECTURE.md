# TenaLink Backend Architecture

TenaLink uses domain-oriented microservices with Onion Architecture inside each service.

## Dependency Rule

Dependencies point inward only:

- Presentation depends on Application.
- Infrastructure depends on Application and Domain.
- Application depends on Domain.
- Domain depends on no framework or outer layer.

Controllers call use case interfaces. Application services coordinate operations through domain repository contracts. Infrastructure provides JPA, JWT, configuration, and persistence adapters.

## Services

- `gateway-service`
- `auth-service`
- `user-service`
- `medical-records-service`
- `appointment-service`
- `pharmacy-service`
- `admin-service`

The Medical Records service is the core business domain. `MedicalEvent` is append-only, and timeline immutability is enforced in the domain model rather than persistence code.

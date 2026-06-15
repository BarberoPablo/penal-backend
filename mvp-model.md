# Liga Penal Backend — MVP Domain Model

## 1. Current mock data vs real data

The backend should eventually replace all current mock data.

Leagues, standings, matches, players and civilization selections should all come from the backend.

Civilizations are mostly static data, so they can initially be seeded through Prisma rather than managed through an admin panel.

---

## 2. League participation

A user belongs to exactly one league.

There are no seasons or tournament editions in the project right now.

The league itself is the competition.

A user cannot participate in multiple leagues simultaneously.

This allows us to keep the model simple and use a direct relationship between User and League.

---

## 3. Series and Matches

I would like to distinguish between a Series and a Match.

A Series represents the complete confrontation between two players.

Inside a Series there are one or more Matches.

Examples:

- A Bo1 would contain 1 Match.
- A Bo3 would contain up to 3 Matches.
- A Bo5 would contain up to 5 Matches.

I do not want to hardcode any specific format into the data model because the tournament rules may evolve in the future.

The model should remain flexible enough to support different series formats without schema changes.

For the MVP, all series are strictly 1v1.

---

## 4. PlayerCivilization

The Civilization Builder is league-specific.

Players spend a fixed amount of points and choose the civilizations they want to use in their league.

The selected civilizations are not global preferences.

The relationship should represent which civilizations a player has purchased for their current league participation.

---

## 5. Deployment

I would prefer keeping frontend and backend in separate repositories.

For example:

```text
C:\Pablo\Programacion\liga-penal
```

Frontend

```text
C:\Pablo\Programacion\liga-penal-backend
```

Backend

My goal is not only to finish the project, but also to build a portfolio that demonstrates frontend and backend skills separately.

Having two repositories better reflects how many real-world projects are structured and gives me two independent projects to showcase.

---

## 6. Repository Structure

The backend should be a standalone NestJS project.

Something like:

```text
liga-penal-backend/
├─ src/
├─ prisma/
├─ docker-compose.yml
├─ package.json
└─ ...
```

The frontend and backend should communicate through HTTP APIs.

Swagger will be used to generate API documentation and eventually generate frontend types from the backend contract.

---

## 7. League vs Tournament

I would choose the simpler approach for now.

The current UI already treats leagues as the primary competition unit.

There is no concept of seasons or tournaments in the project yet.

I prefer matching the current product requirements instead of introducing abstractions that may never be needed.

For the MVP:

- League owns standings
- League owns series
- League owns participants

If the project grows later, we can introduce Season or Tournament entities through a migration.

---

## 8. The Builder

The builder is tied to league participation.

Each player has a limited budget and purchases civilizations.

Those selected civilizations are then associated with that player within the league.

---

## 9. MVP Scope

For the first backend iteration I would focus on:

- NestJS setup
- Prisma setup
- PostgreSQL setup
- Dockerized PostgreSQL
- Initial Prisma schema
- Seed data
- Swagger documentation
- Basic CRUD endpoints

I would not connect the frontend yet.

The goal of the first backend milestone should be validating the domain model and API design before integrating with the UI.

---

## Current domain model

```text
User
League
Civilization
PlayerCivilization
Series
Match
```

Potential future entities (not for the MVP):

```text
Season
Tournament
Promotion
Relegation
```

I would rather keep the initial architecture as small as possible and only introduce those concepts when the product actually requires them.

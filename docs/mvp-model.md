# Liga Penal Backend — Domain Model

## 1. Core Architecture: Competition-centric design

The platform started as a League-only system. The architecture has evolved to support multiple competition formats. The key insight is that a League is just one type of Competition — the domain model should not be coupled to a specific competition type.

```
User
  ↓
Participation (LeagueParticipant)
  ↓
Competition (League)
```

### Separation of concerns

| Layer             | Responsibility                                                            |
| ----------------- | ------------------------------------------------------------------------- |
| **User**          | Identity, authentication, global profile (avatar, display name, Steam ID) |
| **Participation** | Competition-specific data (points, civilization selections, statistics)   |
| **Competition**   | Rules, boundaries (ELO ranges), scheduling, series management             |

A user does not "belong to" a league. A user **participates** in a league. This distinction allows the same user to participate in multiple competition types (League, Tournament, Cup, etc.) in the future without modifying the User model.

---

## 2. Prisma Schema

### User

```prisma
model User {
  id          Int      @id @default(autoincrement())
  steamId     String?  @unique
  displayName String
  avatarUrl   String?
  role        Role     @default(USER)
  elo         Int      @default(1000)

  participations  LeagueParticipant[]
  teamMemberships SeriesTeamMember[]
}
```

Responsibilities:

- Authentication and identity
- Global player skill rating (`elo`)
- Profile information

### League (a Competition type)

```prisma
model League {
  id       String  @id
  name     String
  eloMin   Int
  eloMax   Int?
  imageUrl String?

  participants LeagueParticipant[]
  series       Series[]
}
```

A League is the first and currently only Competition type. It owns participants and series. Standing positions and points are tracked through `LeagueParticipant`, not directly on the User.

### LeagueParticipant (the key innovation)

```prisma
model LeagueParticipant {
  id       Int @id @default(autoincrement())
  leagueId String
  userId   Int
  points   Int @default(0)

  league        League                @relation(fields: [leagueId], references: [id])
  user          User                  @relation(fields: [userId], references: [id])
  civilizations PlayerCivilization[]

  @@unique([leagueId, userId])
}
```

This is the bridge between User and League. Competition-specific data lives here:

- League standings (`points`)
- Civilization selections (`PlayerCivilization`)
- Future: league-specific statistics, win rates

A `@@unique` constraint on `[leagueId, userId]` ensures each user can only participate once per league.

### PlayerCivilization

```prisma
model PlayerCivilization {
  id            Int    @id @default(autoincrement())
  participantId Int
  civId         String

  participant  LeagueParticipant @relation(fields: [participantId], references: [id])
  civilization Civilization      @relation(fields: [civId], references: [id])

  @@unique([participantId, civId])
}
```

Civilization selections belong to the **participation**, not the User. This reflects the domain correctly — a player buys civilizations for a specific league, not globally.

### Series (renamed competitionId)

```prisma
model Series {
  id            Int          @id @default(autoincrement())
  competitionId String       // references League.id today, named for future competition types
  teamAId       Int          @unique
  teamBId       Int          @unique
  winnerTeamId  Int?
  status        SeriesStatus @default(PENDING)
  round         Int          @default(1)
  scheduledAt   DateTime?
  completedAt   DateTime?

  league  League      @relation(fields: [competitionId], references: [id])
  teamA   SeriesTeam  @relation("TeamA", fields: [teamAId], references: [id])
  teamB   SeriesTeam  @relation("TeamB", fields: [teamBId], references: [id])
  winner  SeriesTeam? @relation("SeriesWinner", fields: [winnerTeamId], references: [id])
  matches Match[]
}
```

`competitionId` currently references `League.id`. The field is intentionally named for future-proofing — when Tournament or other competition types are added, the field name doesn't need to change.

`teamAId` and `teamBId` are both `@unique`, enforcing that each SeriesTeam is used in at most one series.

### SeriesTeam and SeriesTeamMember

```prisma
model SeriesTeam {
  id      Int      @id @default(autoincrement())
  side    TeamSide

  members     SeriesTeamMember[]
  seriesA     Series[] @relation("TeamA")
  seriesB     Series[] @relation("TeamB")
  seriesWinner Series[] @relation("SeriesWinner")
  matchWinner Match[]  @relation("MatchWinner")
}

model SeriesTeamMember {
  id     Int @id @default(autoincrement())
  teamId Int
  userId Int

  team SeriesTeam @relation(fields: [teamId], references: [id])
  user User       @relation(fields: [userId], references: [id])

  @@unique([teamId, userId])
}

enum TeamSide { A, B }
```

Teams replace `player1Id` / `player2Id` on Series. For the MVP, each team has exactly one member (1v1). The same schema supports 2v2, 3v3, or clan wars in the future without any migration.

Key design decision: `SeriesTeamMember.userId` references `User`, not `LeagueParticipant`. This keeps the team model competition-agnostic — a team is made of people, not participations.

The FK is **unidirectional**: only `Series` has `teamAId` / `teamBId` columns. The reverse relations on `SeriesTeam` (`seriesA`, `seriesB`, `seriesWinner`, `matchWinner`) are virtual navigation properties required by Prisma — they create no physical FK columns. There is no circular dependency.

### Match

```prisma
model Match {
  id           Int       @id @default(autoincrement())
  seriesId     Int
  mapName      String?
  winnerTeamId Int?
  player1CivId String?
  player2CivId String?
  completedAt  DateTime?

  series     Series         @relation(fields: [seriesId], references: [id])
  winnerTeam SeriesTeam?    @relation("MatchWinner", fields: [winnerTeamId], references: [id])
  player1Civ Civilization?  @relation("Player1Civ", fields: [player1CivId], references: [id])
  player2Civ Civilization?  @relation("Player2Civ", fields: [player2CivId], references: [id])
}
```

`winnerTeamId` replaces `winnerId`. `player1CivId` / `player2CivId` are kept as-is — the project is 1v1 and will remain so for the foreseeable future. Generalizing civilization selection for team matches would add complexity without value today.

---

## 3. ELO vs Points

| Concept    | Location                   | Purpose                                                                             |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------- |
| **ELO**    | `User.elo`                 | Global player skill rating. Represents matchmaking and ranking across the platform. |
| **Points** | `LeagueParticipant.points` | Competition-specific score. Determines standings position within a League.          |

These are separate concepts. A player's global ELO does not automatically become their league points.

Example:

```
Pablo
  Global ELO: 1650

  League Bronze:  14 pts
  League Gold:    8 pts
```

The seed data initializes `points: 0`, not copying ELO.

---

## 4. Design Decisions

### Competition-first naming

The foreign key on Series is named `competitionId`, not `leagueId`. It currently references `League.id`. The intent is documented here and in the schema itself so that future contributors understand the naming is deliberate. When Tournament or other competition types are introduced, the only change needed is to remove the `@relation` to League and point `competitionId` to a new Competition model.

### SeriesTeam is future-proof, Match civilization fields are not

- `SeriesTeam` + `SeriesTeamMember` support 1v1 today and future team formats without schema changes.
- `Match.player1CivId` / `player2CivId` are hardcoded for 1v1. Team match civilization selection will be designed when needed.

### One-way FK from Series to SeriesTeam

Only `Series` holds `teamAId` / `teamBId` foreign keys. `SeriesTeam` has no `seriesId` column. This avoids a circular dependency and simplifies creation — you create teams first, then create the series referencing them.

### Controllers commented out by default

Series, Match, PlayerCivilization, and User controllers are commented out. They have working services and repositories but no active HTTP endpoints. Uncomment them when the frontend needs those features. This keeps the API surface small during MVP.

---

## 5. Deployment

Frontend and backend are separate repositories:

```
/mnt/c/Pablo/Programacion/liga-penal          — Next.js frontend
/home/pablo/projects/liga-penal-backend       — NestJS backend
```

Backend stack:

- NestJS with TypeScript
- Prisma ORM with PostgreSQL
- Docker Compose for PostgreSQL (port 5433)
- Swagger at `GET /api-json`
- Auth via Steam OpenID 2.0 + JWT in HTTP-only cookie

The two-repo structure reflects real-world project organization and showcases frontend and backend skills independently.

---

## 6. MVP Scope

Current implementation:

- NestJS setup with Prisma and PostgreSQL
- Full auth flow (Steam login → JWT cookie → `/auth/me`)
- League listing and detail endpoints
- Civilization listing endpoint
- Seed data with 5 leagues, 43 civilizations, ~43 users
- Swagger documentation + OpenAPI type generation for frontend

Next priorities:

1. Add `@ApiOkResponse(AuthUserEntity)` to `GET /auth/me` — done
2. League participation endpoints (join/leave league)
3. Civilization builder (select civs for a league participation)
4. Series and match management endpoints (uncomment controllers)
5. Admin endpoints for league/civilization management

---

## 7. Future entities (not planned for MVP)

```
Tournament
Cup
Swiss
DoubleElimination
Season
```

These are not planned but the architecture supports them. When a new competition type is added:

- A new competition entity is created (e.g. `Tournament`)
- A new participant entity is created if needed (e.g. `TournamentParticipant`)
- `Series.competitionId` points to the new entity
- The User model remains unchanged

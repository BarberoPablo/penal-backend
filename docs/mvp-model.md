# Liga Penal — MVP Domain Model

## 1. Architecture Overview

```
User ──→ League
  │
  └── PlayerCivilization ──→ Civilization
  │
  └── Series (as player1/player2) ──→ Match
```

The platform is a League-only system for Age of Empires II competitive play.
Users belong to a league (ranked by ELO thresholds), select civilizations within a budget,
and compete in series (best-of-N matches).

---

## 2. Prisma Schema (actual)

### User

```prisma
model User {
  id          Int      @id @default(autoincrement())
  steamId     String?  @unique
  displayName String
  avatarUrl   String?
  elo         Int      @default(1000)
  leagueId    String?
  league      League?  @relation(fields: [leagueId], references: [id])

  playerCivilizations PlayerCivilization[]
  seriesAsPlayer1     Series[]            @relation("Player1")
  seriesAsPlayer2     Series[]            @relation("Player2")
  wonSeries           Series[]            @relation("SeriesWinner")
  matchResults        Match[]             @relation("MatchWinner")
}
```

Users have a global `elo` rating and belong to at most one league via `leagueId`.
Profile is display-only (no Steam auth yet — see `docs/security.md`).

### League

```prisma
model League {
  id       String  @id
  name     String
  eloMin   Int
  eloMax   Int?
  imageUrl String?

  players             User[]
  playerCivilizations PlayerCivilization[]
  series              Series[]
}
```

`playerCount` and `matchesPlayed` are **computed** at query time (not stored),
returned by the `GET /leagues` and `GET /leagues/:id/detail` endpoints.

### Civilization

```prisma
model Civilization {
  id       String  @id
  name     String  @unique
  imageUrl String?
  cost     Int

  playerCivilizations PlayerCivilization[]
  matchesAsP1Civ      Match[]             @relation("Player1Civ")
  matchesAsP2Civ      Match[]             @relation("Player2Civ")
}
```

The column was renamed from `baseCost` → `cost` to match the frontend type.

### PlayerCivilization

```prisma
model PlayerCivilization {
  id    Int    @id @default(autoincrement())
  userId Int
  civId  String
  leagueId String

  user         User         @relation(fields: [userId], references: [id])
  civilization Civilization @relation(fields: [civId], references: [id])
  league       League       @relation(fields: [leagueId], references: [id])

  @@unique([userId, civId, leagueId])
}
```

Tracks which civilizations a player has selected per league.
A `@@unique` constraint prevents duplicates per user/league.

### Series

```prisma
model Series {
  id          Int          @id @default(autoincrement())
  leagueId    String
  player1Id   Int
  player2Id   Int
  winnerId    Int?
  status      SeriesStatus @default(PENDING)
  round       Int          @default(1)
  scheduledAt DateTime?
  completedAt DateTime?

  league  League @relation(fields: [leagueId], references: [id])
  player1 User   @relation("Player1", fields: [player1Id], references: [id])
  player2 User   @relation("Player2", fields: [player2Id], references: [id])
  winner  User?  @relation("SeriesWinner", fields: [winnerId], references: [id])
  matches Match[]
}

enum SeriesStatus {
  PENDING
  ACTIVE
  COMPLETED
  CANCELLED
}
```

A series is a best-of-N set of matches between two players.
`scheduledAt` and `completedAt` track scheduling and completion dates.

### Match

```prisma
model Match {
  id           Int       @id @default(autoincrement())
  seriesId     Int
  mapName      String?
  winnerId     Int?
  player1CivId String?
  player2CivId String?
  completedAt  DateTime?

  series      Series         @relation(fields: [seriesId], references: [id])
  winner      User?          @relation("MatchWinner", fields: [winnerId], references: [id])
  player1Civ  Civilization?  @relation("Player1Civ", fields: [player1CivId], references: [id])
  player2Civ  Civilization?  @relation("Player2Civ", fields: [player2CivId], references: [id])
}
```

An individual game within a series. Tracks which map was played, which civilizations
each player used, and who won.

---

## 3. API Endpoints (active)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/civilizations` | List all civilizations (with `cost`) |
| `GET` | `/leagues` | List all leagues (with computed `playerCount`, `matchesPlayed`) |
| `GET` | `/leagues/:id/detail` | Full league detail (standings, matches, upcoming matches) |

All other CRUD endpoints (`POST`, `PATCH`, `DELETE`) are commented out in their controllers
for safety. The services and repositories remain active for future use.

---

## 4. Seed Data

| Entity | Count | Notes |
|--------|-------|-------|
| Civilizations | 52 | All AoE2 civs with `cost` values 80–300 |
| Leagues | 5 | League I (2000+) through League V (0–1199) |
| Users | 43 | Distributed across leagues by ELO |

No Series or Match seed data exists yet.

---

## 5. League Detail Endpoint

`GET /leagues/:id/detail` returns:

```json
{
  "league": { "id", "name", "eloMin", "eloMax", "playerCount", "matchesPlayed", "imageUrl" },
  "standings": [
    { "rank", "playerName", "playerInitial", "points", "currentElo", "peakElo", "recentForm": [] }
  ],
  "matches": [
    { "id", "player1Name", "player2Name", "score1", "score2", "winner", "date", "mapName" }
  ],
  "upcomingMatches": [
    { "id", "player1Name", "player2Name", "date", "time" }
  ]
}
```

- **Standings**: Users in the league sorted by ELO descending.
- **Matches**: Completed series with scores derived from individual match wins.
- **Upcoming matches**: Pending/active series scheduled for the future.
- `recentForm` returns empty until win/loss tracking is implemented.

---

## 6. Active Endpoints vs Dead Code

| Controller | Status | Reason |
|------------|--------|--------|
| `CivilizationsController` | Only `GET /` active | Frontend reads civs for builder |
| `LeaguesController` | `GET /` + `GET /:id/detail` active | Frontend reads leagues + detail |
| `UsersController` | All routes commented | No user management UI yet |
| `SeriesController` | All routes commented | No series management yet |
| `MatchesController` | All routes commented | No match management yet |
| `PlayerCivilizationsController` | All routes commented | No builder persistence yet |

Modules, services, and repositories are kept intact — they are needed for dependency
injection and will be re-enabled when the frontend gains those features.

---

## 7. Security

⚠️ **All active endpoints are read-only and open.** No authentication is implemented.
See `docs/security.md` for the full roadmap (Steam login + role-based guards).

---

## 8. Frontend Integration

The frontend (Next.js at `C:\Pablo\Programacion\liga-penal`) previously used mock data
in `mock/`. That directory has been deleted. Services now fetch from the real backend:

| Service | Backend call |
|---------|-------------|
| `civilization-service.ts` | `GET /civilizations` |
| `league-service.ts` | `GET /leagues` + `GET /leagues/:id/detail` |

---

## 9. Deployment

```
C:\Pablo\Programacion\liga-penal          — Next.js frontend (port 3000)
/home/pablo/projects/liga-penal-backend   — NestJS backend (port 3001)
```

Backend stack:
- NestJS 11 with TypeScript (ESM via `"type": "module"`)
- Prisma 7 with PostgreSQL 15 (Docker Compose, port 5433)
- Swagger at `GET /api`

---

## 10. MVP Priorities (next)

1. Steam OAuth login + JWT session cookie
2. Admin roles (`User.role: USER | ADMIN`)
3. League participation endpoints (join/leave league)
4. Civilization builder persistence (re-enable `PlayerCivilizationsController`)
5. Series and match creation endpoints (re-enable controllers)
6. Match result submission → ELO recalculation

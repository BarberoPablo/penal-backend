# Final Schema Approval and Migration Plan

After several rounds of analysis and simplification, we have finalized the domain model for the first production version of the platform.

The primary goal of this refactor is to correctly separate:

- Users
- League participation
- Civilization ownership
- Series (BoX encounters)
- Matches (individual games)

while intentionally limiting the scope to:

- One competition type: League
- 1v1 matches only
- No persistent teams yet

This keeps the system simple while establishing clean boundaries for future growth.

---

# Core Domain Structure

## User

A User represents a global platform account.

A user may participate in multiple leagues over time, therefore league-specific information no longer belongs on the User model.

Responsibilities:

- Steam identity
- Display information
- Global ELO rating
- Platform role

Relations:

- User → LeagueParticipant (one-to-many)

Important:

A User does not directly own civilizations, series, matches, or league membership anymore.

Those concepts are now represented through LeagueParticipant.

---

## League

A League represents a competition.

Responsibilities:

- Competition configuration
- ELO requirements
- Branding

Relations:

- League → LeagueParticipant (one-to-many)
- League → Series (one-to-many)

Important:

League participants are no longer stored directly as User[].

Participation is now represented explicitly through LeagueParticipant.

---

## LeagueParticipant

LeagueParticipant is the most important addition of this migration.

It represents a User participating in a specific League.

Responsibilities:

- League membership
- League-specific points
- Civilization ownership inside the league
- Participation in series and matches

Relations:

- LeagueParticipant → User
- LeagueParticipant → League
- LeagueParticipant → PlayerCivilization
- LeagueParticipant → Series
- LeagueParticipant → Match

Constraint:

A user may only participate once in a given league.

```prisma
@@unique([leagueId, userId])
```

Example:

User #5 can participate in:

- Bronze League
- Silver League
- Tournament X (future)

Each participation is represented by a separate LeagueParticipant record.

---

## Civilization

Represents an available civilization in the game.

Responsibilities:

- Name
- Cost
- Image

Civilizations are global and reusable.

Multiple players may own the same civilization.

Example:

Player A owns Magyars and Ethiopians.

Player B owns Magyars and Chinese.

This is valid.

---

## PlayerCivilization

Represents a civilization owned by a participant inside a league.

Responsibilities:

- Ownership of a civilization within a league participation

Relations:

- LeagueParticipant → PlayerCivilization
- Civilization → PlayerCivilization

Constraint:

A participant cannot own the same civilization twice.

```prisma
@@unique([participantId, civId])
```

Example:

Valid:

- Participant #10 owns Magyars
- Participant #10 owns Ethiopians

Invalid:

- Participant #10 owns Magyars twice

---

## Series

A Series represents an encounter between two participants.

Examples:

- Bo1
- Bo3
- Bo5

The format can change without schema modifications.

Responsibilities:

- Participants
- Winner
- Status
- Scheduling
- Collection of matches

Relations:

- Series → League
- Series → Player A
- Series → Player B
- Series → Winner
- Series → Matches

Important:

We intentionally removed SeriesTeam and SeriesTeamMember.

The platform currently supports only 1v1 competition.

Future team formats should be introduced through dedicated Team models rather than complicating the MVP.

Business validations:

- playerAId != playerBId
- Both participants must belong to the same league
- Both participants must belong to the league referenced by Series.leagueId

These validations belong in the service layer.

---

## Match

A Match represents a single game inside a Series.

Responsibilities:

- Map played
- Civilization selections
- Winner
- Completion status

Relations:

- Match → Series
- Match → Map
- Match → Winner
- Match → Player A civilization selection
- Match → Player B civilization selection

Important:

The match references PlayerCivilization rather than Civilization directly.

This guarantees that a participant can only play civilizations they actually own.

Example:

Valid:

Player A selected their owned Magyars civilization.

Invalid:

Player A selected a civilization that is not part of their roster.

Winner restriction:

Match.winnerId must be equal to either:

- Series.playerAId
- Series.playerBId

This rule must be enforced by the service layer.

---

## Map

Represents an available game map.

Responsibilities:

- Name
- Description

Relations:

- Map → Matches

Constraint:

```prisma
name String @unique
```

This prevents duplicate map definitions.

---

# Architectural Decisions

## User and League are decoupled

The original schema tightly coupled User to League.

This prevented future competition formats and forced league-specific concepts into the User model.

The new architecture follows:

User
→ LeagueParticipant
→ League

This creates a much cleaner separation of responsibilities.

---

## Points and ELO remain separate

Global skill rating:

```text
User.elo
```

League-specific standings:

```text
LeagueParticipant.points
```

This allows future formats to award points independently from ELO.

---

## No Team Support in MVP

The previous proposal introduced:

- SeriesTeam
- SeriesTeamMember

Those models were removed intentionally.

Current requirements only support 1v1 competition.

Introducing team abstractions now would add complexity without solving a real problem.

If team competitions are needed later, dedicated Team models can be introduced as a separate feature.

---

# Database Indexes

Added:

```prisma
LeagueParticipant:
@@index([leagueId])

Series:
@@index([leagueId])

Match:
@@index([seriesId])
```

These support the most common queries:

- League standings
- League series listings
- Match retrieval by series

---

# Migration Objective

After this migration:

User
→ LeagueParticipant
→ PlayerCivilization

League
→ Series
→ Match

will become the primary domain flow.

The schema is intentionally optimized for the current product scope while remaining extensible enough for future competition formats.

Appendix A — Proposed Prisma Schema

enum Role {
USER
ADMIN
}

model User {
id Int @id @default(autoincrement())
steamId String? @unique
displayName String
avatarUrl String?
role Role @default(USER)
elo Int @default(1000)

participations LeagueParticipant[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model League {
id Int @id @default(autoincrement())
name String
eloMin Int
eloMax Int?
imageUrl String?

participants LeagueParticipant[]
series Series[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model LeagueParticipant {
id Int @id @default(autoincrement())
leagueId Int
userId Int
points Int @default(0)

league League @relation(fields: [leagueId], references: [id])
user User @relation(fields: [userId], references: [id])
wonMatches Match[] @relation("MatchWinner")
seriesAsPlayerA Series[] @relation("PlayerA")
seriesAsPlayerB Series[] @relation("PlayerB")
wonSeries Series[] @relation("SeriesWinner")
civilizations PlayerCivilization[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([leagueId])
@@unique([leagueId, userId])
}

model PlayerCivilization {
id Int @id @default(autoincrement())
participantId Int
civId Int

participant LeagueParticipant @relation(fields: [participantId], references: [id])
civilization Civilization @relation(fields: [civId], references: [id])
matchesAsPlayerACiv Match[] @relation("PlayerACiv")
matchesAsPlayerBCiv Match[] @relation("PlayerBCiv")
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
@@unique([participantId, civId])
}

model Civilization {
id Int @id @default(autoincrement())
name String @unique
imageUrl String?
cost Int

playerCivilizations PlayerCivilization[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Series {
id Int @id @default(autoincrement())
leagueId Int
playerAId Int  
 playerBId Int  
 winnerId Int?
status SeriesStatus @default(PENDING)
round Int @default(1)
scheduledAt DateTime?
completedAt DateTime?

league League @relation(fields: [leagueId], references: [id])
playerA LeagueParticipant @relation("PlayerA", fields: [playerAId], references: [id])
playerB LeagueParticipant @relation("PlayerB", fields: [playerBId], references: [id])
winner LeagueParticipant? @relation("SeriesWinner", fields: [winnerId], references: [id])
matches Match[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([leagueId])
}

enum SeriesStatus {
PENDING
ACTIVE
COMPLETED
}

model Match {
id Int @id @default(autoincrement())
seriesId Int
mapId Int
winnerId Int? //must be equal to Series.playerAId or Series.playerBId
playerACivSelectionId Int
playerBCivSelectionId Int
completedAt DateTime?

series Series @relation(fields: [seriesId], references: [id])
winner LeagueParticipant? @relation("MatchWinner", fields: [winnerId], references: [id])
playerACiv PlayerCivilization @relation("PlayerACiv", fields: [playerACivSelectionId ], references: [id])
playerBCiv PlayerCivilization @relation("PlayerBCiv", fields: [playerBCivSelectionId ], references: [id])
map Map @relation(fields: [mapId], references: [id])
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([seriesId])
}

model Map {
id Int @id @default(autoincrement())
name String @unique
description String?

matches Match[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

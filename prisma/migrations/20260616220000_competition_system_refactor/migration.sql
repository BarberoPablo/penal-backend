-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SeriesStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TeamSide" AS ENUM ('A', 'B');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "steamId" TEXT,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "elo" INTEGER NOT NULL DEFAULT 1000,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eloMin" INTEGER NOT NULL,
    "eloMax" INTEGER,
    "imageUrl" TEXT,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Civilization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "cost" INTEGER NOT NULL,

    CONSTRAINT "Civilization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueParticipant" (
    "id" SERIAL NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LeagueParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCivilization" (
    "id" SERIAL NOT NULL,
    "participantId" INTEGER NOT NULL,
    "civId" TEXT NOT NULL,

    CONSTRAINT "PlayerCivilization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" SERIAL NOT NULL,
    "competitionId" TEXT NOT NULL,
    "teamAId" INTEGER NOT NULL,
    "teamBId" INTEGER NOT NULL,
    "winnerTeamId" INTEGER,
    "status" "SeriesStatus" NOT NULL DEFAULT 'PENDING',
    "round" INTEGER NOT NULL DEFAULT 1,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeriesTeam" (
    "id" SERIAL NOT NULL,
    "side" "TeamSide" NOT NULL,

    CONSTRAINT "SeriesTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeriesTeamMember" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SeriesTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "mapName" TEXT,
    "winnerTeamId" INTEGER,
    "player1CivId" TEXT,
    "player2CivId" TEXT,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "Civilization_name_key" ON "Civilization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueParticipant_leagueId_userId_key" ON "LeagueParticipant"("leagueId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCivilization_participantId_civId_key" ON "PlayerCivilization"("participantId", "civId");

-- CreateIndex
CREATE UNIQUE INDEX "Series_teamAId_key" ON "Series"("teamAId");

-- CreateIndex
CREATE UNIQUE INDEX "Series_teamBId_key" ON "Series"("teamBId");

-- CreateIndex
CREATE UNIQUE INDEX "SeriesTeamMember_teamId_userId_key" ON "SeriesTeamMember"("teamId", "userId");

-- AddForeignKey
ALTER TABLE "LeagueParticipant" ADD CONSTRAINT "LeagueParticipant_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueParticipant" ADD CONSTRAINT "LeagueParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCivilization" ADD CONSTRAINT "PlayerCivilization_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "LeagueParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCivilization" ADD CONSTRAINT "PlayerCivilization_civId_fkey" FOREIGN KEY ("civId") REFERENCES "Civilization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_teamAId_fkey" FOREIGN KEY ("teamAId") REFERENCES "SeriesTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_teamBId_fkey" FOREIGN KEY ("teamBId") REFERENCES "SeriesTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES "SeriesTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesTeamMember" ADD CONSTRAINT "SeriesTeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "SeriesTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesTeamMember" ADD CONSTRAINT "SeriesTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES "SeriesTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player1CivId_fkey" FOREIGN KEY ("player1CivId") REFERENCES "Civilization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player2CivId_fkey" FOREIGN KEY ("player2CivId") REFERENCES "Civilization"("id") ON DELETE SET NULL ON UPDATE CASCADE;


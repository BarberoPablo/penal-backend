-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "League" ADD COLUMN     "competitionId" TEXT;

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionAdmin" (
    "id" SERIAL NOT NULL,
    "competitionId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CompetitionAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionApplication" (
    "id" SERIAL NOT NULL,
    "competitionId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "CompetitionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationCivilization" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "civId" TEXT NOT NULL,

    CONSTRAINT "ApplicationCivilization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionAdmin_competitionId_userId_key" ON "CompetitionAdmin"("competitionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionApplication_competitionId_userId_key" ON "CompetitionApplication"("competitionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCivilization_applicationId_civId_key" ON "ApplicationCivilization"("applicationId", "civId");

-- AddForeignKey
ALTER TABLE "CompetitionAdmin" ADD CONSTRAINT "CompetitionAdmin_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionAdmin" ADD CONSTRAINT "CompetitionAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionApplication" ADD CONSTRAINT "CompetitionApplication_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionApplication" ADD CONSTRAINT "CompetitionApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCivilization" ADD CONSTRAINT "ApplicationCivilization_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "CompetitionApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCivilization" ADD CONSTRAINT "ApplicationCivilization_civId_fkey" FOREIGN KEY ("civId") REFERENCES "Civilization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

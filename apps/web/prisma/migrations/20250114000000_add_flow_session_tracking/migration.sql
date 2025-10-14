-- AlterTable
ALTER TABLE "User" ADD COLUMN "ritualCompletionCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "locationConfirmationCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "FlowSession" ADD COLUMN "ritualCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "FlowSession" ADD COLUMN "locationConfirmed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "FlowSession" ADD COLUMN "originalDuration" INTEGER;
ALTER TABLE "FlowSession" ADD COLUMN "extendedDuration" INTEGER NOT NULL DEFAULT 0;


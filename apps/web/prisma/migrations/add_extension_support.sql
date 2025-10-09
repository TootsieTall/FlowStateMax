-- Add domain and category fields to BlockedApp
ALTER TABLE "BlockedApp" ADD COLUMN "domain" TEXT;
ALTER TABLE "BlockedApp" ADD COLUMN "category" TEXT;

-- Create SessionBlockBreak table
CREATE TABLE "SessionBlockBreak" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "url" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionBlockBreak_pkey" PRIMARY KEY ("id")
);

-- Create index on sessionId for better query performance
CREATE INDEX "SessionBlockBreak_sessionId_idx" ON "SessionBlockBreak"("sessionId");

-- Add foreign key constraint
ALTER TABLE "SessionBlockBreak" ADD CONSTRAINT "SessionBlockBreak_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "FlowSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

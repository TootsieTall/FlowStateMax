-- Add password field to User table for email/password authentication
ALTER TABLE "User" ADD COLUMN "hashedPassword" TEXT;
ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP(3);

-- Make email nullable for OAuth-only users initially
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- Add index for faster email lookups
CREATE INDEX "User_email_idx" ON "User"("email");

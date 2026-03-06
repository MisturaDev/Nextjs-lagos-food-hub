-- Create enums
CREATE TYPE "UserRole" AS ENUM ('donor', 'beneficiary', 'volunteer', 'admin');
CREATE TYPE "DonationCategory" AS ENUM ('food', 'clothes', 'medical', 'other');
CREATE TYPE "DonationStatus" AS ENUM ('listed', 'approved', 'assigned', 'picked_up', 'delivered');
CREATE TYPE "AssignmentStatus" AS ENUM ('assigned', 'picked_up', 'delivered');

-- Create users table
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "phone" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create donations table
CREATE TABLE "Donation" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" "DonationCategory" NOT NULL,
  "quantity" INTEGER NOT NULL,
  "donorId" TEXT NOT NULL,
  "locationLGA" TEXT NOT NULL,
  "community" TEXT NOT NULL,
  "status" "DonationStatus" NOT NULL DEFAULT 'listed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- Create assignments table
CREATE TABLE "Assignment" (
  "id" TEXT NOT NULL,
  "donationId" TEXT NOT NULL,
  "volunteerId" TEXT NOT NULL,
  "status" "AssignmentStatus" NOT NULL DEFAULT 'assigned',
  "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- Create status history table
CREATE TABLE "StatusHistory" (
  "id" TEXT NOT NULL,
  "donationId" TEXT NOT NULL,
  "status" "DonationStatus" NOT NULL,
  "updatedBy" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- Create locations table
CREATE TABLE "Location" (
  "id" TEXT NOT NULL,
  "lga" TEXT NOT NULL,
  "community" TEXT NOT NULL,
  CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- Unique constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Location_lga_community_key" ON "Location"("lga", "community");

-- Donation indexes
CREATE INDEX "Donation_donorId_idx" ON "Donation"("donorId");
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
CREATE INDEX "Donation_locationLGA_community_idx" ON "Donation"("locationLGA", "community");

-- Assignment indexes
CREATE INDEX "Assignment_donationId_idx" ON "Assignment"("donationId");
CREATE INDEX "Assignment_volunteerId_idx" ON "Assignment"("volunteerId");

-- Status history indexes
CREATE INDEX "StatusHistory_donationId_idx" ON "StatusHistory"("donationId");
CREATE INDEX "StatusHistory_updatedBy_idx" ON "StatusHistory"("updatedBy");

-- Location indexes
CREATE INDEX "Location_lga_idx" ON "Location"("lga");

-- Foreign keys
ALTER TABLE "Donation"
ADD CONSTRAINT "Donation_donorId_fkey"
FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Assignment"
ADD CONSTRAINT "Assignment_donationId_fkey"
FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Assignment"
ADD CONSTRAINT "Assignment_volunteerId_fkey"
FOREIGN KEY ("volunteerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "StatusHistory"
ADD CONSTRAINT "StatusHistory_donationId_fkey"
FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "StatusHistory"
ADD CONSTRAINT "StatusHistory_updatedBy_fkey"
FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

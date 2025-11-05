/*
  Warnings:

  - Changed the type of `role` on the `Membership` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."TeamRole" AS ENUM ('TEAM_ADMIN', 'TEAM_MEMBER', 'TEAM_VIEWER');

-- CreateEnum
CREATE TYPE "public"."FolderVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "public"."Folder" ADD COLUMN     "access" "public"."FolderVisibility" NOT NULL DEFAULT 'PUBLIC';

-- -- AlterTable
-- ALTER TABLE "public"."Membership" DROP COLUMN "role",
-- ADD COLUMN     "role" "public"."WorkspaceRole" NOT NULL;

-- Rename the role column to a temporary name
ALTER TABLE "public"."Membership" RENAME COLUMN "role" TO "temp_role";

-- Add the new role column with the correct type
ALTER TABLE "public"."Membership" ADD COLUMN "role" "public"."WorkspaceRole" NOT NULL DEFAULT 'MEMBER';

-- Update the new role column with the values from the temporary column
UPDATE "public"."Membership" SET "role" = "temp_role"::"public"."WorkspaceRole";

-- edited

-- Drop the temporary column
ALTER TABLE "public"."Membership" DROP COLUMN "temp_role";

-- AlterTable
ALTER TABLE "public"."TeamMember" ADD COLUMN     "role" "public"."TeamRole" NOT NULL;

-- DropEnum
DROP TYPE "public"."Role";

-- Deleting a user permanently removes all records owned by that user.
-- Tasks are also covered by the existing Folder -> Task cascade.
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- These indexes belonged to an earlier migration whose tables already existed
-- in the production database before Prisma's migration history was reconciled.
CREATE INDEX IF NOT EXISTS "Event_userId_startAt_idx" ON "Event"("userId", "startAt");
CREATE INDEX IF NOT EXISTS "Note_userId_updatedAt_idx" ON "Note"("userId", "updatedAt");

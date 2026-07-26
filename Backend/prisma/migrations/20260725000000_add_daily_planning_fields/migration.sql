-- Supports the Inbox → Today planning flow. Existing tasks remain unplanned.
ALTER TABLE "Task" ADD COLUMN "isPriority" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Task" ADD COLUMN "priorityOrder" INTEGER;

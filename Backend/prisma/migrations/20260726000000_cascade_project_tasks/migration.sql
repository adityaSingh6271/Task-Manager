-- Deleting a project deliberately removes its tasks after the UI confirmation.
ALTER TABLE "Task" DROP CONSTRAINT "Task_folderId_fkey";
ALTER TABLE "Task" ADD CONSTRAINT "Task_folderId_fkey"
  FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

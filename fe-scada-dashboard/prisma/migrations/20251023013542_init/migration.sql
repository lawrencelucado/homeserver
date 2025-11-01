-- CreateTable
CREATE TABLE "StudyLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicFE" TEXT NOT NULL,
    "topicSCADA" TEXT NOT NULL,
    "questionsFE" INTEGER NOT NULL,
    "accuracyFE" INTEGER NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "section" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyLog_date_key" ON "StudyLog"("date");

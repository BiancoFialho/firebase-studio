/*
  Warnings:

  - You are about to alter the column `agenda` on the `CipaMeeting` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("Text")` to `Text`.
  - You are about to alter the column `observations` on the `DocumentRecord` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("Text")` to `Text`.
  - You are about to alter the column `details` on the `LawsuitRecord` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("Text")` to `Text`.
  - You are about to alter the column `description` on the `AccidentRecord` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("Text")` to `Text`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CipaMeeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "participantsJson" TEXT,
    "agenda" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Agendada',
    "minutesUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CipaMeeting" ("agenda", "createdAt", "date", "id", "minutesUrl", "participantsJson", "status", "updatedAt") SELECT "agenda", "createdAt", "date", "id", "minutesUrl", "participantsJson", "status", "updatedAt" FROM "CipaMeeting";
DROP TABLE "CipaMeeting";
ALTER TABLE "new_CipaMeeting" RENAME TO "CipaMeeting";
CREATE TABLE "new_DocumentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "responsible" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Valido',
    "attachmentUrl" TEXT,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DocumentRecord" ("attachmentUrl", "createdAt", "documentType", "expiryDate", "id", "issueDate", "observations", "responsible", "status", "updatedAt") SELECT "attachmentUrl", "createdAt", "documentType", "expiryDate", "id", "issueDate", "observations", "responsible", "status", "updatedAt" FROM "DocumentRecord";
DROP TABLE "DocumentRecord";
ALTER TABLE "new_DocumentRecord" RENAME TO "DocumentRecord";
CREATE TABLE "new_TrainingType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "validityMonths" INTEGER,
    "requiredNrsJson" TEXT,
    "defaultDuration" INTEGER,
    "defaultLocation" TEXT,
    "defaultCost" REAL,
    "instructorsJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TrainingType" ("createdAt", "defaultCost", "defaultDuration", "defaultLocation", "description", "id", "instructorsJson", "name", "requiredNrsJson", "updatedAt", "validityMonths") SELECT "createdAt", "defaultCost", "defaultDuration", "defaultLocation", "description", "id", "instructorsJson", "name", "requiredNrsJson", "updatedAt", "validityMonths" FROM "TrainingType";
DROP TABLE "TrainingType";
ALTER TABLE "new_TrainingType" RENAME TO "TrainingType";
CREATE UNIQUE INDEX "TrainingType_name_key" ON "TrainingType"("name");
CREATE TABLE "new_LawsuitRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processNumber" TEXT NOT NULL,
    "plaintiff" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Em_Andamento',
    "filingDate" DATETIME NOT NULL,
    "hearingDate" DATETIME,
    "estimatedCost" REAL,
    "finalCost" REAL,
    "lawyer" TEXT,
    "details" TEXT NOT NULL,
    "relatedNRsJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LawsuitRecord" ("createdAt", "details", "estimatedCost", "finalCost", "filingDate", "hearingDate", "id", "lawyer", "plaintiff", "processNumber", "relatedNRsJson", "status", "subject", "updatedAt") SELECT "createdAt", "details", "estimatedCost", "finalCost", "filingDate", "hearingDate", "id", "lawyer", "plaintiff", "processNumber", "relatedNRsJson", "status", "subject", "updatedAt" FROM "LawsuitRecord";
DROP TABLE "LawsuitRecord";
ALTER TABLE "new_LawsuitRecord" RENAME TO "LawsuitRecord";
CREATE UNIQUE INDEX "LawsuitRecord_processNumber_key" ON "LawsuitRecord"("processNumber");
CREATE TABLE "new_PreventiveAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "frequency" TEXT,
    "dueDate" DATETIME,
    "lastCompletedDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "evidenceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PreventiveAction" ("category", "createdAt", "description", "dueDate", "evidenceUrl", "frequency", "id", "lastCompletedDate", "responsible", "status", "updatedAt") SELECT "category", "createdAt", "description", "dueDate", "evidenceUrl", "frequency", "id", "lastCompletedDate", "responsible", "status", "updatedAt" FROM "PreventiveAction";
DROP TABLE "PreventiveAction";
ALTER TABLE "new_PreventiveAction" RENAME TO "PreventiveAction";
CREATE TABLE "new_JsaRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "analysisDate" DATETIME NOT NULL,
    "reviewDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Ativo',
    "attachmentUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_JsaRecord" ("analysisDate", "attachmentUrl", "createdAt", "department", "id", "reviewDate", "status", "taskName", "updatedAt") SELECT "analysisDate", "attachmentUrl", "createdAt", "department", "id", "reviewDate", "status", "taskName", "updatedAt" FROM "JsaRecord";
DROP TABLE "JsaRecord";
ALTER TABLE "new_JsaRecord" RENAME TO "JsaRecord";
CREATE TABLE "new_CipaAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "meetingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CipaAction_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "CipaMeeting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CipaAction" ("createdAt", "deadline", "description", "id", "meetingId", "responsible", "status", "updatedAt") SELECT "createdAt", "deadline", "description", "id", "meetingId", "responsible", "status", "updatedAt" FROM "CipaAction";
DROP TABLE "CipaAction";
ALTER TABLE "new_CipaAction" RENAME TO "CipaAction";
CREATE TABLE "new_DocumentAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "documentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocumentAction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "DocumentRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DocumentAction" ("createdAt", "deadline", "description", "documentId", "id", "responsible", "status", "updatedAt") SELECT "createdAt", "deadline", "description", "documentId", "id", "responsible", "status", "updatedAt" FROM "DocumentAction";
DROP TABLE "DocumentAction";
ALTER TABLE "new_DocumentAction" RENAME TO "DocumentAction";
CREATE TABLE "new_AsoRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "examDate" DATETIME NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "result" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Valido',
    "attachmentUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AsoRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AsoRecord" ("attachmentUrl", "createdAt", "employeeId", "examDate", "examType", "expiryDate", "id", "result", "status", "updatedAt") SELECT "attachmentUrl", "createdAt", "employeeId", "examDate", "examType", "expiryDate", "id", "result", "status", "updatedAt" FROM "AsoRecord";
DROP TABLE "AsoRecord";
ALTER TABLE "new_AsoRecord" RENAME TO "AsoRecord";
CREATE TABLE "new_ChemicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productName" TEXT NOT NULL,
    "casNumber" TEXT,
    "location" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "sdsUrl" TEXT,
    "lastUpdated" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ChemicalRecord" ("casNumber", "createdAt", "id", "lastUpdated", "location", "productName", "quantity", "sdsUrl", "unit", "updatedAt") SELECT "casNumber", "createdAt", "id", "lastUpdated", "location", "productName", "quantity", "sdsUrl", "unit", "updatedAt" FROM "ChemicalRecord";
DROP TABLE "ChemicalRecord";
ALTER TABLE "new_ChemicalRecord" RENAME TO "ChemicalRecord";
CREATE TABLE "new_AccidentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "time" TEXT,
    "employeeId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "causeDetails" TEXT,
    "daysOff" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "cid10Code" TEXT,
    "catIssued" BOOLEAN NOT NULL DEFAULT false,
    "investigationStatus" TEXT NOT NULL DEFAULT 'Pendente',
    "reportUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AccidentRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AccidentRecord" ("catIssued", "cause", "causeDetails", "cid10Code", "createdAt", "date", "daysOff", "department", "description", "employeeId", "id", "investigationStatus", "location", "reportUrl", "time", "type", "updatedAt") SELECT "catIssued", "cause", "causeDetails", "cid10Code", "createdAt", "date", "daysOff", "department", "description", "employeeId", "id", "investigationStatus", "location", "reportUrl", "time", "type", "updatedAt" FROM "AccidentRecord";
DROP TABLE "AccidentRecord";
ALTER TABLE "new_AccidentRecord" RENAME TO "AccidentRecord";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

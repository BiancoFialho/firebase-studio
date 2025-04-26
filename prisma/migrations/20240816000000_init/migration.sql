-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "department" TEXT
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "trainingDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "status" TEXT NOT NULL,
    "attendanceListUrl" TEXT,
    "certificateUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PpeRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "ppeType" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "caNumber" TEXT,
    "quantity" INTEGER NOT NULL,
    "returnDate" DATETIME,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PpeRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AsoRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "examDate" DATETIME NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "result" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AsoRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChemicalRecord" (
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

-- CreateTable
CREATE TABLE "JsaRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "analysisDate" DATETIME NOT NULL,
    "reviewDate" DATETIME,
    "status" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiskItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "controls" TEXT NOT NULL,
    "jsaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RiskItem_jsaId_fkey" FOREIGN KEY ("jsaId") REFERENCES "JsaRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CipaMeeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "participantNames" TEXT NOT NULL, -- Storing as JSON string or delimited string
    "agenda" TEXT NOT NULL,
    "minutesUrl" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CipaAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "deadline" DATETIME,
    "status" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CipaAction_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "CipaMeeting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PreventiveAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "frequency" TEXT,
    "dueDate" DATETIME,
    "lastCompletedDate" DATETIME,
    "status" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DocumentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "responsible" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DocumentAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "deadline" DATETIME,
    "status" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocumentAction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "DocumentRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LawsuitRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processNumber" TEXT NOT NULL,
    "plaintiff" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "filingDate" DATETIME NOT NULL,
    "hearingDate" DATETIME,
    "estimatedCost" REAL,
    "finalCost" REAL,
    "lawyer" TEXT,
    "details" TEXT NOT NULL,
    "relatedNRs" TEXT NOT NULL, -- Storing as JSON string or delimited string
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AccidentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "time" TEXT,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL, -- Denormalized field
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "causeDetails" TEXT,
    "daysOff" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "cid10Code" TEXT,
    "catIssued" BOOLEAN NOT NULL DEFAULT false,
    "investigationStatus" TEXT NOT NULL DEFAULT 'Pendente',
    "reportUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AccidentRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OccupationalDiseaseRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "diseaseType" TEXT NOT NULL,
    "cid10Code" TEXT NOT NULL,
    "diagnosisDate" DATETIME NOT NULL,
    "relatedTask" TEXT,
    "medicalReportUrl" TEXT,
    "daysOff" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "pcmsoLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OccupationalDiseaseRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CipaParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CipaParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "CipaMeeting" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CipaParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LawsuitRecord_processNumber_key" ON "LawsuitRecord"("processNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_CipaParticipants_AB_unique" ON "_CipaParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_CipaParticipants_B_index" ON "_CipaParticipants"("B");

    
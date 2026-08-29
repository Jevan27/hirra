-- CreateEnum
CREATE TYPE "ResumeStatus" AS ENUM ('UPLOADING', 'UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED', 'DELETED');

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "objectKey" TEXT,
ADD COLUMN     "originalName" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "status" "ResumeStatus" NOT NULL DEFAULT 'UPLOADED',
ALTER COLUMN "fileUrl" DROP NOT NULL,
ALTER COLUMN "fileType" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "resumes_status_idx" ON "resumes"("status");

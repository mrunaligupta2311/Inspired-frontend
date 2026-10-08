-- CreateEnum
CREATE TYPE "GalleryMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "cloudinaryPublicId" TEXT,
ADD COLUMN     "mediaType" "GalleryMediaType" NOT NULL DEFAULT 'IMAGE',
ADD COLUMN     "mediaUrl" TEXT;

-- CreateIndex
CREATE INDEX "Gallery_mediaType_idx" ON "Gallery"("mediaType");

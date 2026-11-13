-- Phase 1: draft/publish separation for pagesection
ALTER TABLE `pagesection`
  ADD COLUMN `draftData` LONGTEXT NULL AFTER `content`,
  ADD COLUMN `publishedAt` DATETIME(3) NULL AFTER `parentSectionId`,
  ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) AFTER `publishedAt`;

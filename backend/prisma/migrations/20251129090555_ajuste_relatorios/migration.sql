/*
  Warnings:

  - You are about to drop the column `type` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `area_other` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `children_care` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `disability` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `disability_desc` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `ethnic` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `event_theme` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `lgpd_accepted` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `lodging` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `organization` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `organization_name` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `organization_social` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `mealOptionId` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoInscricao` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoInscricao" AS ENUM ('comunicacao', 'organizacao', 'parlamentar', 'participante');

-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "type",
ADD COLUMN     "mealOptionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "area",
DROP COLUMN "area_other",
DROP COLUMN "children_care",
DROP COLUMN "disability",
DROP COLUMN "disability_desc",
DROP COLUMN "ethnic",
DROP COLUMN "event_theme",
DROP COLUMN "gender",
DROP COLUMN "lgpd_accepted",
DROP COLUMN "lodging",
DROP COLUMN "organization",
DROP COLUMN "organization_name",
DROP COLUMN "organization_social",
ADD COLUMN     "alojamento" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contribuicao" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "credenciada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "credenciada_em" TIMESTAMP(3),
ADD COLUMN     "credencial" TEXT,
ADD COLUMN     "tipoInscricao" "TipoInscricao" NOT NULL;

-- CreateTable
CREATE TABLE "MealOption" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MealOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_mealOptionId_fkey" FOREIGN KEY ("mealOptionId") REFERENCES "MealOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

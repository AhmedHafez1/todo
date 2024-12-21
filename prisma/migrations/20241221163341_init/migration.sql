-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

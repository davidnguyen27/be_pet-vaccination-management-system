/*
  Warnings:

  - You are about to drop the `otp_code` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "otp_code" DROP CONSTRAINT "otp_code_user_id_fkey";

-- DropTable
DROP TABLE "otp_code";

-- DropEnum
DROP TYPE "OtpType";

-- CreateTable
CREATE TABLE "verify_token" (
    "_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "redirect_url" VARCHAR(500),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "last_sent_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verify_token_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verify_token_token_hash_key" ON "verify_token"("token_hash");

-- CreateIndex
CREATE INDEX "verify_token_user_id_idx" ON "verify_token"("user_id");

-- CreateIndex
CREATE INDEX "verify_token_expires_at_idx" ON "verify_token"("expires_at");

-- AddForeignKey
ALTER TABLE "verify_token" ADD CONSTRAINT "verify_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp_enable" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp_secret" VARCHAR(40);

-- CreateTable
CREATE TABLE "OtpBackupCode" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "codes" TEXT NOT NULL,
    "nb_code_used" INTEGER NOT NULL DEFAULT 0,
    "nb_consecutive_tests" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OtpBackupCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpBackupCode_user_id_key" ON "OtpBackupCode"("user_id");

-- AddForeignKey
ALTER TABLE "OtpBackupCode" ADD CONSTRAINT "OtpBackupCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

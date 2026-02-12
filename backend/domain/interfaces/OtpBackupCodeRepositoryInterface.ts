import { OtpBackupCode } from "../entities/OtpBackupCode";

export interface IOtpBackupCodeRepository {
    save(codeBackup: OtpBackupCode): Promise<OtpBackupCode>;
    findByUserId(id: string): Promise<OtpBackupCode | null>;
    deleteByUserId(id: string): Promise<void>;
    update(codeBackup: OtpBackupCode): Promise<OtpBackupCode>;
}

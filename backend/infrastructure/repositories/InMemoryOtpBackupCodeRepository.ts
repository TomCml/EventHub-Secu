import { OtpBackupCode } from "../../domain/entities/OtpBackupCode";
import { IOtpBackupCodeRepository } from "../../domain/interfaces/OtpBackupCodeRepositoryInterface";

export class InMemoryOtpBackupCodeRepository implements IOtpBackupCodeRepository {
    private codesBackup: OtpBackupCode[] = [];

    async save(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
        this.codesBackup.push(codeBackup);
        return codeBackup;
    }

    async findByUserId(id: string): Promise<OtpBackupCode | null> {
        return this.codesBackup.find((cb) => cb.props.user_id === id) ?? null;
    }

    async deleteByUserId(id: string): Promise<void> {
        this.codesBackup = this.codesBackup.filter((cb) => cb.props.user_id !== id);
    }

    async update(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
        const index = this.codesBackup.findIndex((cb) => cb.props.user_id === codeBackup.props.user_id);
        if (index !== -1) {
            this.codesBackup[index] = codeBackup;
        }
        return codeBackup;
    }
}

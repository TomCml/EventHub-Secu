import { OtpBackupCode } from "../../domain/entities/OtpBackupCode";
import { IOtpBackupCodeRepository } from "../../domain/interfaces/OtpBackupCodeRepositoryInterface";
import { prisma } from "../database/db";

export class OtpBackupCodeRepositoryDatabase implements IOtpBackupCodeRepository {

    async save(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
        const created = await prisma.otpBackupCode.create({
            data: {
                user_id: codeBackup.props.user_id,
                codes: codeBackup.props.codes,
                nb_code_used: codeBackup.props.nb_code_used,
                nb_consecutive_tests: codeBackup.props.nb_consecutive_tests,
            },
        });

        return new OtpBackupCode({
            id: created.id,
            user_id: created.user_id,
            codes: created.codes,
            nb_code_used: created.nb_code_used,
            nb_consecutive_tests: created.nb_consecutive_tests,
        });
    }

    async findByUserId(id: string): Promise<OtpBackupCode | null> {
        const found = await prisma.otpBackupCode.findUnique({
            where: { user_id: id },
        });

        if (!found) return null;

        return new OtpBackupCode({
            id: found.id,
            user_id: found.user_id,
            codes: found.codes,
            nb_code_used: found.nb_code_used,
            nb_consecutive_tests: found.nb_consecutive_tests,
        });
    }

    async deleteByUserId(id: string): Promise<void> {
        await prisma.otpBackupCode.deleteMany({
            where: { user_id: id },
        });
    }

    async update(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
        const updated = await prisma.otpBackupCode.update({
            where: { user_id: codeBackup.props.user_id },
            data: {
                codes: codeBackup.props.codes,
                nb_code_used: codeBackup.props.nb_code_used,
                nb_consecutive_tests: codeBackup.props.nb_consecutive_tests,
            },
        });

        return new OtpBackupCode({
            id: updated.id,
            user_id: updated.user_id,
            codes: updated.codes,
            nb_code_used: updated.nb_code_used,
            nb_consecutive_tests: updated.nb_consecutive_tests,
        });
    }
}

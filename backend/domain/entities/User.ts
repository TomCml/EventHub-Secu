export interface UserProps {
    id: string;
    username: string;
    email: string;
    password: string;
    salt: string;
    otp_secret: string | null;
    otp_enable: number;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    constructor(public readonly props: UserProps) { }

    get id() { return this.props.id; }
    get username() { return this.props.username; }
    get email() { return this.props.email; }
    get password() { return this.props.password; }
    get salt() { return this.props.salt; }
    get otp_secret() { return this.props.otp_secret; }
    get otp_enable() { return this.props.otp_enable; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
}

export interface UserPayload {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

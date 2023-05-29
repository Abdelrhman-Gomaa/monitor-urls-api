import { Default, Column, DataType, Model, PrimaryKey, Table, Unique, CreatedAt, UpdatedAt, AllowNull, HasMany } from "sequelize-typescript";
import { GenderEnum, LangEnum, UserRoleType } from '../user.enum';
import { LastLoginDetailsType, LocationType } from '../user.type';
import { UserVerificationCode } from './user-verification-code.model';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUIDV4 })
    @ApiProperty()
    id: string;

    @AllowNull(true)
    @Column
    @ApiProperty()
    firstName?: string;

    @AllowNull(true)
    @Column
    @ApiProperty()
    lastName?: string;

    @ApiProperty()
    fullName?: string;

    @Unique
    @AllowNull(true)
    @Column
    @ApiProperty()
    slug?: string;

    @Unique
    @AllowNull(true)
    @Column
    @ApiProperty()
    userName?: string;

    @Unique
    @AllowNull(true)
    @Column({
        set(val: string) {
            val && typeof val === 'string'
                ? (this as any).setDataValue('verifiedEmail', val.toLowerCase())
                : (this as any).setDataValue('verifiedEmail', val);
        }
    })
    @ApiProperty()
    verifiedEmail?: string;

    @AllowNull(true)
    @Column({
        set(val: string) {
            val && typeof val === 'string'
                ? (this as any).setDataValue('unVerifiedEmail', val.toLowerCase())
                : (this as any).setDataValue('unVerifiedEmail', val);
        }
    })
    @ApiProperty()
    unVerifiedEmail?: string;

    @Default(false)
    @AllowNull(false)
    @Column
    @ApiProperty()
    isCompletedRegister: boolean;

    @Default(true)
    @AllowNull(false)
    @Column
    @ApiProperty()
    isFirstRegistration: boolean;

    @AllowNull(true)
    @Column
    @ApiProperty()
    phone?: string;

    @AllowNull(true)
    @Column
    password?: string;

    @Default(GenderEnum.MALE)
    @AllowNull(false)
    @Column({ type: DataType.ENUM(...Object.values(GenderEnum)) })
    @ApiProperty()
    gender: GenderEnum;

    @AllowNull(true)
    @Column({ type: DataType.GEOMETRY('Point') })
    location?: LocationType;

    @AllowNull(true)
    @Column({ type: DataType.TEXT })
    @ApiProperty()
    profilePicture?: string;

    @Default(false)
    @AllowNull(false)
    @Column
    @ApiProperty()
    isBlocked: boolean;

    @Default(LangEnum.EN)
    @AllowNull(false)
    @Column({ type: DataType.ENUM(...Object.values(LangEnum)) })
    @ApiProperty()
    favLang: LangEnum;

    @ApiProperty()
    token?: string;

    @AllowNull(true)
    @Column({ type: DataType.JSONB })
    @ApiProperty()
    lastLoginDetails: LastLoginDetailsType;

    @HasMany(() => UserVerificationCode)
    userVerificationCodes?: UserVerificationCode[];

    @Column({ type: DataType.ENUM(...Object.values(GenderEnum)) })
    role: UserRoleType;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt: Date;
}

import { Default, Column, DataType, Model, PrimaryKey, Table, ForeignKey, CreatedAt, UpdatedAt, AllowNull, BelongsTo } from "sequelize-typescript";
import { ApiProperty } from '@nestjs/swagger';
import { assertType, authenticationType } from '../check.type';
import { User } from 'src/user/models/user.model';
import { ProtocolEnum } from '../check.enum';

@Table
export class Check extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUIDV4 })
    @ApiProperty()
    id: string;

    @AllowNull(false)
    @Column
    @ApiProperty()
    name: string;

    @AllowNull(false)
    @Column
    @ApiProperty()
    url: string;

    @AllowNull(false)
    @Column({ type: DataType.ENUM(...Object.values(ProtocolEnum)) })
    @ApiProperty()
    protocol: ProtocolEnum;

    @AllowNull(true)
    @Column
    @ApiProperty()
    path?: string;

    @AllowNull(true)
    @Column
    @ApiProperty()
    port?: number;

    @AllowNull(true)
    @Column
    @ApiProperty()
    webhook?: string;

    @AllowNull(true)
    @Default(5)
    @Column
    @ApiProperty()
    timeout?: number;

    @AllowNull(true)
    @Default(10)
    @Column
    @ApiProperty()
    interval?: number;

    @AllowNull(true)
    @Default(1)
    @Column
    @ApiProperty()
    threshold?: number;

    @AllowNull(true)
    @Column({ type: DataType.JSONB })
    @ApiProperty()
    authentication: authenticationType;

    @AllowNull(true)
    @Column({ type: DataType.ARRAY(DataType.STRING) })
    @ApiProperty()
    httpHeaders?: string[];

    @AllowNull(true)
    @Column({ type: DataType.JSONB })
    @ApiProperty()
    assert: assertType;

    @AllowNull(true)
    @Column({ type: DataType.ARRAY(DataType.STRING) })
    @ApiProperty()
    tags?: string[];

    @AllowNull(false)
    @Column
    @ApiProperty()
    ignoreSSL?: boolean;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt: Date;
}

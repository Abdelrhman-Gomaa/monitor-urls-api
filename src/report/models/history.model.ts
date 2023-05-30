import { ApiProperty } from '@nestjs/swagger';
import { AllowNull, Column, Model, Table, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { PingStatus } from '../report.enum';
import { Check } from 'src/check/models/check.model';

@Table
export class History extends Model {
    @AllowNull(false)
    @Column({ type: DataType.ENUM(...Object.values(PingStatus)) })
    @ApiProperty()
    status: PingStatus;

    @AllowNull(false)
    @Column({ type: DataType.BIGINT })
    @ApiProperty()
    responseTime: number;

    @AllowNull(false)
    @Column({ type: DataType.BIGINT })
    @ApiProperty()
    timestamp: number;

    @ForeignKey(() => Check)
    @AllowNull(false)
    @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
    checkId: string;

    @BelongsTo(() => Check)
    check: Check;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt: Date;
}
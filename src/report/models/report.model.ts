import { Check } from '../../check/models/check.model';
import { Default, Column, DataType, Model, PrimaryKey, Table, ForeignKey, CreatedAt, UpdatedAt, AllowNull, BelongsTo } from "sequelize-typescript";
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Report extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUIDV4 })
    @ApiProperty()
    id: string;

    @AllowNull(false)
    @Column
    @ApiProperty()
    status: string;

    @AllowNull(false)
    @Column
    @ApiProperty()
    availability: number;

    @AllowNull(true)
    @Column
    @ApiProperty()
    ups: number;

    @AllowNull(false)
    @Column
    @ApiProperty()
    outages: number;

    @AllowNull(false)
    @Column
    @ApiProperty()
    downtime: number;

    @AllowNull(false)
    @Column
    @ApiProperty()
    uptime: number;

    @AllowNull(false)
    @Column
    @ApiProperty()
    averageResponseTime: number;

    @AllowNull(false)
    @Column({ type: DataType.ARRAY(DataType.JSON) })
    @ApiProperty({ type: DataType.ARRAY(DataType.JSON) })
    history: any[];

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
}
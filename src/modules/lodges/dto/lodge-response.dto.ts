import { ApiProperty } from '@nestjs/swagger';
import { LodgeStatus } from 'src/common/enums/lodge-availability.enum';

export class AmenityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class LodgeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;

  @ApiProperty({ required: false })
  proximityToCampus?: number;

  @ApiProperty()
  rooms: number;

  @ApiProperty()
  bathrooms: number;

  @ApiProperty({ type: [AmenityDto] })
  amenities: AmenityDto[];

  @ApiProperty({ type: [String] })
  photos: string[];

  @ApiProperty()
  agentFee: boolean;

  @ApiProperty()
  status: LodgeStatus;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

import { Controller } from '@nestjs/common';
import { LodgesService } from './lodges.service';

@Controller('lodges')
export class LodgesController {
  constructor(private readonly lodgesService: LodgesService) {}
}

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocationsService } from './locations.service';

@ApiTags('route: prod-mgmt')
@Controller('prod-mgmt/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}
}

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ItemsService } from './items.service';

@ApiTags('route: prod-mgmt')
@Controller('prod-mgmt/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
}

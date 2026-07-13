import { PartialType } from '@nestjs/swagger';
import { CreateStatusReportDto } from './create-status-report.dto';

export class UpdateStatusReportDto extends PartialType(CreateStatusReportDto) {}
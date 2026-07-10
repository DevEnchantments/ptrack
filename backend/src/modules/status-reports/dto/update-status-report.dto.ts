import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusReportDto } from './create-status-report.dto';

export class UpdateStatusReportDto extends PartialType(CreateStatusReportDto) {}
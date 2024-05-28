import { CalculatedResDto } from './calculated.res.dto';
import { DocumentsResDto } from './documents.res.dto';

export interface StepperResDto {
  clientAssignmentId: string;
  documentsRes: DocumentsResDto[];
  calculatedDataResDto: CalculatedResDto[];
}

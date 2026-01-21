import { IsIn, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { EmailTypes } from "../services/email-templates/auth.template";

export class SendMailDTO {
  @IsIn(Object.values(EmailTypes))
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Object)
  data?: { [key: string]: string };
}

import { IsOptional, IsString, ValidateNested } from "class-validator";
import { AdressDto } from "./adress.dto";

export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsOptional()
  @ValidateNested()
  adress?: AdressDto;
}

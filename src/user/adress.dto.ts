import { IsString } from "class-validator";

export class AdressDto {
  @IsString()
  city: string;
  @IsString()
  street: string;
  @IsString()
  country: string;
}

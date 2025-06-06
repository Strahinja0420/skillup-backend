import { IsNumber, IsPositive, Min } from "class-validator";

export class CreateBidDto {
    @IsNumber()
    @IsPositive()
    @Min(1)
    ammount : number;
}

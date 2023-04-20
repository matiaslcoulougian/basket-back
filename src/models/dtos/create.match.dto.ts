import {IsDate, IsNotEmpty, IsString} from "class-validator";

export class CreateMatchDTO {
    @IsNotEmpty()
    @IsDate()
    startDate: Date;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsString()
    localTeamId: string;

    @IsNotEmpty()
    @IsString()
    visitorTeamId: string;

}
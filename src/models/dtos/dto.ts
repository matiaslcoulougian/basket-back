import {IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min} from "class-validator";

export class CreateMatchDto {
  @IsNotEmpty()
  @IsDateString()
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

export enum FaultType {
  YELLOW_CARD= 'YELLOW_CARD',
  RED_CARD= 'RED_CARD'
}

export class CreateFaultDto {

  @IsNotEmpty()
  @IsUUID()
  matchId: string;

  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @IsNotEmpty()
  @IsEnum(FaultType)
  type: FaultType;

}

export class CreateAnnotationDto {
  @IsNotEmpty()
  @IsUUID()
  matchId: string;

  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @IsNumber()
  @Min(1)
  @Max(3)
  points: number;
}


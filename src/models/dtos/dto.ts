import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateMatchDto {
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


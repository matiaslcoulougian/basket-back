import { Injectable } from '@nestjs/common';
import {AppRepository} from "./app.repository";
import {Match} from "@prisma/client";
import {CreateMatchDTO} from "./models/dtos/create.match.dto";

@Injectable()
export class AppService {
  constructor(private readonly appRepository: AppRepository) {}
  async getAllMatches(): Promise<Match[]> {
    return await this.appRepository.getAllMatches();
  }

  async createMatch(body: CreateMatchDTO): Promise<Match> {
    return await this.appRepository.createMatch(body);
  }
}

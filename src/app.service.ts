import { Injectable } from '@nestjs/common';
import {AppRepository} from "./app.repository";
import {User} from "@prisma/client";

@Injectable()
export class AppService {
  constructor(private readonly appRepository: AppRepository) {}
  getUsers(): Promise<User[]> {
    return this.appRepository.getUsers();
  }
}

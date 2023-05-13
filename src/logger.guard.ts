import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

let REQUEST_RECEIVED=0

@Injectable()
export class LoggerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    REQUEST_RECEIVED += 1
    console.log(`Requests received: ${REQUEST_RECEIVED}`, context.getHandler())
    return true
  }
}

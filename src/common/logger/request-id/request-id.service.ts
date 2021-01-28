import { Injectable, Scope } from '@nestjs/common';

// NOTE: Response するまで，一意の request Id を保持し，logger にて利用する
@Injectable({ scope: Scope.REQUEST })
export class RequestIdService {
  private requestId: string;

  get() {
    return this.requestId;
  }

  set(requestId: string) {
    this.requestId = requestId;
  }
}

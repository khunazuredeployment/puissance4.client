import { Pipe, PipeTransform } from '@angular/core';
import { GameHubStatusEnum } from '../enums/game-hub-status.enum';

@Pipe({
  name: 'gameHubStatusToString'
})
export class GameHubStatusToStringPipe implements PipeTransform {

  transform(status: GameHubStatusEnum): string|null {
    switch(status) {
      case GameHubStatusEnum.CONNECTED:
        return 'Connecté';
      case GameHubStatusEnum.RECONNECTING:
        return 'Reconnection ...';
      case GameHubStatusEnum.NOT_CONNECTED:
        return 'Connection ...';
      default:
        return null;
    }
  }

}

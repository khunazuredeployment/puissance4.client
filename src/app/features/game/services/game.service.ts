import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { SessionState } from 'src/app/core/states/session.reducers';
import { environment } from 'src/environments/environment';
import { GameStatusEnum } from '../enums/game-status.enum';
import { CoinModel } from '../models/coin.model';
import { GameDetailsModel } from '../models/game-details.model';
import { GameModel } from '../models/game.model';
import { MessageModel } from '../models/message.model';
import { loadGames, loadCurrentGame, newCoin } from '../states/games.reducers';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private _hubConnection!: HubConnection;
  private userId: number|undefined;

  private readonly _errorHandler = () => {
    this._messageService.add({ 
      severity: 'error', 
      summary: 'Erreur inconnue',
      sticky: true,
    });
  }

  constructor(
    private readonly _store: Store<{ session: SessionState }>,
    private readonly _messageService: MessageService,
  ) { 
    this._store.select(state => state.session).subscribe(async ({id, token}) => {
      this.userId = id;
      if(!token) {
        this._hubConnection?.stop();
        this._store.dispatch(loadCurrentGame({ game: null }));
      } else {
        this.createConnection(token);
        await this.startConnection();
      }
    })
  }

  createGame(value: any) {
    this._hubConnection.invoke('createGame', value)
      .catch(this._errorHandler);
  }

  join(value: any) {
    this._hubConnection.invoke('joinGame', value)
      .catch(this._errorHandler);
  }

  leave(value: any) {
    this._hubConnection.invoke('leaveGame', { ...value, definitive: true })
      .catch(this._errorHandler);
  }

  watch(value: any) {
    this._hubConnection.invoke('watchGame', value)
      .catch(this._errorHandler);
  }

  play(value: any) {
    this._hubConnection.invoke('play', value)
      .catch(this._errorHandler);
  }

  private createConnection(token: string) {
    const hubConnectionBuilder: HubConnectionBuilder = new HubConnectionBuilder();
    this._hubConnection = hubConnectionBuilder
      .withUrl(environment.baseSocketUrl + '/game', { 
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
  }

  private async startConnection() {
    await this._hubConnection.start()
      .catch(this._errorHandler);

    this._hubConnection.on('allGames', (games: GameModel[]) => {
      this._store.dispatch(loadGames({ games }));
    });
    
    this._hubConnection.on('currentGame',  (game: GameDetailsModel) => {
      this._store.dispatch(loadCurrentGame({ game }));
    });

    this._hubConnection.on('currentGameClosed',  (game: GameDetailsModel) => {
      if(game?.status === GameStatusEnum.CLOSED) {
        this._messageService.add({ 
          severity: 'info', 
          summary: 'La partie est terminée',
          sticky: true,
        });
        if(game.winnerId) {
          this._messageService.add({ 
            severity: 'info', 
            summary: `Le vainqueur est ${game.winnerUsername}`,
            sticky: true,
          });
        }
      }
    });
    
    this._hubConnection.on('newCoin', (coin: CoinModel) => {
      this._store.dispatch(newCoin({ coin }));
    });

    this._hubConnection.on('message', (message: MessageModel) => {
      this._messageService.add({ 
        severity: message.severity.toLocaleLowerCase(), 
        summary: message.content,
        sticky: message.sticky,
      });
    });
  }

}

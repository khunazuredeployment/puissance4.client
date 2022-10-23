import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { newMessage } from 'src/app/core/states/messages.reducers';
import { SessionState } from 'src/app/core/states/session.reducers';
import { environment } from 'src/environments/environment';
import { GameHubStatusEnum } from '../enums/game-hub-status.enum';
import { GameResultEnum } from '../enums/game-result.enum';
import { CoinModel } from '../models/coin.model';
import { GameDetailsModel } from '../models/game-details.model';
import { GamePlayersConnectionModel } from '../models/game-players-connection.model';
import { GameResultModel } from '../models/game-result.model';
import { GameModel } from '../models/game.model';
import { MessageModel } from '../models/message.model';
import { loadGames, loadCurrentGame, newCoin, changeGameConnectionState, changeGameResult, changeGameHubStatus } from '../states/games.reducers';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private _hubConnection!: HubConnection;

  private readonly _errorHandler = (error: any) => {
    this._store.dispatch(newMessage({ message : { 
      severity: 'error', 
      content: error.message,
      sticky: true,
    }}));
  }

  constructor(
    private readonly _store: Store<{ session: SessionState }>,
    private readonly _messageService: MessageService,
  ) { 
    this._store.select(state => state.session).subscribe(async ({token}) => {
      if(!token) {
        this._hubConnection?.stop();
        this._store.dispatch(loadCurrentGame({ game: null }));
        this._store.dispatch(changeGameHubStatus({status: GameHubStatusEnum.NOT_CONNECTED}));
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

  abandon(value: any) {
    this._hubConnection.invoke('abandonGame', value)
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
    this._hubConnection.start()
      .then(() => {
        this._store.dispatch(changeGameHubStatus({status: GameHubStatusEnum.CONNECTED}));
      });

    this._hubConnection.onclose(() => {
      this._store.dispatch(changeGameHubStatus({status: GameHubStatusEnum.RECONNECTING}));
    });
    
    this._hubConnection.onreconnecting(() => {
      this._store.dispatch(changeGameHubStatus({status: GameHubStatusEnum.RECONNECTING}));
    });

    this._hubConnection.onreconnected(() => {
      this._store.dispatch(changeGameHubStatus({status: GameHubStatusEnum.CONNECTED}));
    });

    this._hubConnection.on('allGames', (games: GameModel[]) => {
      this._store.dispatch(loadGames({ games }));
    });
    
    this._hubConnection.on('currentGame',  (game: GameDetailsModel) => {
      this._store.dispatch(loadCurrentGame({ game }));
    });

    this._hubConnection.on('gamePlayersConnection',  (game: GamePlayersConnectionModel) => {
      this._store.dispatch(changeGameConnectionState({ game }));
    });

    this._hubConnection.on('result',  (game: GameResultModel) => {
      this._store.dispatch(changeGameResult({ game }));
      if(game.result) {
        this._store.dispatch(newMessage({ message : { 
          severity: 'info', 
          content: game.result === 
            GameResultEnum.RED_WIN ? `Le joueur rouge (${game.winnerUsername}) a gagné` : 
            GameResultEnum.YELLOW_WIN ? `Le joueur jaune (${game.winnerUsername}) a gagné` :
            'Partie nulle',
          sticky: true,
        }}));
      }
    });
    
    this._hubConnection.on('newCoin', (coin: CoinModel) => {
      this._store.dispatch(newCoin({ coin }));
    });

    this._hubConnection.on('message', (message: MessageModel) => {
      this._store.dispatch(newMessage({ message }));
    });
  }

}

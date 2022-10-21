import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil, finalize } from 'rxjs';
import { DestroyedComponent } from 'src/app/core/components/destroyed.component';
import { SessionState } from 'src/app/core/states/session.reducers';
import { ColorEnum } from '../../enums/color.enum';
import { GameStatusEnum } from '../../enums/game-status.enum';
import { GameDetailsModel } from '../../models/game-details.model';
import { GameService } from '../../services/game.service';
import { GamesState } from '../../states/games.reducers';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent extends DestroyedComponent implements OnInit {

  currentGame!: GameDetailsModel|null;
  ColorEnum = ColorEnum;
  GameStatusEnum = GameStatusEnum;

  userId?: number;

  constructor(
    private readonly _store: Store<{session: SessionState, gamesFeatures: {games: GamesState}}>,
    private readonly _cd: ChangeDetectorRef,
    private readonly _gameService: GameService,
  ) { super(); }

  ngOnInit(): void {
    this._store.select(state => state.gamesFeatures.games.currentGame)
      .pipe(takeUntil(this.destroyed), finalize(() => this._cd.detectChanges()))
      .subscribe(game => this.currentGame = game);

    this._store.select(state => state.session.id)
      .pipe(takeUntil(this.destroyed), finalize(() => this._cd.detectChanges()))
      .subscribe(id => this.userId = id);
  }

  play(column: number) {
    if(this.currentGame && this.currentGame.status === GameStatusEnum.IN_PROGRESS) {
      if(this.currentGame.redUserId === this.userId || this.currentGame.yellowUserId === this.userId) {
        this._gameService.play({ gameId: this.currentGame.id, column });
      }
    }
  }

  leaveGame() {
    if(this.currentGame) {
      this._gameService.leave({ gameId: this.currentGame.id });
    }
  }
}

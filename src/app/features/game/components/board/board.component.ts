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
    this._store.select(state => state.gamesFeatures.games)
      .pipe(takeUntil(this.destroyed))
      .subscribe(({currentGame}) => {
        this.currentGame = currentGame;
        this._cd.detectChanges();
      });

    this._store.select(state => state.session.id)
      .pipe(takeUntil(this.destroyed))
      .subscribe(id => {
        this.userId = id;
        this._cd.detectChanges();
      });
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
      this._gameService.abandon({ gameId: this.currentGame.id });
    }
  }
}

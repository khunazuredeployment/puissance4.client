import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil, finalize } from 'rxjs';
import { DestroyedComponent } from 'src/app/core/components/destroyed.component';
import { SessionState } from 'src/app/core/states/session.reducers';
import { GameStatusEnum } from '../../enums/game-status.enum';
import { GameDetailsModel } from '../../models/game-details.model';
import { GameModel } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { GamesState } from '../../states/games.reducers';

@Component({
  selector: 'aside[app-games]',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent extends DestroyedComponent implements OnInit {

  allGames!: GameModel[];
  currentGame!: GameDetailsModel|null;

  GameStatusEnum = GameStatusEnum;

  constructor(
    private readonly _store: Store<{session: SessionState, gamesFeatures: {games: GamesState}}>,
    private readonly _cd: ChangeDetectorRef,
    private readonly _gameService: GameService,
  ) { super(); }

  ngOnInit(): void {
    this._store.select(state => state.gamesFeatures.games.allGames)
      .pipe(takeUntil(this.destroyed))
      .subscribe(allGames => {
        this.allGames = allGames;
        this._cd.detectChanges();
      });

    this._store.select(state => state.gamesFeatures.games.currentGame)
      .pipe(takeUntil(this.destroyed))
      .subscribe(game => {
        this.currentGame = game;
        this._cd.detectChanges();
      });
  }

  join(gameId: number) {
    this._gameService.join({ gameId });
  }

  watch(gameId: number) {
    this._gameService.watch({ gameId })
  }

}

import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output()
  createButtonclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  allGames!: GameModel[];
  currentGame!: GameDetailsModel|null;

  GameStatusEnum = GameStatusEnum;

  constructor(
    private readonly _store: Store<{session: SessionState, gamesFeatures: {games: GamesState}}>,
    private readonly _cd: ChangeDetectorRef,
    private readonly _gameService: GameService,
  ) { super(); }

  ngOnInit(): void {
    this._store.select(state => state.gamesFeatures.games)
      .pipe(takeUntil(this.destroyed))
      .subscribe(({allGames, currentGame}) => {
        this.allGames = allGames;
        this.currentGame = currentGame;
        this._cd.detectChanges();
      });
  }

  join(gameId: number) {
    this._gameService.join({ gameId });
  }

  watch(gameId: number) {
    this._gameService.watch({ gameId })
  }

  onClick(event: MouseEvent) {
    this.createButtonclick.emit(event);
  }

}

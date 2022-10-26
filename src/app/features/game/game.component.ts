import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { DestroyedComponent } from 'src/app/core/components/destroyed.component';
import { SessionState, stop } from 'src/app/core/states/session.reducers';
import { GameHubStatusEnum } from './enums/game-hub-status.enum';
import { GameDetailsModel } from './models/game-details.model';
import { GamesState } from './states/games.reducers';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent extends DestroyedComponent implements OnInit {

  session!: SessionState;

  menuOpen: boolean = true;
  dialogOpen: boolean = false;

  gameHubStatus: GameHubStatusEnum = GameHubStatusEnum.NOT_CONNECTED;
  GameHubStatusEnum = GameHubStatusEnum;

  currentGame!: GameDetailsModel|null;

  constructor(
    private readonly _cd: ChangeDetectorRef,
    private readonly _store: Store<{session: SessionState, gamesFeatures: {games: GamesState}}>,
    private readonly _router: Router,
  ) { super(); }

  ngOnInit(): void {
    this._store.select(state => state.gamesFeatures.games.currentGame)
      .pipe(takeUntil(this.destroyed))
      .subscribe((currentGame) => {
        if(!currentGame) {
          this.menuOpen = true;
        }
        if(currentGame && !this.currentGame) {
          this.menuOpen = false;
        }
        this.currentGame = currentGame;
        this._cd.detectChanges();
      });

    this._store.select(state => state.gamesFeatures.games.gameHubStatus)
      .pipe(takeUntil(this.destroyed))
      .subscribe((status) => {
        this.gameHubStatus = status;
        this._cd.detectChanges();
      });

    this._store.select(state => state.session)
      .pipe(takeUntil(this.destroyed))
      .subscribe((session) => {
        this.session = session;
        this._cd.detectChanges();
      });
  }

  logout() {
    this._store.dispatch(stop());
    this._router.navigate(['auth'])
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  
  toggleCreateGameDialog(open: boolean) {
    this.dialogOpen = open;
    this._cd.detectChanges();
  }

}
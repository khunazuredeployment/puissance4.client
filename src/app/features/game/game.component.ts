import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { DestroyedComponent } from 'src/app/core/components/destroyed.component';
import { SessionState, stop } from 'src/app/core/states/session.reducers';
import { GameDetailsModel } from './models/game-details.model';
import { GamesState } from './states/games.reducers';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent extends DestroyedComponent implements OnInit {

  menuOpen: boolean = true;
  dialogOpen: boolean = false;

  currentGame!: GameDetailsModel|null;

  constructor(
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
  }

}
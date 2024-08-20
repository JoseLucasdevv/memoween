import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { FetchJsonService } from './services/fetch-json.service';
import { ImageType } from './types/img-type';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChildren('innerCard') cardComponents!: QueryList<CardComponent>;
  private totalPairs: number = 0;
  private matchedPairs: number = 0;
  gameCompleted: boolean = false;

  private countClick: number = 0;
  controlGame: boolean = false;
  firstElementHTML!: HTMLElement | null;
  secondElementHTML!: HTMLElement | null;
  firstElement: number = 0;
  secondElement: number = 0;
  isDisabled = false;
  title = 'Memory Game';
  results!: Array<ImageType>;
  asyncResults = new BehaviorSubject<Array<ImageType>>(this.results);

  constructor(private readonly fetch: FetchJsonService) {}

  ngOnInit(): void {
    this.fetch.getJson().subscribe((data) => {
      this.results = [...data.data];
      this.asyncResults.next([...data.data]);
    });
  }

  clickButton(e: Event): void {
    this.isDisabled = true;
    this.shuffleData();
    this.cardComponents.forEach((child) => {
      child.flipCardWhenStartForSeconds();
    });
    setTimeout(() => {
      this.controlGame = true;
    }, 2000); // Start the game after the initial flip
  }
  again() {
    console.log('here !')
    this.controlGame = false;
    this.isDisabled = false;
    this.gameCompleted = false;
  }

  selectCard(e: Event): void {
    if (this.countClick >= 2 || !this.controlGame) return;
    if (!e.target) return;

    const element = e.target as HTMLElement;

    if (element.parentElement?.classList.contains('control-flip')) return;

    this.countClick++;
    element.parentElement?.classList.add('control-flip');

    const titleElement = Number(element.getAttribute('title'));

    if (this.countClick === 1) {
      this.firstElementHTML = element.parentElement;
      this.firstElement = titleElement;
    } else if (this.countClick === 2) {
      this.secondElementHTML = element.parentElement;
      this.secondElement = titleElement;

      if (this.checkMatch()) {
        this.resetSelections();
      } else {
        setTimeout(() => {
          this.firstElementHTML?.classList.remove('control-flip');
          this.secondElementHTML?.classList.remove('control-flip');
          this.resetSelections();
        }, 1000);
      }
    }
  }

  checkMatch(): boolean {
    if (this.firstElement === this.secondElement) {
      this.matchedPairs++;
      if (this.matchedPairs === this.totalPairs) {
        this.gameCompleted = true;
      }
      return true;
    }
    return false;
  }
  resetSelections(): void {
    this.countClick = 0;
    this.firstElementHTML = null;
    this.secondElementHTML = null;
  }

  shuffleData(): void {
    for (let i = this.results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.results[i], this.results[j]] = [this.results[j], this.results[i]];
    }
    this.asyncResults.next([...this.results]);
    this.totalPairs = this.results.length / 2;
    this.matchedPairs = 0;
    this.gameCompleted = false;
  }
}

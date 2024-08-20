import { Component,Input, ViewChild,ElementRef } from '@angular/core';




@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],

  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  cardFlipElement!:HTMLElement
  @Input() imageSrc!: String;
  @Input() imageId!: Number;

  @ViewChild('cardFlip') cardFlip!: ElementRef;

  rotationDeg: Number = 0;


  ngAfterViewInit(): void {
    this.cardFlipElement= this.cardFlip.nativeElement;

  }


async flipCardWhenStartForSeconds(){

await new Promise<void>((resolve) => {
  this.cardFlipElement.classList.add('control-flip');
    setTimeout(() => {
      resolve();
    },2000);
  });


  this.cardFlipElement.classList.remove('control-flip');

    }

    flipCardWhenFinish(){
      this.cardFlipElement.classList.remove('control-flip');
    }

}

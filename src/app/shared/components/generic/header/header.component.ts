import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() homepage = false;
  @Input() lastpage = false;
  @Input() subtitle: string;
  @Input() title: string;
  @Output() buttonClicked = new EventEmitter();
  @ViewChild('background', {static: false}) background: ElementRef;
  loaded = false;

  vw;

  imgSrc;

  constructor() { }

  ngOnInit() {
    this.vw = window.innerWidth * 0.01;
    if (this.homepage) {
      this.imgSrc = 'assets/homepage/lucas-benjamin-wQLAGv4_OYs-unsplash.jpg';
    } else if (this.lastpage) {
      this.imgSrc = 'assets/lastpage/lucas-benjamin-R79qkPYvrcM-unsplash.jpg';
    }
    this.loaded = true;
  }

  ngAfter

  ScrollToBottom() {
    const height = this.background.nativeElement.offsetHeight;

    this.buttonClicked.emit(height);
  }

}

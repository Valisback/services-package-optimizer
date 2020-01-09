import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  @Input() lastpage = false;
  @Output() resultsClicked = new EventEmitter();
  @Output() learnMoreClicked = new EventEmitter();


  constructor() { }

  ngOnInit() {}

  buttonClicked(button: string) {
    if (button === 'result') {
      this.resultsClicked.emit();
    } else if (button === 'more') {
      this.learnMoreClicked.emit();
    }
  }
  //resultsClicked(){}



}

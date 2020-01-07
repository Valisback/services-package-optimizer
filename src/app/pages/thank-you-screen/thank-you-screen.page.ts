import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiCallsService } from 'src/app/shared/api-calls/api-calls.service';
import { FormResponse } from 'src/app/shared/models/formResponse';
import { NavController, IonContent } from '@ionic/angular';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { LineToLineMappedSource } from 'webpack-sources';


@Component({
  selector: 'app-thank-you-screen',
  templateUrl: './thank-you-screen.page.html',
  styleUrls: ['./thank-you-screen.page.scss'],
})
export class ThankYouScreenPage implements OnInit {

  formTag: string;
  currentFormAnswers: FormResponse;
  questions: string[] = [];
  maturity_score: number[];
  priority_score: number[];

  totalNumQuestions;
  dataLoaded = false; 

  @ViewChild(IonContent, {static: false}) content: IonContent;

  @ViewChild('barChart', {static: false}) private barchartRef;
  @ViewChild('matrixChart', {static: false}) private matrixchartRef;

  @ViewChild('priorityChart', {static: false}) private prioritychartRef;
  @ViewChild('maturityChart', {static: false}) private maturitychartRef;

  barChart: any;
  matrixChart: any;
  priorityChart: any;
  maturityChart: any;

  labels = ['Vision', 'Governance', 'Leadership', 'Trust', 'Op Model', 'Talent', 'Processes', 'Technology', 'Ecosystem', 'Mobilization'];


  constructor(
    private apiCallService: ApiCallsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private changeDetector: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.tag !== undefined) {
        this.formTag = params.tag;
        if (!this.currentFormAnswers) {
        this.apiCallService.getFormFromTag(this.formTag).subscribe((res) => {
            this.currentFormAnswers = res[0];
        });
      }
     } else {
        console.log('error fetching tag');
      }
  });
}

  formatData() {
    this.priority_score = [];
    this.maturity_score = [];
    this.questions = this.currentFormAnswers.responses.split('###');
    let qcount = 1;
    let i = 1;
    this.questions.forEach( value => {
     if ( !value.includes('Tag') && !value.includes('company are you from')
     && !value.includes('your current role') && value.length > 0) {
      if (!this.maturity_score[qcount]) {
        this.maturity_score[qcount] = 0;
      }
      const n = value.split('\n\n')[1];
      if ( i % 5 === 0) {
        this.priority_score[qcount] = parseInt(n, 10);
        this.maturity_score[qcount] = (this.maturity_score[qcount] / 4) * 10;
        qcount++;
        
      } else if ( n === 'true') {
        this.maturity_score[qcount]++;
      }
      i++;
     }

   });
    this.totalNumQuestions = qcount;
    this.maturity_score.shift();
    this.priority_score.shift();
    this.dataLoaded = true;
    this.changeDetector.detectChanges();
    this.initMatrixChart();
    this.initBarChart();
    this.initHorizontalPriorityChart();
    this.initHorizontalMaturityChart();
   //this.content.scrollToPoint(0, 330, 1500);
  }


  initMatrixChart() {
    let data = [];
    let datasets = [];
    for (let i = 0; i < this.totalNumQuestions - 1; i++) {

      let backgroundColor;
      if (this.priority_score[i] > 5 && this.maturity_score[i] > 5 ) {
        backgroundColor = 'rgba(25, 255, 25, 0.7)'; // Top right quadrant
      } else if ( this.priority_score[i] > 5 ) {
        backgroundColor = 'rgba(225, 128, 0, 0.7)'; // Bottom right quadrant
      } else if ( this.maturity_score[i] > 5 ) {
        backgroundColor = 'rgba(255, 255, 25, 0.7)'; // Top left quadrant
      } else if (this.priority_score[i] == this.maturity_score[i]) {
        backgroundColor = 'rgba(255, 255, 255, 1)'; // Middle
      } else {
        backgroundColor = 'rgba(255, 25, 25, 0.7)'; // Bottom left quadrant

      }

      data.push([{ x: this.priority_score[i], y: this.maturity_score[i] }]);
      datasets.push({data: data[i],
        label: this.labels[i],
        backgroundColor: backgroundColor,
        pointRadius: 4,
        pointHoverRadius: 4
      });
  }


    console.log(datasets);

    this.matrixChart = new Chart(this.matrixchartRef.nativeElement, {
      type: 'scatter',
      data: {
        datasets: datasets
      },
      options: {
        tooltips: {
          callbacks: {
            title: () => {
              return '';
            },
            label: (item, data) => {
              const datasetLabel = data.datasets[item.datasetIndex].label || '';
              const dataPointy = item.yLabel;
              const dataPointx = item.xLabel;

              return datasetLabel + ': ' + '(' + dataPointx + ', ' + dataPointy + ')';
            }
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Priority'
            },
            ticks: {
              beginAtZero: true,
              max: 10,
              stepValue: 1,
              stepSize: 1,
            },
            type: 'myLinear',
            zeroLineTick: 5,
            gridLines: {
              display: true,
              zeroLineWidth: 3,
              drawTicks: true,
            },
            position: 'bottom',
            display: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Maturity'
            },
            ticks: {
              max: 10,
              stepValue: 1,
              stepSize: 1,
              beginAtZero: true,
            },

            type: 'myLinear',
            zeroLineTick: 5,
            gridLines: {
              display: true,
              zeroLineWidth: 3,
              drawTicks: true,
            },
            display: true,
          }],
        }
      }
  });

  }

  initBarChart() {
    let datasets = [{
      data: this.maturity_score,
      backgroundColor: 'rgba(102, 178, 255, 0.7)',
      label: 'Maturity'
    },
      {
        data: this.priority_score,
        backgroundColor: 'rgba(255, 255, 50, 0.7)',
        label: 'Priority'
      }];


    this.barChart = new Chart(this.barchartRef.nativeElement, {
      type: 'bar',
      data: {
        // tslint:disable-next-line: max-line-length
        labels: this.labels,
        datasets: datasets
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              max: 10,
              stepSize: 2,
            },
            display: true
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 10,
              stepValue: 1,
              stepSize: 2,

            },
            display: true
          }],
        }
      }
    });
  }

  initHorizontalPriorityChart() {
    const datasets =  [{data: this.priority_score, backgroundColor: 'rgba(255, 255, 50, 0.7)'}];
    this.priorityChart = new Chart(this.prioritychartRef.nativeElement, {
      type: 'horizontalBar',
      data: {
        // tslint:disable-next-line: max-line-length
        labels: this.labels,
        datasets: datasets,
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              max: 10,
              stepValue: 1,
            },
            display: true
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 10,
              stepValue: 1,
            },
            display: true
          }],
        }
      }
    });
  }

  initHorizontalMaturityChart() {
    const datasets =  [{data: this.maturity_score, backgroundColor: 'rgba(102, 178, 255, 0.7)'}];

    this.maturityChart = new Chart(this.maturitychartRef.nativeElement, {
      type: 'horizontalBar',
      data: {
        // tslint:disable-next-line: max-line-length
        labels: this.labels,
        // tslint:disable-next-line: object-literal-shorthand
        datasets: datasets,
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              max: 10,
              stepValue: 1,
            },
            display: true
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 10,
              stepValue: 1,
            },
            display: true
          }],
        }
      }
    });
  }

}

const defaultConfig = Chart.scaleService.getScaleDefaults('linear');
const Linear = Chart.scaleService.getScaleConstructor('linear');
const myLinear = Linear.extend({
  convertTicksToLabels: function() {
    Linear.prototype.convertTicksToLabels.call(this);
    let zeroLineTick = this.options.zeroLineTick;
    if (zeroLineTick != null) {
      this.zeroLineIndex = this.ticksAsNumbers.indexOf(zeroLineTick);
    }
  }
});
Chart.scaleService.registerScaleType('myLinear', myLinear, defaultConfig);
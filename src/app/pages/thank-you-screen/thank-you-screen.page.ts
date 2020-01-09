import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiCallsService } from 'src/app/shared/api-calls/api-calls.service';
import { FormResponse } from 'src/app/shared/models/formResponse';
import { NavController, IonContent } from '@ionic/angular';
import { Chart } from 'chart.js';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ScoreData } from './models/scoreData';
import { LineToLineMappedSource } from 'webpack-sources';
import { ModalPage } from './component/modal/modal.page';


@Component({
  selector: 'app-thank-you-screen',
  templateUrl: './thank-you-screen.page.html',
  styleUrls: ['./thank-you-screen.page.scss'],
})
export class ThankYouScreenPage implements OnInit {

  title = 'Thank you for completing the assessment!';
  // tslint:disable-next-line: max-line-length
  subtitle = 'We believe the winners will be the ones who re-wire their enterprise to out-think, out-do and outmaneuver disruption. They will be the ones who endure – by sustaining the value of innovation – delivering value across their entire enterprise.'
  formTag: string;
  currentFormAnswers: FormResponse;
  questions: string[] = [];
  maturity_score: number[];
  priority_score: number[];

  priorityScore: number[];
  results: ScoreData[];

  totalNumQuestions;
  dataLoaded = false;

  @ViewChild(IonContent, {static: false}) content: IonContent;

  @ViewChild('barChart', {static: false}) private barchartRef;
  @ViewChild('matrixChart', {static: false}) private matrixchartRef;

  @ViewChild('priorityChart', {static: false}) private prioritychartRef;
  @ViewChild('maturityChart', {static: false}) private maturitychartRef;

  priorityColor = 'rgba(255, 48, 76, 0.8)';
  maturityColor = 'rgba(18, 171, 219, 0.8)';
  actNowColor = 'rgba(149, 230, 22, 0.7)';
  canDoColor = 'rgba(18, 171, 219, 0.7)';
  fixExecutionColor = 'rgba(43, 10, 61, 0.7)';
  avoidColor = 'rgba(255, 48, 76, 0.7)';

  barChart: any;
  matrixChart: any;
  priorityChart: any;
  maturityChart: any;

  jobTitle: string;
  organization: string;

  // Warning: The order of the labels much correspond to the order used in the typeform
  labels = ['Vision', 'Governance', 'Leadership', 'Trust', 'Op Model', 'Talent', 'Processes', 'Technology', 'Ecosystem', 'Mobilization'];


  constructor(
    private apiCallService: ApiCallsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private changeDetector: ChangeDetectorRef,
    public modalController: ModalController,
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

  formatData(height: number) {
    this.priority_score = [];
    this.maturity_score = [];
    this.results = [];
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
        const labelParam = new ScoreData(this.labels[qcount - 1], this.maturity_score[qcount], this.priority_score[qcount]);
        this.results.push(labelParam);
        qcount++;
      } else if ( n === 'true') {
        this.maturity_score[qcount]++;
      }
      i++;
     } else {
       if ( value.includes('your current role') ) {
          this.jobTitle = value.split('\n\n')[1];
       }
       if ( value.includes('company are you from') ) {
        this.organization = value.split('\n\n')[1];
     }
     }
   });
    this.orderResultsByPriority();
    this.totalNumQuestions = qcount;
    this.dataLoaded = true;
    this.changeDetector.detectChanges();
    this.initMatrixChart();
    this.initBarChart();
    this.initHorizontalPriorityChart();
    this.initHorizontalMaturityChart();
    this.content.scrollToPoint(0, height, 600);
  }

  parseResponseString(responseString: string) {

  }


  initMatrixChart() {
    let data = [];
    let datasets = [];
    for (let i = 0; i < this.totalNumQuestions - 1; i++) {

      let backgroundColor;
      if (this.results[i].priority > 5 && this.results[i].maturity > 5 ) {
        backgroundColor = this.actNowColor; // Top right quadrant
      } else if ( this.results[i].priority > 5 ) {
        backgroundColor = this.fixExecutionColor; // Bottom right quadrant
      } else if ( this.results[i].maturity > 5 ) {
        backgroundColor = this.canDoColor; // Top left quadrant
      } else if (this.results[i].priority === this.results[i].maturity) {
        backgroundColor = 'rgba(255, 255, 255, 1)'; // Middle
      } else {
        backgroundColor = this.avoidColor; // Bottom left quadrant

      }

      data.push([{ x: this.results[i].priority, y: this.results[i].maturity }]);
      datasets.push({data: data[i],
        label: this.results[i].label,
        backgroundColor: backgroundColor,
        pointRadius: 6,
        pointHoverRadius: 6
      });
  }

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

  getResultsLabels(): string[] {
    const arrayLabels = [];
    this.results.forEach( elem => {
      arrayLabels.push(elem.label);
    });
    return arrayLabels;
  }

  getResultsMaturities(): number[] {
    const arrayMaturities = [];
    this.results.forEach( elem => {
      arrayMaturities.push(elem.maturity);
    });
    return arrayMaturities;
  }

  getResultsPriorities(): number[] {
    const arrayPriorities = [];
    this.results.forEach( elem => {
      arrayPriorities.push(elem.priority);
    });
    return arrayPriorities;
  }

  orderResultsByPriority() {
    this.results = this.results.sort((a, b) => (a.priority > b.priority ) ? -1 : 1 ); // Sorting array by priority
  }

  initBarChart() {
    const maturities = this.getResultsMaturities();
    const priorities = this.getResultsPriorities();
    const labels = this.getResultsLabels();
    
    let datasets = [
      {
        data: priorities,
        backgroundColor: this.priorityColor,
        label: 'Priority'
      },
      {
        data: maturities,
        backgroundColor: this.maturityColor,
        label: 'Maturity'
      }];


    this.barChart = new Chart(this.barchartRef.nativeElement, {
      type: 'bar',
      data: {
        // tslint:disable-next-line: max-line-length
        labels: labels,
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
    const priorities = this.getResultsPriorities();
    const labels = this.getResultsLabels();
    const datasets =  [{data: priorities, backgroundColor: this.priorityColor}];
    this.priorityChart = new Chart(this.prioritychartRef.nativeElement, {
      type: 'horizontalBar',

      data: {
        // tslint:disable-next-line: max-line-length
        labels: labels,
        datasets: datasets,
      },
      options: {
        legend: {
          display: false
        },

        scales: {
          xAxes: [{
            gridLines: {
              color: '#e9e9e9',
              zeroLineColor: 'white'
            },

            ticks: {
              fontColor: '#e9e9e9',
              beginAtZero: true,
              max: 10,
              stepValue: 1,
            },

            display: true
          }],
          yAxes: [{
            gridLines: {
              display: false,
              zeroLineColor: 'white',
              color: '#e9e9e9'
          },
            ticks: {
              fontColor: '#e9e9e9',
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
    this.results.sort((a, b) => (a.maturity > b.maturity ) ? -1 : 1 ); // Sorting array by maturity
    const maturities = this.getResultsMaturities();
    const labels = this.getResultsLabels();

    const datasets =  [{data: maturities, backgroundColor: this.maturityColor}];

    this.maturityChart = new Chart(this.maturitychartRef.nativeElement, {
      type: 'horizontalBar',
      data: {
        // tslint:disable-next-line: max-line-length
        labels: labels,
        // tslint:disable-next-line: object-literal-shorthand
        datasets: datasets,
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: '#e9e9e9',
              zeroLineColor: 'white'
            },
            ticks: {
              fontColor: '#e9e9e9',
              beginAtZero: true,
              max: 10,
              stepValue: 1,
            },
            display: true
          }],

          yAxes: [{
            gridLines: {
              display: false,
              color: '#e9e9e9'
            },
            ticks: {
              fontColor: '#e9e9e9',
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


  openContactPage() {
    const modalTitle = 'Learn More';
    const learnMore = true;
    const cssClass = 'img-modal-css contact';
    this.presentModal(modalTitle, learnMore, cssClass);
  }

  sendResults() {
    const learnMore = false;
    const cssClass = 'img-modal-css result';
    const modalTitle = 'Send Results';
    this.presentModal(modalTitle, learnMore, cssClass);
  }

  async presentModal(title: string, learnMore: boolean, cssClass: string) {
    const modal = await this.modalController.create({
      component: ModalPage,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: cssClass,
      componentProps: {
        modalController: this.modalController,
        title: title,
        learnMore: learnMore,
        organization: this.organization,
        jobTitle: this.jobTitle
      }
    });
    return await modal.present();
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
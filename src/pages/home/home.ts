import { Component, Input } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { RecordProvider } from "../../providers/record/record";
import * as io from 'socket.io-client';
import { HOST } from "../../providers/config";

import Chart from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @Input()
  chart: any;
  dataset: any = {};
  socket: any;
  record: any = {};
  tempColor: number = 1;

  constructor(
    public navCtrl: NavController,
    private recordProvider: RecordProvider
  ) {
    this.record = {
      "date": new Date("2017-07-23T22:03:11.330Z"),
      "year": 2017,
      "month": 6,
      "day": 23,
      "hour": 16,
      "min": 3,
      "sec": 11,
      "food": 8,
      "water": 66,
      "temperature": 19,
      "gas": false,
      "presence": true
    };
    this.socket = io(HOST);
    this.socket.on('new record', data => {
      console.log('new record', data);
      this.updateChart(data);
    });
  }

  ionViewWillEnter() {

    this.dataset = {
      label: 'Consumibles',
      data: [2, 2],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1
    };

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: ["Comida", "Agua"],
        datasets: [this.dataset]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100,
              suggestedMin: 15,
              suggestedMax: 50
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100,
              suggestedMin: 15,
              suggestedMax: 50
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    this.chart = myChart;

    this.recordProvider.getRecord('current').subscribe(data => {
      console.log('getting current record');
      if (data.record) {
        this.updateChart(data);
      } else {
        console.log('no record from API', data);
      }
    }, err => {
      console.log('error getting current record');
      console.log(err);
    });
  }

  updateChart({ record }) {
    console.log('updating data');
    this.record = record;
    let data = [];
    if (record) {
      data.push(record.food || 0);
      data.push(record.water || 0);

      if (record.temperature < 10) {
        this.tempColor = 0;
      } else
      if (record.temperature < 25) {
        this.tempColor = 1;
      } else {
        this.tempColor = 2;
      }
    } else {
      data = [0, 0];
      this.tempColor = 1;
    }

    this.chart.data.datasets[0].data = data;

    this.chart.update();
    this.chart.resize();
  }

}
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Employee, Orders, ServiceService } from '../services/service.service';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orders:Orders[]=[]
  chartOptions={}
  Highcharts=Highcharts
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 1, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 1 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver,public service:ServiceService,public firestore:Firestore,) {}
  ngOnInit(): void {
    this.service.getOrders().subscribe((res: Orders[]) => {
      this.orders = res;
    })

    this.chartOptions={
      chart: {
        type: 'arearange',
        zoomType: 'x',
        scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1
        }
    },
    credits:{
      enabled:false
    },

    title: {
        text: 'Orders variation by day'
    },

    xAxis: {
        type: 'datetime',
        accessibility: {
            rangeDescription: 'Range: Jan 1st 2017 to Dec 31 2017.'
        }
    },

    yAxis: {
        title: {
            text: null
        }
    },

    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '',
        xDateFormat: '%A, %b %e'
    },

    legend: {
        enabled: false
    },

    series: [{
        name: 'Orders',
        data: [[1483232400000, 1.4, 4.7],
        [1483318800000, -1.3, 1.9],
        [1483405200000, -0.7, 4.3],
        [1483491600000, -5.5, 3.2],
        [1483578000000, -9.9, -6.6],
        [1483664400000, -9.6, 0.1],
        [1483750800000, -0.9, 4.0],
        [1483837200000, -2.2, 2.9],
        [1483923600000, 1.3, 2.3],
        [1484010000000, -0.3, 2.9],
        [1484096400000, 1.1, 3.8],
        [1484182800000, 0.6, 2.1],
        [1484269200000, -3.4, 2.5],
        [1484355600000, -2.9, 2.0],
        [1484442000000, -5.7, -2.6],]
    }]
    }
  }


}

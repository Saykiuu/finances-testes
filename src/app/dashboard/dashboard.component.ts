import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/http/requestService';
import { Chart, registerables } from 'chart.js';
import { min } from 'rxjs/operators';
import { interval } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: RequestService) { }

  loadGrafico: boolean = false;
  loadHistorico: boolean = false;
  loadEntrada: boolean = false;
  loadSaldo: boolean = false;
  loadSaida: boolean = false;

  saldoFinal: number = 0;
  saidasTotais: number = 0;
  entradasTotais: number = 0;


  historico: {
    causa: string,
    valor: number,
    tipo: string,
    data: string
  }[] = [];

  public chart: any;

  ngOnInit(): void {
    this.getDados();
  }

  getDados() {
    this.getEntradas();
    this.getsaldo();
    this.getsaidas();
    this.getHistorico();
    this.getSaldoPorMes();
  }

  async getHistorico() {
    try {
      this.loadHistorico = true;
      let con = await this.http.getRequest('tesouraria/transacao/historicoLimited').toPromise();
      this.historico = [];
      if (con.status == 200) {
        for (let d of con.result) {
          this.historico.push(d)
        }
      }
      this.loadHistorico = false;
    } catch (error) {
      this.loadHistorico = false;
      console.log(error)

    }
  }

  formatValores(val: number) {
    let formated = val.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    return formated;
  }

  formatData(data: string) {
    let splited = data.split('-')
    return splited[2] + '/' + splited[1] + '/' + splited[0];
  }

  async getsaldo() {
    try {
      this.loadSaldo = true
      let con = await this.http.getRequest('tesouraria/transacao/getSaldo').toPromise();
      console.log(con);
      if (con.status == 200) {
        console.log(con);
        this.saldoFinal = con.result[0].saldo;
      }
      this.loadSaldo = false
    } catch (error) {
      this.loadSaldo = false
      console.log(error)
    }
  }

  async getsaidas() {
    try {
      this.loadSaida = true
      let con = await this.http.getRequest('tesouraria/transacao/getSaida').toPromise();
      if (con.status == 200) {

        this.saidasTotais = con.result[0].saida;
      }
      this.loadSaida = false
    } catch (error) {
      this.loadSaida = false
      console.log(error)
    }
  }

  async getEntradas() {
    try {
      this.loadEntrada = true
      let con = await this.http.getRequest('tesouraria/transacao/getEntrada').toPromise();
      if (con.status == 200) {

        this.entradasTotais = con.result[0].entradas;
      }
      this.loadEntrada = false
    } catch (error) {
      this.loadEntrada = false
      console.log(error)
    }
  }


  async getSaldoPorMes() {
    try {
      this.loadGrafico = true;
      let con = await this.http.getRequest('tesouraria/transacao/getSaldoPorMes').toPromise();
      if (con.status == 200) {
        let labls: any[] = [];
        let data: any[] = [];
        con.result.forEach((e: any) => {
          const date = new Date(e.mes)
          const futureDate = new Date(date.setHours(date.getHours() + 3));
          labls.push(new Date(futureDate).toLocaleDateString('default', { month: 'short' }));
          data.push(e.saldo);
        });

        this.createChart(labls, data);


        const val = {

        }
      }
      this.loadGrafico = false;
    } catch (error) {
      this.loadGrafico = false;
      console.log(error)

    }
  }

  createChart(labls: any[], valores: any[]) {
    const data = {
      labels: labls,
      datasets: [{
        label: 'Grafico de saldo dos ultimos 6 meses',
        data: valores,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true

          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      },
    })
  }
}

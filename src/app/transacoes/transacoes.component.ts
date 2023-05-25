import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RequestService } from 'src/app/http/requestService';
import { ToastService } from 'src/app/toast-service/toast.service';
import { Formate } from 'src/app/util.service/format.service';

@Component({
  selector: 'app-transacoes',
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css']
})
export class TransacoesComponent implements OnInit {

  @ViewChild('filtro') modalFiltro: ModalDirective | undefined
  @ViewChild('view') modalDetalhes: ModalDirective | undefined
  @ViewChild('cadastro') modalCadastro: ModalDirective | undefined

  constructor(
    private toast: ToastService,
    private http: RequestService,
    private form: Formate
  ) { }

  disabledInput: boolean = false;

  loading: boolean = false;

  listTransacoes: {
    data: Date,
    id: number,
    obs: string,
    valor: number
    tag: string,
    tipo: string,
    causa: string,
  }[] = [];

  listaDebitos: Array<{
    id: number,
    descricao: string,
    valor: number,
    atual_p: number,
    qtd_p: number
  }> = [];

  listMembros: {
    id: number,
    nome: string
  }[] = [];

  filtros: {
    data_inicial: Date,
    data_final: Date,
    pesquisa: string,
    tipo: string
  } = {
      data_inicial: new Date(),
      data_final: new Date(),
      pesquisa: '',
      tipo: ''
    };

  newTransacao: {
    tipo: string,
    tag: string,
    descricao: string,
    valor: string,
    exibir_membros: boolean,
    desabilitar: boolean,
    desabilitar_valor: boolean,
    exibir_debitos: boolean,
    obs: string
  } = {
      descricao: '',
      tag: 'dizimos',
      tipo: 'E',
      valor: '',
      exibir_membros: true,
      desabilitar: false,
      desabilitar_valor: false,
      exibir_debitos: false,
      obs: ''

    }

  detalheTransacao: {
    data: Date,
    id: number,
    obs: string,
    valor: number
    tag: string,
    tipo: string,
    causa: string,
  } = {
      data: new Date(),
      id: 0,
      obs: '',
      valor: 0,
      tag: '',
      tipo: '',
      causa: ''
    }

  changeTag(e: any) {
    if (e.target.value == 'dizimos') {
      this.newTransacao.exibir_membros = true
      this.newTransacao.desabilitar = false
    } else if (e.target.value == 'ofertas') {
      this.newTransacao.exibir_membros = false
      this.newTransacao.desabilitar = true
    } else if (e.target.value == 'doacao') {
      this.newTransacao.exibir_membros = false
      this.newTransacao.desabilitar = false
    }

    this.newTransacao.descricao = '';
  }

  showListDebitos() {
    this.newTransacao.descricao = '';
    this.newTransacao.valor = '';
    this.newTransacao.desabilitar_valor = !this.newTransacao.desabilitar_valor
  }

  changeTipo(val: string) {
    this.newTransacao.descricao = '';
    this.newTransacao.tipo = val
    if (val == 'S') {
      this.newTransacao.tag = 'saida'
    } else {
      this.newTransacao.tag = 'dizimos'
    }
  }

  changeDebitos(e: any) {
    let temp = this.listaDebitos.filter(debito => debito.id == e.target.value)
    this.newTransacao.valor = temp[0].valor.toLocaleString('pt-br', { maximumFractionDigits: 2 });
  }

  ngOnInit(): void {
    let today = new Date();
    this.filtros.data_inicial = new Date(today.getFullYear(), today.getMonth(), 1),
      this.filtros.data_final = new Date(today.getFullYear(), today.getMonth() + 1, 0),

      this.getListaTransacao();
    this.getDebitos();
    this.getUsuarios()
  }

  async getDebitos() {
    this.listaDebitos = [];
    try {

      let con = await this.http.getRequest('tesouraria/debitos/listaDebitos/' + JSON.stringify({ status: 'A' })).toPromise();
      if (con.status == 200) {
        con.result.forEach((e: any) => {
          this.listaDebitos.push({
            id: e.id,
            descricao: e.descricao,
            atual_p: e.atual_parcela,
            qtd_p: e.qtd_parcelas,
            valor: e.valor_p
          });
        });
      } else if (con.status == 204) {
        this.listaDebitos = [{ id: 0, descricao: 'Sem débitos', valor: 0.0, atual_p: 0, qtd_p: 0 }]
      }
    } catch (error) {
      this.listaDebitos = [{ id: 0, descricao: 'Sem débitos', valor: 0.0, atual_p: 0, qtd_p: 0 }]
      this.toast.addToast({
        mensagem: 'Erro ao consultar Debitos!',
        tipo: 'E',
        titulo: 'Erro'
      })
    }
  }

  async getUsuarios() {
    this.listMembros = [];
    try {
      let con = await this.http.getRequest('tesouraria/membros/consulta').toPromise();

      if (con.status == 200) {

        con.result.forEach((e: any) => {
          this.listMembros.push({
            id: e.id,
            nome: e.nome
          });
        });
      }
    } catch (error) {
      this.toast.addToast({
        mensagem: 'Erro ao consultar usuarios!',
        tipo: 'E',
        titulo: 'Erro'
      })
    }
  }

  async getListaTransacao() {
    try {
      this.loading = true
      let con = await this.http.postRequest('tesouraria/transacao/listar', this.filtros).toPromise();
      this.listTransacoes = [];
      if (con.status == 200) {
        for (let i = 0; i < con.result.length; i++) {
          const element = con.result[i];
          this.listTransacoes.push(element);
        }
      }
      this.loading = false

    } catch (error) {
      this.loading = false

      this.toast.addToast({
        mensagem: 'Erro ao consultar transações!',
        tipo: 'E',
        titulo: 'Erro'
      })
    }
  }

  filtrar() {
    this.getListaTransacao();
    this.modalFiltro?.hide();
  }

  formatData(val: Date) {
    return this.form.data(val)
  }

  formatValores(val: number, tipo: string) {
    let temp = '+'
    if (tipo == 'S') {
      temp = '-'
    }
    return temp + this.form.moeda(val);
  }

  formatTipo(val: string) {
    if (val == 'E') {
      return 'Entrada'
    } else {
      return 'Saída'
    }
  }

  openModalCadastro() {
    this.modalCadastro?.show()
  }

  openModalEdit(id: number) {
  }

  openModalFiltro() {
    this.modalFiltro?.show();
  }

  async salvar() {
    try {
      this.disabledInput = true
      this.loading = true;
      let temp = {
        tipo: this.newTransacao.tipo,
        obs: this.newTransacao.obs,
        valor: this.newTransacao.valor,
        tag: this.newTransacao.tag,
        causa: this.newTransacao.descricao,
        id_debito: ''
      }

      if (this.newTransacao.exibir_debitos && this.newTransacao.tipo == 'S') {
        let aux1 = temp.causa
        let aux = this.listaDebitos.filter(e => e.id.toString() == temp.causa);
        temp.causa = `${aux[0].descricao} - ${aux[0].atual_p}/${aux[0].qtd_p}`
        temp.id_debito = aux1;
      } else {
        temp.id_debito = 'null';
      }
      let con = await this.http.postRequest('tesouraria/transacao/insert', temp).toPromise();
      if (con.status == 200) {
        this.modalCadastro?.hide();
        if (this.newTransacao.exibir_debitos) {
          this.getDebitos()
        }
        this.newTransacao.valor = '';

        this.getListaTransacao()
        this.toast.addToast({
          mensagem: 'Salvo com sucesso!',
          tipo: 'S',
          titulo: 'Sucesso'
        })
      }
      this.disabledInput = false

    } catch (error) {
      this.toast.addToast({
        mensagem: 'Erro ao inserir! Tente novamente mais tarde',
        tipo: 'E',
        titulo: 'Erro:'
      })
      this.disabledInput = false

    }
  }

  openModalDetalhes(id: number) {
    let temp = this.listTransacoes.filter(e => e.id == id);
    this.detalheTransacao = temp[0];
    this.modalDetalhes?.show()
  }

}

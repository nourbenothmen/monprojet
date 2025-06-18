import { Component, OnInit } from '@angular/core';
import { FactureService, ClientLoyalty ,ClientDebt} from 'src/app/demo/services/facture.service';
import { FactureStatus } from 'src/app/models/facture.modal';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProductSaleComponent } from './product-sale/product-sale.component';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProduitService } from 'src/app/demo/services/produit.service';
import { ClientService } from 'src/app/demo/services/client.service';
import { Produit } from 'src/app/models/produit.modal';

@Component({
  selector: 'app-dash-analytics',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule, ProductSaleComponent, FormsModule],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})


export class DashAnalyticsComponent implements OnInit {
  cards = [
    {
      background: 'bg-c-blue',
      title: 'Orders Received',
      icon: 'icon-shopping-cart',
      text: 'Completed Orders',
      number: '486',
      no: '351'
    },
    {
      background: 'bg-c-green',
      title: 'Total Sales',
      icon: 'icon-tag',
      text: 'This Month',
      number: '1641',
      no: '213'
    },
    {
      background: 'bg-c-yellow',
      title: 'Revenue',
      icon: 'icon-repeat',
      text: 'This Month',
      number: '$42,56',
      no: '$5,032'
    },
    {
      background: 'bg-c-red',
      title: 'Total Profit',
      icon: 'icon-shopping-cart',
      text: 'This Month',
      number: '$9,562',
      no: '$542'
    }
  ];

  pie1CAC: any = {
    series: [],
    labels: ["Factures réglées", "Factures non réglées"],
    chart: {
      type: "pie",
      height: 300
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        return opts.w.config.series[opts.seriesIndex] + "%";
      }
    },
    colors: ["#4CAF50", "#F44336"],
    legend: {
      position: "bottom"
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: "bottom"
        }
      }
    }]
  };

  bar1CAC: any = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    series: [
      {
        name: 'Chiffre d’Affaires (TND)',
        data: []
      }
    ],
    colors: ['#4CAF50'],
    xaxis: {
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    },
    yaxis: {
      title: {
        text: 'Chiffre d’Affaires (TND)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toLocaleString() + ' TND';
        }
      }
    }
  };

  years: number[] = [];
  selectedYear: number | null = null;
  loyalClients: ClientLoyalty[] = []; // Nouvelle propriété pour stocker les clients fidèles
  mostRequestedProducts: any[] = [];
  productLimitOptions = [3, 5, 10, 20];
  selectedProductLimit = 5;
  isLoadingProducts = false;
  bestSellingProducts: any[] = [];
  selectedBestSellingLimit = 5;
  isLoadingBestSellers = false;
  outOfStockProducts: Produit[] = [];
  isLoadingOutOfStock = false;
  totalRemainingAmount: number = 0; // Nouvelle propriété pour le reste global
  //debtsByClient: Map<number, number> = new Map<number, number>(); // Nouvelle propriété
  totalClients: number = 0; // Nouveau total des clients
  totalProduits: number = 0; // Nouveau total des produits
  debtsByClient: ClientDebt[] = [];



  constructor(private factureService: FactureService, private produitService: ProduitService ,private clientService: ClientService ) { }

  ngOnInit(): void {
    this.loadInvoiceStats();
    this.loadAvailableYears();
    this.loadMostRequestedProducts(); // Charger les produits au démarrage
    this.loadBestSellingProducts();
    this.loadOutOfStockProducts();
    this.loadTotalRemainingAmount();
    this.loadDebtsByClient(); // Charger les dettes au démarrage
    this.loadTotals();

  }

  loadInvoiceStats(): void {
    this.factureService.getAllFactures().subscribe(factures => {
      const paidCount = factures.filter(f => f.status === FactureStatus.REGLE).length;
      const unpaidCount = factures.filter(f => f.status === FactureStatus.NON_REGLE).length;
      const total = paidCount + unpaidCount;

      const paidPercentage = total > 0 ? Math.round((paidCount / total) * 100) : 0;
      const unpaidPercentage = total > 0 ? Math.round((unpaidCount / total) * 100) : 0;

      this.pie1CAC.series = [paidPercentage, unpaidPercentage];
    });
  }

  

  loadAvailableYears(): void {
    this.factureService.getAllFactures().subscribe(factures => {
      const yearsSet = new Set(factures.map(f => new Date(f.dateFacture).getFullYear()));
      this.years = Array.from(yearsSet).sort((a, b) => a - b);
      if (this.years.length > 0) {
        this.selectedYear = this.years[this.years.length - 1];
        this.loadYearlyCAStats();
        this.loadLoyalClients(); // Charger les clients fidèles lors de l'initialisation
      }
    });
  }

  loadYearlyCAStats(): void {
    if (this.selectedYear) {
      this.factureService.getCAByMonthForYear(this.selectedYear).subscribe({
        next: caByMonth => {
          this.bar1CAC.series = [
            {
              name: 'Chiffre d’Affaires (TND)',
              data: caByMonth
            }
          ];
        },
        error: err => console.error('Erreur lors du chargement du CA:', err)
      });
    }
  }

  loadLoyalClients(): void {
    if (this.selectedYear) {
      this.factureService.getTopLoyalClientsByYear(this.selectedYear).subscribe({
        next: clients => {
          this.loyalClients = clients;
          console.log('Clients fidèles:', clients);
        },
        error: err => console.error('Erreur lors du chargement des clients fidèles:', err)
      });
    }
  }

  onYearChange(event: any): void {
    this.selectedYear = +event.target.value;
    this.loadYearlyCAStats();
  }
  loadMostRequestedProducts(): void {
    this.isLoadingProducts = true;
    this.produitService.getMostRequestedProducts(this.selectedProductLimit)
      .pipe(
        catchError(error => {
          console.error('Error loading most requested products:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (products: any[]) => {
          this.mostRequestedProducts = products;
          this.isLoadingProducts = false;
        },
        error: (err: any) => {
          console.error(err);
          this.isLoadingProducts = false;
        }
      });
  }
  // Ajoutez cette méthode
  loadBestSellingProducts(): void {
    if (!this.selectedYear) return;

    this.isLoadingBestSellers = true;
    this.produitService.getBestSellingProductsByYear(this.selectedYear, this.selectedBestSellingLimit)
      .pipe(
        catchError(error => {
          console.error('Error loading best selling products:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (products: any[]) => {
          this.bestSellingProducts = products;
          this.isLoadingBestSellers = false;
        },
        error: (err: any) => {
          console.error(err);
          this.isLoadingBestSellers = false;
        }
      });
  }


loadOutOfStockProducts(): void {
  this.isLoadingOutOfStock = true;
  this.produitService.getOutOfStockProducts()
    .pipe(
      catchError(error => {
        console.error('Error loading out of stock products:', error);
        return of([]);
      })
    )
    .subscribe({
      next: (products: Produit[]) => {
        this.outOfStockProducts = products;
        this.isLoadingOutOfStock = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoadingOutOfStock = false;
      }
    });
}

loadTotalRemainingAmount(): void {
    this.factureService.getTotalRemainingAmount().subscribe({
      next: (amount: number) => {
        this.totalRemainingAmount = amount;
        console.log('Reste global des montants non payés:', amount);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement du reste global:', err);
        this.totalRemainingAmount = 0; // Valeur par défaut en cas d'erreur
      }
    });
  }


  onProductLimitChange(): void {
    this.loadMostRequestedProducts();
  }
/*
// Nouvelle méthode pour charger les dettes par client
  loadDebtsByClient(): void {
    this.factureService.getDebtsByClient().subscribe({
      next: (debts: Map<number, number>) => {
        this.debtsByClient = debts;
        console.log('Dettes par client:', debts);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des dettes par client:', err);
        this.debtsByClient = new Map<number, number>(); // Map vide en cas d'erreur
      }
    });
  }*/

 loadDebtsByClient(): void {
  this.factureService.getDebtsByClient().subscribe({
    next: (debts: ClientDebt[]) => {
      this.debtsByClient = debts;
      console.log('Dettes par client:', debts);
    },
    error: (err: any) => {
      console.error('Erreur lors du chargement des dettes par client:', err);
      this.debtsByClient = [];
    }
  });
}   

  // Nouvelle méthode pour charger les totaux
  loadTotals(): void {
    forkJoin({
      clients: this.clientService.getTotalClients(),
      produits: this.produitService.getTotalProduits()
    }).subscribe({
      next: (results) => {
        this.totalClients = results.clients;
        this.totalProduits = results.produits;
        console.log('Total clients:', this.totalClients, 'Total produits:', this.totalProduits);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des totaux:', err);
        this.totalClients = 0;
        this.totalProduits = 0;
      }
    });
  }



}
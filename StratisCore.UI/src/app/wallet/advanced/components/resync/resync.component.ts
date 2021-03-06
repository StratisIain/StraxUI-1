import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { Subscription } from 'rxjs';

import { ApiService } from '@shared/services/api.service';
import { GlobalService } from '@shared/services/global.service';
import { NodeService } from '@shared/services/node-service';
import { WalletService } from '@shared/services/wallet.service';
import { WalletResync } from '@shared/models/wallet-rescan';
import { SnackbarService } from 'ngx-snackbar';

@Component({
  selector: 'app-resync',
  templateUrl: './resync.component.html',
  styleUrls: ['./resync.component.scss']
})
export class ResyncComponent implements OnInit, OnDestroy {
  @Output() rescanStarted = new EventEmitter<boolean>();
  constructor(
    private globalService: GlobalService,
    private snackbarService: SnackbarService,
    private apiService: ApiService,
    private walletService: WalletService,
    private nodeService: NodeService,
    private fb: FormBuilder) {
  }


  private walletName: string;
  private lastBlockSyncedHeight: number;
  private chainTip: number;
  private isChainSynced: boolean;
  public isSyncing = true;
  private generalWalletInfoSubscription: Subscription;
  public minDate = new Date('2009-08-09');
  public maxDate = new Date();
  public bsConfig: Partial<BsDatepickerConfig>;
  public rescanWalletForm: FormGroup;

  formErrors = {
    'walletDate': ''
  };

  validationMessages = {
    'walletDate': {
      'required': 'Please choose the date the wallet should sync from.'
    }
  };

  ngOnInit(): void {
    this.walletName = this.globalService.getWalletName();
    this.startSubscriptions();
    this.buildRescanWalletForm();
    this.bsConfig = Object.assign({}, {showWeekNumbers: false, containerClass: 'theme-dark-blue'});
  }

  ngOnDestroy(): void {
    this.cancelSubscriptions();
  }

  private buildRescanWalletForm(): void {
    this.rescanWalletForm = this.fb.group({
      'walletDate': ['', Validators.required],
    });

    this.rescanWalletForm.valueChanges
      .subscribe(() => this.onValueChanged());

    this.onValueChanged();
  }

  onValueChanged(): void {
    if (!this.rescanWalletForm) {
      return;
    }
    const form = this.rescanWalletForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  public onResyncClicked(): void {
    const rescanDate = new Date(this.rescanWalletForm.get('walletDate').value);
    rescanDate.setDate(rescanDate.getDate() - 1);

    const rescanData = new WalletResync(
      this.walletName,
      rescanDate,
      false
    );

    this.walletService
      .rescanWallet(rescanData)
      .toPromise().then(
      () => {
        this.rescanStarted.emit(true);
        this.snackbarService.add({
          msg: 'Your wallet is now re-syncing in the background, this may take a few minutes.',
          customClass: 'notify-snack-bar',
          action: {
            text: null
          }
        });
      }
    );
  }

  private getGeneralWalletInfo(): void {
    this.generalWalletInfoSubscription = this.nodeService.generalInfo()
      .subscribe(
        response => {
          const generalWalletInfoResponse = response;
          this.lastBlockSyncedHeight = generalWalletInfoResponse.lastBlockSyncedHeight;
          this.chainTip = generalWalletInfoResponse.chainTip;
          this.isChainSynced = generalWalletInfoResponse.isChainSynced;

          if (this.isChainSynced && this.lastBlockSyncedHeight === this.chainTip) {
            this.isSyncing = false;
          } else {
            this.isSyncing = true;
          }
        },
        () => {
          this.cancelSubscriptions();
        }
      )
    ;
  }

  private cancelSubscriptions(): void {
    if (this.generalWalletInfoSubscription) {
      this.generalWalletInfoSubscription.unsubscribe();
    }
  }

  private startSubscriptions(): void {
    this.getGeneralWalletInfo();
  }

}

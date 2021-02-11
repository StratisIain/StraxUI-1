import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinNotationPipe } from './pipes/coin-notation.pipe';
import { NumberToStringPipe } from './pipes/number-to-string.pipe';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { PasswordValidationDirective } from './directives/password-validation.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxElectronModule } from 'ngx-electron';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClipboardModule } from 'ngx-clipboard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GenericModalComponent } from './components/generic-modal/generic-modal.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { SecondsToStringPipe } from '@shared/pipes/seconds-to-string.pipe';
import { ApiService } from '@shared/services/api.service';
import { SignalRService } from '@shared/services/signalr-service';
import { WalletService } from '@shared/services/wallet.service';
import { StakingService } from '@shared/services/staking-service';
import { SideBarComponent } from '@shared/components/side-bar/side-bar.component';
import { TaskBarComponent } from './components/task-bar/task-bar.component';
import { TaskBarItemHostDirective } from '@shared/components/task-bar/task-bar-item-host-directive';
import { TaskBarService } from '@shared/services/task-bar-service';
import { ConsensusService } from './services/consensus-service';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CoinNotationPipe,
    NumberToStringPipe,
    SecondsToStringPipe,
    AutoFocusDirective,
    PasswordValidationDirective,
    GenericModalComponent,
    LoadingModalComponent,
    ConfirmationModalComponent,
    SideBarComponent,
    TaskBarComponent,
    TaskBarItemHostDirective
  ],
  providers: [
    ApiService,
    WalletService,
    SignalRService,
    StakingService,
    TaskBarService,
    ConsensusService
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxElectronModule,
    NgxQRCodeModule,
    NgxPaginationModule,
    ClipboardModule,
    GenericModalComponent,
    CoinNotationPipe,
    NumberToStringPipe,
    SecondsToStringPipe,
    AutoFocusDirective,
    PasswordValidationDirective,
    LoadingModalComponent,
    ConfirmationModalComponent,
    SideBarComponent,
    TaskBarComponent,
    TaskBarItemHostDirective
  ]
})

export class SharedModule {
}

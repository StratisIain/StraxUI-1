import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GeneralInfo, WalletBalance } from '@shared/services/interfaces/api.i';
import { NodeService } from '@shared/services/node-service';
import { WalletService } from '@shared/services/wallet.service';
import { GlobalService } from '@shared/services/global.service';

@Component({
  selector: 'status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {
  public generalInfo: Observable<GeneralInfo>;
  public walletInfo: Observable<WalletBalance>;
  public percentSynced: string;
  public toolTip = '';
  public connectedNodesTooltip = '';

  constructor(
    public globalService: GlobalService,
    private walletService: WalletService,
    private nodeService: NodeService) {
  }

  public ngOnInit(): void {
    this.walletInfo = this.walletService.wallet();
    this.generalInfo = this.nodeService.generalInfo()
      .pipe(tap(
        response => {
          // Don't show if wallet is ahead of chainTip
          if (response.lastBlockSyncedHeight > response.chainTip) {
            response.chainTip = response.lastBlockSyncedHeight;
          }

          this.percentSynced = (response.percentSynced || 0).toFixed(0) + '%';
          const processedText = `Processed ${response.lastBlockSyncedHeight || '0'} out of ${response.chainTip} blocks.`;

          this.toolTip = `Synchronizing. ${processedText}`;

          if (response.connectedNodes === 1) {
            this.connectedNodesTooltip = '1 connection';
          } else if (response.connectedNodes >= 0) {
            this.connectedNodesTooltip = `${response.connectedNodes} connections`;
          }

          if (response.percentSynced === 100) {
            this.toolTip = `Up to date.  ${processedText}`;
          }
        }));
  }

}

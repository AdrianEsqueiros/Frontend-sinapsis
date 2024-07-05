import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Message } from '../messages/message.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-detail-dialog',
  templateUrl: './message-detail-dialog.component.html',
  standalone: true,
  imports: [MatCardModule,MatButtonModule,MatDialogModule,CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class MessageDetailDialog {
  constructor(
    public dialogRef: MatDialogRef<MessageDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Message
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MessagesService } from './messages.service';
import { Message } from './message.model';
import { MessageStatus } from './message-status.enum';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MessageDetailDialog } from '../message-detail-dialog/message-detail-dialog.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatDialogModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {
  messageForm: FormGroup;
  filterForm: FormGroup;
  messages: MatTableDataSource<Message> = new MatTableDataSource<Message>([]);
  displayedColumns: string[] = ['campaignId', 'phone', 'text', 'process_date', 'process_hour', 'shipping_status', 'actions'];
  editing: boolean = false;
  currentMessageId?: number;
  MessageStatus = MessageStatus;

  constructor(private fb: FormBuilder, private messagesService: MessagesService, private dialog: MatDialog) {
    this.messageForm = this.fb.group({
      phone: [''],
      text: [''],
      process_date: [''],
      process_hour: [''],
      shipping_status: [MessageStatus.PENDING],
      campaignId: [null]
    });

    this.filterForm = this.fb.group({
      campaignId: ['']
    });
  }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this.messagesService.getMessages().subscribe((data: Message[]) => {
      this.messages.data = data;
    });
  }

  filterMessages() {
    const campaignId = this.filterForm.value.campaignId;
    if (campaignId) {
      this.messagesService.findMessagesByCampaign(campaignId).subscribe((data: Message[]) => {
        this.messages.data = data;
      });
    } else {
      this.getMessages();
    }
  }

  onSubmit() {
    const formValue = this.messageForm.value;
    const newMessage: Message = {
      ...formValue,
    };

    if (this.editing) {
      this.updateMessage(newMessage);
    } else {
      this.messagesService.sendMessagesForCampaign({
        campaign_id: newMessage.campaignId,
        text: newMessage.text,
        process_date: newMessage.process_date,
        process_hour: newMessage.process_hour
      }).subscribe((message: Message) => {
        this.messages.data = [...this.messages.data, message].flatMap(item => Array.isArray(item) ? item : [item]);
        console.log(this.messages.data)
        this.messageForm.reset();
      });
    }
  }

  editMessage(message: Message) {
    this.messageForm.patchValue({
      ...message
    });
    this.editing = true;
    this.currentMessageId = message.id;
  }

  updateMessage(updatedMessage: Message) {
    if (this.currentMessageId !== undefined) {
      this.messagesService.updateMessageStatus(this.currentMessageId, updatedMessage.shipping_status).subscribe(() => {
        const index = this.messages.data.findIndex(m => m.id === this.currentMessageId);
        if (index > -1) {
          this.messages.data[index] = updatedMessage;
          this.messages.data = [...this.messages.data]; // Trigger change detection
        }
        this.messageForm.reset();
        this.editing = false;
        this.currentMessageId = undefined;
      });
    }
  }

  cancelEdit() {
    this.messageForm.reset();
    this.editing = false;
    this.currentMessageId = undefined;
  }

  openMessageDetails(message: Message) {
    this.dialog.open(MessageDetailDialog, {
      data: message
    });
  }
}

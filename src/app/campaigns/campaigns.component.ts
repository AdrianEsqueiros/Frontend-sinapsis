import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './campaign.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CampaignsComponent implements OnInit {
  campaignForm: FormGroup;
  dateRange: FormGroup;
  campaigns: MatTableDataSource<Campaign> = new MatTableDataSource<Campaign>([]);
  displayedColumns: string[] = ['id','name', 'process_date', 'process_hour', 'process_status', 'message_text', 'phone_list', 'actions'];
  editing: boolean = false;
  currentCampaignId?: number;

  constructor(private fb: FormBuilder, private campaignsService: CampaignsService) {
    this.campaignForm = this.fb.group({
      name: [''],
      process_date: [''],
      process_hour: [''],
      process_status: [1],
      phone_list: [''],
      message_text: [''],
      userId: [null]
    });
    this.dateRange = this.fb.group({
      start: [null],
      end: [null]
    });
  }

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.campaignsService.getCampaigns().subscribe((data: Campaign[]) => {
      // Ensure phone_list is an array
      data.forEach(campaign => {
        if (typeof campaign.phone_list === 'string') {
          try {
            // Convert JSON string to valid array format
            const formattedList = campaign.phone_list.replace(/^\{/, '[').replace(/\}$/, ']').replace(/"/g, '');
            campaign.phone_list = JSON.parse(formattedList);
          } catch (e) {
            console.error('Failed to parse phone_list:', e);
            campaign.phone_list = [];
          }
        }
      });
      this.campaigns.data = data;
    });
  }

  onSubmit() {
    const formValue = this.campaignForm.value;
    const newCampaign: Campaign = {
      ...formValue,
      phone_list: formValue.phone_list.split(',').map((phone: string) => phone.trim())
    };

    if (this.editing) {
      this.updateCampaign(newCampaign);
    } else {
      this.campaignsService.createCampaign(newCampaign).subscribe((campaign: Campaign) => {
        this.campaigns.data = [...this.campaigns.data, campaign];
        this.campaignForm.reset();
      });
    }
  }

  editCampaign(campaign: Campaign) {
    this.campaignForm.patchValue({
      ...campaign,
      phone_list: Array.isArray(campaign.phone_list) ? campaign.phone_list.join(', ') : campaign.phone_list
    });
    this.editing = true;
    this.currentCampaignId = campaign.id;
  }

  updateCampaign(updatedCampaign: Campaign) {
    if (this.currentCampaignId !== undefined) {
      this.campaignsService.updateCampaign(this.currentCampaignId, updatedCampaign).subscribe((campaign: Campaign) => {
        const index = this.campaigns.data.findIndex(c => c.id === this.currentCampaignId);
        if (index > -1) {
          this.campaigns.data[index] = campaign;
          this.campaigns.data = [...this.campaigns.data]; // Trigger change detection
        }
        this.campaignForm.reset();
        this.editing = false;
        this.currentCampaignId = undefined;
      });
    }
  }

  cancelEdit() {
    this.campaignForm.reset();
    this.editing = false;
    this.currentCampaignId = undefined;
  }

  deleteCampaign(id: number) {
    this.campaignsService.deleteCampaign(id).subscribe(() => {
      this.campaigns.data = this.campaigns.data.filter(c => c.id !== id);
    });
  }

  filterCampaigns() {
    const { start, end } = this.dateRange.value;
    if (start && end) {
      const startDateISO = new Date(start).toISOString();
      const endDateISO = new Date(end).toISOString();

      this.campaignsService.filterCampaigns(startDateISO, endDateISO).subscribe((data: Campaign[]) => {
        this.campaigns.data = data;
      });
    }
  }
}

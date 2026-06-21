import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Drive } from '../../services/drive.service';
import { PtoDriveStoreService } from '../../services/pto-drive-store.service';

@Component({
  selector: 'app-drive-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drive-details.component.html',
  styleUrl: './drive-details.component.css'
})
export class DriveDetailsComponent implements OnInit {
  drive: Drive | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private driveStore: PtoDriveStoreService
  ) {}

  ngOnInit(): void {
    const driveId = Number(this.route.snapshot.paramMap.get('id'));
    this.drive = Number.isNaN(driveId) ? null : this.driveStore.getDriveById(driveId) ?? null;
  }

  get totalOpenings(): number {
    return this.drive?.positions.reduce((sum, position) => sum + position.openings, 0) ?? 0;
  }

  get allowedYearsText(): string {
    const years = this.drive?.eligibilityCriteria.allowedYears ?? [];
    return years.length > 0 ? years.join(', ') : 'Not specified';
  }

  get allowedBranchesText(): string {
    const branches = this.drive?.eligibilityCriteria.allowedBranches ?? [];
    return branches.length > 0 ? branches.join(', ') : 'All branches';
  }

  goBack(): void {
    this.router.navigate(['/pto/placement-drives/drive-list']);
  }
}

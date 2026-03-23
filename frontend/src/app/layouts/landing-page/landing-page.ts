import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface StatCard {
  label: string;
  target: number;
  suffix?: string;
  value: number;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  activeFeature = 'students';

  statCards: StatCard[] = [
    { label: 'Partner Companies', target: 500, suffix: '+', value: 0 },
    { label: 'Students Placed', target: 2400, suffix: '+', value: 0 },
    { label: 'Placement Rate', target: 92, suffix: '%', value: 0 },
    { label: 'Annual Offers', target: 1800, suffix: '+', value: 0 }
  ];

  private animationTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.runCounterAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  selectFeature(feature: 'students' | 'companies' | 'admin'): void {
    this.activeFeature = feature;
  }

  scrollTo(sectionId: string): void {
    this.mobileMenuOpen = false;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private runCounterAnimation(): void {
    let tick = 0;
    const maxTicks = 40;

    this.animationTimer = setInterval(() => {
      tick += 1;
      this.statCards = this.statCards.map((card) => ({
        ...card,
        value: Math.min(card.target, Math.round((card.target * tick) / maxTicks))
      }));

      if (tick >= maxTicks && this.animationTimer) {
        clearInterval(this.animationTimer);
      }
    }, 25);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface InterviewFeedback {
  id: string;
  companyName: string;
  jobTitle: string;
  interviewDate: Date;
  interviewType: 'technical' | 'hr' | 'managerial' | 'coding-test';
  interviewer: string;
  duration: number; // in minutes
  overallRating: number;
  feedback: {
    technicalSkills: number;
    communication: number;
    problemSolving: number;
    culturalFit: number;
    [key: string]: number; // ADDED: This allows string indexing
  };
  strengths: string[];
  areasForImprovement: string[];
  questionsAsked: string[];
  notes: string;
  nextSteps?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-interview-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-feedback.component.html',
  styleUrls: ['./interview-feedback.component.css']
})
export class InterviewFeedbackComponent implements OnInit {
  feedbackList: InterviewFeedback[] = [];
  selectedFeedback: InterviewFeedback | null = null;
  showFeedbackForm = false;
  isEditing = false;

  newFeedback: InterviewFeedback = {
    id: '',
    companyName: '',
    jobTitle: '',
    interviewDate: new Date(),
    interviewType: 'technical',
    interviewer: '',
    duration: 60,
    overallRating: 0,
    feedback: {
      technicalSkills: 0,
      communication: 0,
      problemSolving: 0,
      culturalFit: 0,
    },
    strengths: [],
    areasForImprovement: [],
    questionsAsked: [],
    notes: '',
    status: 'completed'
  };

  newStrength = '';
  newImprovement = '';
  newQuestion = '';

  ngOnInit(): void {
    this.loadSampleData();
  }

  loadSampleData(): void {
    this.feedbackList = [
      {
        id: '1',
        companyName: 'Tech Innovations Inc.',
        jobTitle: 'Software Engineer',
        interviewDate: new Date('2024-01-20'),
        interviewType: 'technical',
        interviewer: 'John Smith',
        duration: 90,
        overallRating: 4,
        feedback: {
          technicalSkills: 4,
          communication: 3,
          problemSolving: 5,
          culturalFit: 4
        },
        strengths: [
          'Strong problem-solving skills',
          'Good knowledge of algorithms',
          'Clean code practices'
        ],
        areasForImprovement: [
          'Could improve communication clarity',
          'Need more project examples'
        ],
        questionsAsked: [
          'Explain the concept of dependency injection',
          'How would you optimize this database query?',
          'Describe your experience with microservices'
        ],
        notes: 'Overall good performance. Strong technical background but should work on articulating thoughts more clearly.',
        nextSteps: 'Second round interview scheduled for next week',
        status: 'completed'
      },
      {
        id: '2',
        companyName: 'Data Systems Ltd.',
        jobTitle: 'Data Analyst',
        interviewDate: new Date('2024-01-25'),
        interviewType: 'technical',
        interviewer: 'Sarah Johnson',
        duration: 75,
        overallRating: 3,
        feedback: {
          technicalSkills: 3,
          communication: 4,
          problemSolving: 3,
          culturalFit: 5
        },
        strengths: [
          'Excellent communication skills',
          'Good business understanding',
          'Team player attitude'
        ],
        areasForImprovement: [
          'Need to strengthen SQL skills',
          'More practice with statistical analysis'
        ],
        questionsAsked: [
          'How do you handle missing data?',
          'Explain different types of joins',
          'Describe a time you used data to drive decisions'
        ],
        notes: 'Good cultural fit but technical skills need improvement.',
        status: 'completed'
      }
    ];
  }

  viewFeedback(feedback: InterviewFeedback): void {
    this.selectedFeedback = feedback;
    this.showFeedbackForm = false;
  }

  addFeedback(): void {
    this.isEditing = false;
    this.newFeedback = {
      id: Date.now().toString(),
      companyName: '',
      jobTitle: '',
      interviewDate: new Date(),
      interviewType: 'technical',
      interviewer: '',
      duration: 60,
      overallRating: 0,
      feedback: {
        technicalSkills: 0,
        communication: 0,
        problemSolving: 0,
        culturalFit: 0
      },
      strengths: [],
      areasForImprovement: [],
      questionsAsked: [],
      notes: '',
      status: 'completed'
    };
    this.showFeedbackForm = true;
  }

  editFeedback(feedback: InterviewFeedback): void {
    this.isEditing = true;
    this.newFeedback = { ...feedback };
    this.showFeedbackForm = true;
  }

  saveFeedback(): void {
    if (this.isEditing) {
      const index = this.feedbackList.findIndex(f => f.id === this.newFeedback.id);
      if (index !== -1) {
        this.feedbackList[index] = { ...this.newFeedback };
      }
    } else {
      this.feedbackList.unshift({ ...this.newFeedback });
    }
    this.showFeedbackForm = false;
    this.selectedFeedback = null;
  }

  cancelEdit(): void {
    this.showFeedbackForm = false;
    this.selectedFeedback = null;
  }

  addStrength(): void {
    if (this.newStrength.trim()) {
      this.newFeedback.strengths.push(this.newStrength.trim());
      this.newStrength = '';
    }
  }

  removeStrength(index: number): void {
    this.newFeedback.strengths.splice(index, 1);
  }

  addImprovement(): void {
    if (this.newImprovement.trim()) {
      this.newFeedback.areasForImprovement.push(this.newImprovement.trim());
      this.newImprovement = '';
    }
  }

  removeImprovement(index: number): void {
    this.newFeedback.areasForImprovement.splice(index, 1);
  }

  addQuestion(): void {
    if (this.newQuestion.trim()) {
      this.newFeedback.questionsAsked.push(this.newQuestion.trim());
      this.newQuestion = '';
    }
  }

  removeQuestion(index: number): void {
    this.newFeedback.questionsAsked.splice(index, 1);
  }

  deleteFeedback(feedback: InterviewFeedback): void {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackList = this.feedbackList.filter(f => f.id !== feedback.id);
      if (this.selectedFeedback?.id === feedback.id) {
        this.selectedFeedback = null;
      }
    }
  }

  getRatingColor(rating: number): string {
    if (rating >= 4) return '#27ae60';
    if (rating >= 3) return '#f39c12';
    return '#e74c3c';
  }

  calculateAverageRating(feedback: InterviewFeedback): number {
    const ratings = Object.values(feedback.feedback);
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }

  getFeedbackCategories(): string[] {
    return ['technicalSkills', 'communication', 'problemSolving', 'culturalFit'];
  }

  formatCategoryName(category: string): string {
    return category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  }

  getCategoryRating(category: string): number {
    if (!this.selectedFeedback) return 0;
    return this.selectedFeedback.feedback[category] || 0;
  }

  updateFeedbackRating(category: string, value: number): void {
    this.newFeedback.feedback[category] = value;
  }

  getFeedbackRating(category: string): number {
    return this.newFeedback.feedback[category] || 0;
  }
}
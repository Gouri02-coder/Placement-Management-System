import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let InterviewPreparationComponent = class InterviewPreparationComponent {
    activeTab = 'questions';
    // Questions Data
    questions = [];
    filteredQuestions = [];
    selectedQuestion = null;
    showQuestionForm = false;
    isEditingQuestion = false;
    categories = [
        'Data Structures',
        'Algorithms',
        'System Design',
        'Database',
        'Networking',
        'Operating Systems',
        'OOP',
        'JavaScript',
        'Angular',
        'Behavioral'
    ];
    difficulties = ['easy', 'medium', 'hard'];
    searchTerm = '';
    selectedCategory = '';
    selectedDifficulty = '';
    newQuestion = {
        id: '',
        question: '',
        answer: '',
        category: '',
        difficulty: 'medium',
        tags: [],
        lastReviewed: new Date()
    };
    newTag = '';
    // Study Plan Data
    studyPlans = [];
    selectedPlan = null;
    showPlanForm = false;
    isEditingPlan = false;
    newPlan = {
        id: '',
        title: '',
        description: '',
        category: '',
        estimatedHours: 0,
        completedHours: 0,
        resources: [],
        topics: [],
        status: 'not-started'
    };
    newResource = '';
    newTopic = '';
    ngOnInit() {
        this.loadSampleData();
        this.filterQuestions();
    }
    loadSampleData() {
        // Sample Questions
        this.questions = [
            {
                id: '1',
                question: 'What is the time complexity of binary search?',
                answer: 'Binary search has a time complexity of O(log n) because it divides the search space in half with each iteration.',
                category: 'Algorithms',
                difficulty: 'easy',
                tags: ['time-complexity', 'search-algorithms'],
                lastReviewed: new Date('2024-01-15')
            },
            {
                id: '2',
                question: 'Explain the concept of dependency injection in Angular.',
                answer: 'Dependency injection is a design pattern in which a class requests dependencies from external sources rather than creating them itself. In Angular, DI is built into the framework and helps with testing and modularity.',
                category: 'Angular',
                difficulty: 'medium',
                tags: ['dependency-injection', 'angular-core'],
                lastReviewed: new Date('2024-01-20')
            },
            {
                id: '3',
                question: 'What are the differences between SQL and NoSQL databases?',
                answer: 'SQL databases are relational, use structured query language, and have predefined schema. NoSQL databases are non-relational, have dynamic schema, and are better for unstructured data.',
                category: 'Database',
                difficulty: 'medium',
                tags: ['sql', 'nosql', 'database-design'],
                lastReviewed: new Date('2024-01-18')
            }
        ];
        // Sample Study Plans
        this.studyPlans = [
            {
                id: '1',
                title: 'Data Structures & Algorithms',
                description: 'Comprehensive preparation for technical interviews focusing on DSA',
                category: 'Algorithms',
                estimatedHours: 40,
                completedHours: 25,
                resources: [
                    'Cracking the Coding Interview',
                    'LeetCode Premium',
                    'GeeksforGeeks DSA Course'
                ],
                topics: [
                    'Arrays & Strings',
                    'Linked Lists',
                    'Trees & Graphs',
                    'Sorting Algorithms',
                    'Dynamic Programming'
                ],
                deadline: new Date('2024-03-01'),
                status: 'in-progress'
            },
            {
                id: '2',
                title: 'System Design Fundamentals',
                description: 'Learn to design scalable systems for senior engineering roles',
                category: 'System Design',
                estimatedHours: 30,
                completedHours: 0,
                resources: [
                    'System Design Interview Book',
                    'YouTube: System Design Basics',
                    'Designing Data-Intensive Applications'
                ],
                topics: [
                    'Load Balancing',
                    'Caching Strategies',
                    'Database Scaling',
                    'Microservices Architecture'
                ],
                status: 'not-started'
            }
        ];
    }
    // Question Methods
    filterQuestions() {
        this.filteredQuestions = this.questions.filter(question => {
            const matchesSearch = !this.searchTerm ||
                question.question.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                question.answer.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesCategory = !this.selectedCategory || question.category === this.selectedCategory;
            const matchesDifficulty = !this.selectedDifficulty || question.difficulty === this.selectedDifficulty;
            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }
    viewQuestion(question) {
        this.selectedQuestion = question;
        this.showQuestionForm = false;
    }
    addQuestion() {
        this.isEditingQuestion = false;
        this.newQuestion = {
            id: Date.now().toString(),
            question: '',
            answer: '',
            category: '',
            difficulty: 'medium',
            tags: [],
            lastReviewed: new Date()
        };
        this.showQuestionForm = true;
        this.selectedQuestion = null;
    }
    editQuestion(question) {
        this.isEditingQuestion = true;
        this.newQuestion = { ...question };
        this.showQuestionForm = true;
        this.selectedQuestion = null;
    }
    saveQuestion() {
        if (this.isEditingQuestion) {
            const index = this.questions.findIndex(q => q.id === this.newQuestion.id);
            if (index !== -1) {
                this.questions[index] = { ...this.newQuestion };
            }
        }
        else {
            this.questions.unshift({ ...this.newQuestion });
        }
        this.showQuestionForm = false;
        this.filterQuestions();
    }
    deleteQuestion(question) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.questions = this.questions.filter(q => q.id !== question.id);
            this.filterQuestions();
            if (this.selectedQuestion?.id === question.id) {
                this.selectedQuestion = null;
            }
        }
    }
    addTag() {
        if (this.newTag.trim() && !this.newQuestion.tags.includes(this.newTag.trim())) {
            this.newQuestion.tags.push(this.newTag.trim());
            this.newTag = '';
        }
    }
    removeTag(tag) {
        this.newQuestion.tags = this.newQuestion.tags.filter(t => t !== tag);
    }
    // Study Plan Methods
    viewPlan(plan) {
        this.selectedPlan = plan;
        this.showPlanForm = false;
    }
    addPlan() {
        this.isEditingPlan = false;
        this.newPlan = {
            id: Date.now().toString(),
            title: '',
            description: '',
            category: '',
            estimatedHours: 0,
            completedHours: 0,
            resources: [],
            topics: [],
            status: 'not-started'
        };
        this.showPlanForm = true;
        this.selectedPlan = null;
    }
    editPlan(plan) {
        this.isEditingPlan = true;
        this.newPlan = { ...plan };
        this.showPlanForm = true;
        this.selectedPlan = null;
    }
    savePlan() {
        if (this.isEditingPlan) {
            const index = this.studyPlans.findIndex(p => p.id === this.newPlan.id);
            if (index !== -1) {
                this.studyPlans[index] = { ...this.newPlan };
            }
        }
        else {
            this.studyPlans.unshift({ ...this.newPlan });
        }
        this.showPlanForm = false;
    }
    deletePlan(plan) {
        if (confirm('Are you sure you want to delete this study plan?')) {
            this.studyPlans = this.studyPlans.filter(p => p.id !== plan.id);
            if (this.selectedPlan?.id === plan.id) {
                this.selectedPlan = null;
            }
        }
    }
    addResource() {
        if (this.newResource.trim() && !this.newPlan.resources.includes(this.newResource.trim())) {
            this.newPlan.resources.push(this.newResource.trim());
            this.newResource = '';
        }
    }
    removeResource(resource) {
        this.newPlan.resources = this.newPlan.resources.filter(r => r !== resource);
    }
    addTopic() {
        if (this.newTopic.trim() && !this.newPlan.topics.includes(this.newTopic.trim())) {
            this.newPlan.topics.push(this.newTopic.trim());
            this.newTopic = '';
        }
    }
    removeTopic(topic) {
        this.newPlan.topics = this.newPlan.topics.filter(t => t !== topic);
    }
    updateProgress(plan, hours) {
        plan.completedHours = Math.min(hours, plan.estimatedHours);
        if (plan.completedHours >= plan.estimatedHours) {
            plan.status = 'completed';
        }
        else if (plan.completedHours > 0) {
            plan.status = 'in-progress';
        }
    }
    getProgressPercentage(plan) {
        return (plan.completedHours / plan.estimatedHours) * 100;
    }
    getStatusColor(status) {
        switch (status) {
            case 'completed': return '#27ae60';
            case 'in-progress': return '#f39c12';
            default: return '#95a5a6';
        }
    }
    getDifficultyColor(difficulty) {
        switch (difficulty) {
            case 'easy': return '#27ae60';
            case 'medium': return '#f39c12';
            case 'hard': return '#e74c3c';
            default: return '#95a5a6';
        }
    }
};
InterviewPreparationComponent = __decorate([
    Component({
        selector: 'app-interview-preparation',
        standalone: true,
        imports: [CommonModule, FormsModule],
        templateUrl: './interview-preparation.component.html',
        styleUrls: ['./interview-preparation.component.css']
    })
], InterviewPreparationComponent);
export { InterviewPreparationComponent };

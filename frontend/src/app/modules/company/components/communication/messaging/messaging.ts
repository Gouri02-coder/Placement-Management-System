import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-messaging',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './messaging.html',
  styleUrl: './messaging.css',
})
export class Messaging implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  
  // User data
  currentUser: any = {
    id: 'current',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/40x40?text=JD',
    role: 'Student'
  };
  
  // Conversations
  conversations: any[] = [];
  selectedConversation: any = null;
  isLoading = true;
  searchTerm = '';
  
  // Messages
  messages: any[] = [];
  newMessage = '';
  isSending = false;
  
  // Typing indicator
  isTyping = false;
  typingTimeout: any;
  
  // Emoji picker
  showEmojiPicker = false;
  
  // File upload
  selectedFile: File | null = null;
  filePreview: string | null = null;
  
  // Common emojis
  commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '👏', '🙏', '😍', '🥳', '😎', '🤔'];

  constructor() {}

  ngOnInit(): void {
    this.loadConversations();
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private loadConversations(): void {
    // Simulate API call - replace with actual service
    setTimeout(() => {
      this.conversations = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          avatar: 'https://via.placeholder.com/50x50?text=SJ',
          role: 'Placement Officer',
          lastMessage: 'Your application for the Tech Mahindra drive has been shortlisted!',
          lastMessageTime: '2024-03-22T10:30:00',
          unreadCount: 2,
          online: true,
          typing: false
        },
        {
          id: 2,
          name: 'Placement Cell',
          avatar: 'https://via.placeholder.com/50x50?text=PC',
          role: 'Official',
          lastMessage: 'Upcoming drive: Infosys Virtual Drive on April 20th',
          lastMessageTime: '2024-03-21T15:45:00',
          unreadCount: 0,
          online: true,
          typing: false
        },
        {
          id: 3,
          name: 'Michael Chen',
          avatar: 'https://via.placeholder.com/50x50?text=MC',
          role: 'Student',
          lastMessage: 'Did you attend the Amazon webinar yesterday?',
          lastMessageTime: '2024-03-21T09:15:00',
          unreadCount: 1,
          online: false,
          typing: false
        },
        {
          id: 4,
          name: 'Tech Mahindra HR',
          avatar: 'https://via.placeholder.com/50x50?text=TM',
          role: 'Recruiter',
          lastMessage: 'Please submit your documents by tomorrow',
          lastMessageTime: '2024-03-20T18:20:00',
          unreadCount: 0,
          online: true,
          typing: false
        },
        {
          id: 5,
          name: 'Campus Connect',
          avatar: 'https://via.placeholder.com/50x50?text=CC',
          role: 'Support',
          lastMessage: 'Your query has been resolved',
          lastMessageTime: '2024-03-20T11:00:00',
          unreadCount: 0,
          online: false,
          typing: false
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  private loadMessages(): void {
    // Simulate API call - replace with actual service
    setTimeout(() => {
      this.messages = [
        {
          id: 1,
          senderId: 'other',
          senderName: 'Dr. Sarah Johnson',
          senderAvatar: 'https://via.placeholder.com/40x40?text=SJ',
          content: 'Hello! I hope you are doing well.',
          timestamp: '2024-03-22T09:00:00',
          type: 'text',
          status: 'read'
        },
        {
          id: 2,
          senderId: 'current',
          senderName: 'John Doe',
          senderAvatar: 'https://via.placeholder.com/40x40?text=JD',
          content: 'Hello Dr. Johnson! Yes, I\'m doing great. Thank you for reaching out.',
          timestamp: '2024-03-22T09:05:00',
          type: 'text',
          status: 'read'
        },
        {
          id: 3,
          senderId: 'other',
          senderName: 'Dr. Sarah Johnson',
          senderAvatar: 'https://via.placeholder.com/40x40?text=SJ',
          content: 'I wanted to inform you that your application for the Tech Mahindra drive has been shortlisted!',
          timestamp: '2024-03-22T09:10:00',
          type: 'text',
          status: 'read'
        },
        {
          id: 4,
          senderId: 'other',
          senderName: 'Dr. Sarah Johnson',
          senderAvatar: 'https://via.placeholder.com/40x40?text=SJ',
          content: 'The interview is scheduled for April 5th. Please prepare accordingly.',
          timestamp: '2024-03-22T09:11:00',
          type: 'text',
          status: 'read'
        },
        {
          id: 5,
          senderId: 'current',
          senderName: 'John Doe',
          senderAvatar: 'https://via.placeholder.com/40x40?text=JD',
          content: 'That\'s wonderful news! Thank you so much for letting me know. I will start preparing immediately.',
          timestamp: '2024-03-22T09:15:00',
          type: 'text',
          status: 'read'
        },
        {
          id: 6,
          senderId: 'current',
          senderName: 'John Doe',
          senderAvatar: 'https://via.placeholder.com/40x40?text=JD',
          content: 'Could you please share any specific topics I should focus on?',
          timestamp: '2024-03-22T09:16:00',
          type: 'text',
          status: 'delivered'
        },
        {
          id: 7,
          senderId: 'other',
          senderName: 'Dr. Sarah Johnson',
          senderAvatar: 'https://via.placeholder.com/40x40?text=SJ',
          content: 'Of course! Focus on data structures, algorithms, and system design.',
          timestamp: '2024-03-22T09:20:00',
          type: 'text',
          status: 'read'
        }
      ];
    }, 500);
  }

  selectConversation(conversation: any): void {
    this.selectedConversation = conversation;
    // Mark messages as read
    conversation.unreadCount = 0;
    this.scrollToBottom();
    // Focus on message input
    setTimeout(() => {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 100);
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '' && !this.selectedFile) return;
    
    this.isSending = true;
    const messageContent = this.newMessage.trim();
    const fileData = this.selectedFile ? {
      name: this.selectedFile.name,
      size: this.selectedFile.size,
      type: this.selectedFile.type,
      preview: this.filePreview
    } : null;
    
    const newMessage = {
      id: Date.now(),
      senderId: 'current',
      senderName: this.currentUser.name,
      senderAvatar: this.currentUser.avatar,
      content: messageContent,
      timestamp: new Date().toISOString(),
      type: fileData ? 'file' : 'text',
      file: fileData,
      status: 'sending'
    };
    
    this.messages.push(newMessage);
    this.newMessage = '';
    this.selectedFile = null;
    this.filePreview = null;
    
    // Simulate message sent
    setTimeout(() => {
      newMessage.status = 'delivered';
      this.updateConversationLastMessage(messageContent || 'File attached');
      this.isSending = false;
      
      // Simulate typing indicator from other user
      if (this.selectedConversation) {
        this.simulateTyping();
      }
    }, 500);
  }

  private updateConversationLastMessage(message: string): void {
    if (this.selectedConversation) {
      this.selectedConversation.lastMessage = message;
      this.selectedConversation.lastMessageTime = new Date().toISOString();
      // Update in conversations list
      const index = this.conversations.findIndex(c => c.id === this.selectedConversation.id);
      if (index !== -1) {
        this.conversations[index] = { ...this.selectedConversation };
      }
    }
  }

  private simulateTyping(): void {
    if (!this.selectedConversation) return;
    
    this.selectedConversation.typing = true;
    this.isTyping = true;
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    this.typingTimeout = setTimeout(() => {
      this.selectedConversation.typing = false;
      this.isTyping = false;
      
      // Simulate auto-reply
      const autoReply = {
        id: Date.now(),
        senderId: 'other',
        senderName: this.selectedConversation.name,
        senderAvatar: this.selectedConversation.avatar,
        content: 'Thanks for your message! I will get back to you shortly.',
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'delivered'
      };
      this.messages.push(autoReply);
      this.updateConversationLastMessage(autoReply.content);
      this.scrollToBottom();
    }, 2000);
  }

  handleFileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.filePreview = null;
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.filePreview = null;
  }

  addEmoji(emoji: string): void {
    this.newMessage += emoji;
    this.showEmojiPicker = false;
    this.messageInput?.nativeElement.focus();
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  getMessageStatusIcon(status: string): string {
    switch (status) {
      case 'sending': return 'schedule';
      case 'delivered': return 'done';
      case 'read': return 'done_all';
      default: return 'done';
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  get filteredConversations(): any[] {
    if (!this.searchTerm.trim()) {
      return this.conversations;
    }
    return this.conversations.filter(conv =>
      conv.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      conv.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get groupedMessages(): any[] {
    const groups: any[] = [];
    let currentDate = '';
    
    this.messages.forEach(message => {
      const messageDate = this.formatDate(message.timestamp);
      if (messageDate !== currentDate) {
        groups.push({ type: 'date', content: messageDate });
        currentDate = messageDate;
      }
      groups.push({ type: 'message', data: message });
    });
    
    return groups;
  }

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'videocam';
    if (fileType.startsWith('application/pdf')) return 'picture_as_pdf';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Messaging } from './messaging';

describe('Messaging', () => {
  let component: Messaging;
  let fixture: ComponentFixture<Messaging>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Messaging, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Messaging);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Conversations', () => {
    it('should load conversations on init', () => {
      expect(component.conversations.length).toBeGreaterThan(0);
    });

    it('should select conversation', () => {
      const conv = component.conversations[0];
      component.selectConversation(conv);
      expect(component.selectedConversation).toBe(conv);
      expect(conv.unreadCount).toBe(0);
    });
  });

  describe('Messages', () => {
    beforeEach(() => {
      component.selectedConversation = component.conversations[0];
    });

    it('should send text message', () => {
      component.newMessage = 'Hello!';
      component.sendMessage();
      expect(component.messages.length).toBeGreaterThan(0);
      expect(component.newMessage).toBe('');
    });

    it('should not send empty message', () => {
      const initialLength = component.messages.length;
      component.newMessage = '   ';
      component.sendMessage();
      expect(component.messages.length).toBe(initialLength);
    });

    it('should format time', () => {
      const timestamp = '2024-03-22T10:30:00';
      const formatted = component.formatTime(timestamp);
      expect(formatted).toBeTruthy();
    });

    it('should format date', () => {
      const timestamp = '2024-03-22T10:30:00';
      const formatted = component.formatDate(timestamp);
      expect(formatted).toBeTruthy();
    });
  });

  describe('File Upload', () => {
    it('should handle file upload', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const event = { target: { files: [mockFile] } };
      component.handleFileUpload(event);
      expect(component.selectedFile).toBe(mockFile);
    });

    it('should remove file', () => {
      component.selectedFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      component.removeFile();
      expect(component.selectedFile).toBeNull();
    });
  });

  describe('Emojis', () => {
    it('should add emoji to message', () => {
      component.newMessage = '';
      component.addEmoji('😊');
      expect(component.newMessage).toContain('😊');
    });
  });

  describe('Filters', () => {
    it('should filter conversations by search term', () => {
      component.searchTerm = 'Sarah';
      const filtered = component.filteredConversations;
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered[0].name).toContain('Sarah');
    });
  });

  describe('Message Status', () => {
    it('should return correct status icon', () => {
      expect(component.getMessageStatusIcon('sending')).toBe('schedule');
      expect(component.getMessageStatusIcon('delivered')).toBe('done');
      expect(component.getMessageStatusIcon('read')).toBe('done_all');
    });
  });

  describe('File Helpers', () => {
    it('should return correct file icon', () => {
      expect(component.getFileIcon('image/png')).toBe('image');
      expect(component.getFileIcon('video/mp4')).toBe('videocam');
      expect(component.getFileIcon('application/pdf')).toBe('picture_as_pdf');
      expect(component.getFileIcon('text/plain')).toBe('insert_drive_file');
    });

    it('should format file size', () => {
      expect(component.formatFileSize(1024)).toBe('1 KB');
      expect(component.formatFileSize(1048576)).toBe('1 MB');
    });
  });
});
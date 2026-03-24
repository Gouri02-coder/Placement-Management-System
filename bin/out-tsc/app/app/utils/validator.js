import { VALIDATION_PATTERNS } from './constants';
// Custom Validators
export class CustomValidators {
    // Email validator
    static email(control) {
        if (!control.value)
            return null;
        return VALIDATION_PATTERNS.EMAIL.test(control.value)
            ? null
            : { email: true };
    }
    // Phone validator
    static phone(control) {
        if (!control.value)
            return null;
        return VALIDATION_PATTERNS.PHONE.test(control.value)
            ? null
            : { phone: true };
    }
    // Password strength validator
    static password(control) {
        if (!control.value)
            return null;
        return VALIDATION_PATTERNS.PASSWORD.test(control.value)
            ? null
            : {
                password: true,
                message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
            };
    }
    // Confirm password validator
    static confirmPassword(controlName) {
        return (control) => {
            if (!control.parent)
                return null;
            const password = control.parent.get(controlName);
            const confirmPassword = control;
            if (!password || !confirmPassword)
                return null;
            return password.value === confirmPassword.value
                ? null
                : { confirmPassword: true };
        };
    }
    // URL validator
    static url(control) {
        if (!control.value)
            return null;
        return VALIDATION_PATTERNS.URL.test(control.value)
            ? null
            : { url: true };
    }
    // File type validator
    static fileType(allowedTypes) {
        return (control) => {
            const file = control.value;
            if (!file)
                return null;
            return allowedTypes.includes(file.type)
                ? null
                : { fileType: true };
        };
    }
    // File size validator
    static fileSize(maxSize) {
        return (control) => {
            const file = control.value;
            if (!file)
                return null;
            return file.size <= maxSize
                ? null
                : { fileSize: true };
        };
    }
    // Date range validator
    static dateRange(startControlName, endControlName) {
        return (control) => {
            const formGroup = control.parent;
            if (!formGroup)
                return null;
            const startDate = formGroup.get(startControlName)?.value;
            const endDate = formGroup.get(endControlName)?.value;
            if (!startDate || !endDate)
                return null;
            return new Date(startDate) <= new Date(endDate)
                ? null
                : { dateRange: true };
        };
    }
    // Future date validator
    static futureDate(control) {
        if (!control.value)
            return null;
        const selectedDate = new Date(control.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today
            ? null
            : { futureDate: true };
    }
    // Minimum value validator
    static minValue(min) {
        return (control) => {
            if (!control.value)
                return null;
            const value = parseFloat(control.value);
            return value >= min
                ? null
                : { minValue: true };
        };
    }
    // Maximum value validator
    static maxValue(max) {
        return (control) => {
            if (!control.value)
                return null;
            const value = parseFloat(control.value);
            return value <= max
                ? null
                : { maxValue: true };
        };
    }
    // CGPA validator
    static cgpa(control) {
        if (!control.value)
            return null;
        const value = parseFloat(control.value);
        return value >= 0 && value <= 10
            ? null
            : { cgpa: true };
    }
    // Percentage validator
    static percentage(control) {
        if (!control.value)
            return null;
        const value = parseFloat(control.value);
        return value >= 0 && value <= 100
            ? null
            : { percentage: true };
    }
    // No whitespace validator
    static noWhitespace(control) {
        if (!control.value)
            return null;
        return control.value.trim().length > 0
            ? null
            : { whitespace: true };
    }
    // Array minimum length validator
    static arrayMinLength(min) {
        return (control) => {
            if (!control.value || !Array.isArray(control.value))
                return null;
            return control.value.length >= min
                ? null
                : { arrayMinLength: true };
        };
    }
    // Array maximum length validator
    static arrayMaxLength(max) {
        return (control) => {
            if (!control.value || !Array.isArray(control.value))
                return null;
            return control.value.length <= max
                ? null
                : { arrayMaxLength: true };
        };
    }
}
// Validation Error Messages
export const VALIDATION_MESSAGES = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    password: 'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
    confirmPassword: 'Passwords do not match',
    url: 'Please enter a valid URL',
    fileType: 'Invalid file type',
    fileSize: 'File size too large',
    dateRange: 'End date must be after start date',
    futureDate: 'Date must be in the future',
    minValue: 'Value is too low',
    maxValue: 'Value is too high',
    cgpa: 'CGPA must be between 0 and 10',
    percentage: 'Percentage must be between 0 and 100',
    whitespace: 'This field cannot be empty',
    arrayMinLength: 'At least one item is required',
    arrayMaxLength: 'Too many items selected'
};
// Get validation error message
export const getValidationMessage = (errors) => {
    const firstError = Object.keys(errors)[0];
    return VALIDATION_MESSAGES[firstError] || 'Invalid value';
};

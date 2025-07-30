import { LightningElement, track } from 'lwc';
import webinarBG from '@salesforce/resourceUrl/webinar';

export default class EmailVerification extends LightningElement {
    @track firstName = ''; 
    @track lastName = ''; 
    @track email = '';
    @track password = ''; 
    @track confirmPassword = '';
    @track error = ''; 
    @track isLoading = false;

    renderedCallback() {
        const container = this.template.querySelector('.signup-container');
        if (container) container.style.backgroundImage = `url(${webinarBG})`;
    }

    handleFirstNameChange(event) { this.firstName = event.target.value; }
    handleLastNameChange(event) { this.lastName = event.target.value; }
    handleEmailChange(event) { this.email = event.target.value; }
    handlePasswordChange(event) { this.password = event.target.value; }
    handleConfirmPasswordChange(event) { this.confirmPassword = event.target.value; }

    handleContinue() {
        // Validate all fields
        if (!this.email || !this.firstName || !this.lastName || !this.password || !this.confirmPassword) {
            this.error = 'Please fill out all fields.'; return;
        }
        if (this.password !== this.confirmPassword) {
            this.error = 'Passwords do not match.'; return;
        }
        if (this.password.length < 8) {
            this.error = 'Password must be at least 8 characters.'; return;
        }
        this.error = '';

        // Send all data to the parent component
        this.dispatchEvent(new CustomEvent('verified', {
            detail: {
                email: this.email,
                firstName: this.firstName,
                lastName: this.lastName,
                password: this.password
            }
        }));
    }
}
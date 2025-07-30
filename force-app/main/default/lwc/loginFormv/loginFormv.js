import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import login from '@salesforce/apex/CommunityLoginController.login';
import webinarBG from '@salesforce/resourceUrl/webinar';

export default class LoginForm extends NavigationMixin(LightningElement) {
    @track username = ''; 
    @track password = ''; 
    @track error = ''; 
    @track isLoading = false;

    renderedCallback() {
        const container = this.template.querySelector('.login-container');
        if (container) container.style.backgroundImage = `url(${webinarBG})`;
    }

    handleUsernameChange(event) { this.username = event.target.value; }
    handlePasswordChange(event) { this.password = event.target.value; }

    handleLogin() {
        if (!this.username || !this.password) { 
            this.error = 'Please enter both email and password.'; 
            return; 
        }
        this.isLoading = true; 
        this.error = '';
        
        login({ username: this.username, password: this.password })
            .then(result => {
                // Check for the success URL from our Apex class.
                if (result.startsWith('/SummitSync/')) {
                    // --- THIS IS THE FIX ---
                    // Manually redirect the browser to the correct home page.
                    // This forces a full refresh, showing the logged-in version of the site.
                    window.location.href = '/SummitSync/';
                } else {
                    // If the result is not our success message, it's an error.
                    this.error = result;
                    this.isLoading = false;
                }
            })
            .catch(error => {
                this.error = error.body.message;
                this.isLoading = false;
            });
    }

    navigateToSignUp() { this[NavigationMixin.Navigate]({ type: 'standard__comm__namedPage', attributes: { name: 'Register' } }); }
    navigateToForgotPassword() { this[NavigationMixin.Navigate]({ type: 'standard__comm__namedPage', attributes: { name: 'Forgot_Password' } }); }
}
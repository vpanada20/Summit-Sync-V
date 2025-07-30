import { LightningElement, track } from 'lwc';
import webinarBG from '@salesforce/resourceUrl/webinar';

export default class LogoutConfirm extends LightningElement {
    @track hasLoggedOut = false;

    renderedCallback() {
        const container = this.template.querySelector('.logout-container');
        if (container) {
            container.style.backgroundImage = `url(${webinarBG})`;
        }
    }

    // If user clicks "No", send them back to the home page
    handleCancel() {
        window.location.href = '/SummitSync/';
    }

    // If user clicks "Yes", show the success message and log them out
    handleConfirmLogout() {
        // 1. Show the success message
        this.hasLoggedOut = true;

        // 2. Find the hidden iframe and set its source to the logout URL.
        // This securely ends the user's session in the background.
        const iframe = this.template.querySelector('.logout-frame');
        if (iframe) {
            iframe.src = '/SummitSync/secur/logout.jsp';
        }
    }

    // When the user clicks the final button, send them to the login page
    handleReturnToLogin() {
        window.location.href = '/SummitSync/login';
    }
}
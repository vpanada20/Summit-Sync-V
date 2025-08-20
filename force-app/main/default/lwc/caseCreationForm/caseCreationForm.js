import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import userId from '@salesforce/user/Id';
import getCurrentUserContactId from '@salesforce/apex/EventController.getCurrentUserContactId';
import createCase from '@salesforce/apex/CaseController.createCase';

export default class CaseCreationForm extends LightningElement {
    @track subject = '';
    @track description = '';
    @track contactId;
    @track error = '';
    @track isLoading = false;
    @track isSuccess = false;

    // Get the current user's Contact ID to link the case
    @wire(getCurrentUserContactId, { userId: userId })
    wiredContactId({ error, data }) {
        if (data) {
            this.contactId = data;
        } else if (error) {
            this.error = 'Could not identify your user record. Please ensure you are logged in.';
            console.error('Error fetching contact ID:', error);
        }
    }

    handleSubjectChange(event) {
        this.subject = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    handleSubmit() {
        // Simple validation
        if (!this.subject || !this.description) {
            this.error = 'Please enter a subject and description for your query.';
            return;
        }
        if (!this.contactId) {
            this.error = 'Cannot submit query because your user information could not be found.';
            return;
        }

        this.isLoading = true;
        this.error = '';

        createCase({
            contactId: this.contactId,
            subject: this.subject,
            description: this.description
        })
        .then(result => {
            this.isSuccess = true;
            this.isLoading = false;
        })
        .catch(error => {
            this.error = error.body.message;
            this.isLoading = false;
        });
    }

    // Resets the form to allow the user to submit another case
    resetForm() {
        this.isSuccess = false;
        this.subject = '';
        this.description = '';
        this.error = '';
    }
}
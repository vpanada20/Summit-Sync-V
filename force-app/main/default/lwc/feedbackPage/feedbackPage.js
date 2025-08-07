// feedbackPage.js
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import userId from '@salesforce/user/Id';
import getCurrentUserContactId from '@salesforce/apex/EventController.getCurrentUserContactId';
import getPastEventsForFeedback from '@salesforce/apex/FeedbackController.getPastEventsForFeedback';
import getRatingPicklistValues from '@salesforce/apex/FeedbackController.getRatingPicklistValues';
import submitFeedback from '@salesforce/apex/FeedbackController.submitFeedback';

export default class FeedbackPage extends LightningElement {
    @track eventsForFeedback;
    @track error;
    @track isLoading = true;
    @track contactId;
    
    wiredEventsResult;

    // Modal and Form properties
    @track isModalOpen = false;
    @track selectedEvent = {};
    @track ratingOptions = [];
    @track rating = '';
    @track comments = '';
    @track isSubmitting = false;
    @track isSuccess = false;

    @wire(getCurrentUserContactId, { userId: userId })
    wiredContactId({ error, data }) {
        if (data) {
            this.contactId = data;
        } else if (error) {
            this.error = 'Could not retrieve your user information.';
        }
    }

    @wire(getPastEventsForFeedback, { contactId: '$contactId' })
    wiredEvents(result) {
        this.wiredEventsResult = result;
        this.isLoading = false;
        if (result.data) {
            this.eventsForFeedback = result.data.length > 0 ? result.data : null;
        } else if (result.error) {
            this.error = result.error;
        }
    }

    @wire(getRatingPicklistValues)
    wiredRatings({ error, data }) {
        if (data) {
            this.ratingOptions = data;
        }
    }

    handleProvideFeedback(event) {
        const eventId = event.target.dataset.id;
        this.selectedEvent = this.eventsForFeedback.find(e => e.eventId === eventId);
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.isSuccess = false;
        this.rating = '';
        this.comments = '';
        this.error = '';
    }

    handleRatingChange(event) {
        this.rating = event.detail.value;
    }
    handleCommentsChange(event) {
        this.comments = event.target.value;
    }

    handleSubmitFeedback() {
        if (!this.rating) {
            this.error = 'Please provide a rating.';
            return;
        }
        this.isSubmitting = true;
        this.error = '';

        submitFeedback({
            eventId: this.selectedEvent.eventId,
            contactId: this.contactId,
            rating: this.rating,
            comments: this.comments
        })
        .then(() => {
            this.isSuccess = true;
            // Refresh the list of events to remove the one just reviewed
            return refreshApex(this.wiredEventsResult);
        })
        .catch(error => {
            this.error = error.body.message;
        })
        .finally(() => {
            this.isSubmitting = false;
        });
    }
}
import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import userId from '@salesforce/user/Id';
import getCommunityUserInfo from '@salesforce/apex/CommunityLoginController.getCommunityUserInfo';
import getCurrentUserContactId from '@salesforce/apex/EventController.getCurrentUserContactId';
import createRegistration from '@salesforce/apex/EventController.createRegistration';

export default class EventBookingPage extends NavigationMixin(LightningElement) {
    @api eventId;
    @api eventName;

    @track userName = '';
    @track contactId;
    @track numberOfSeats = 1;
    @track error = '';
    @track isLoading = false;
    @track isSuccess = false;

    // Get eventId and eventName from the URL parameters
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.eventId = currentPageReference.state?.eventId;
            this.eventName = currentPageReference.state?.eventName;
        }
    }

    // Get the current user's name
    @wire(getCommunityUserInfo, { userId: userId })
    wiredUserName({ error, data }) {
        if (data) {
            this.userName = data.userName;
        }
    }

    // Get the current user's Contact ID
    @wire(getCurrentUserContactId, { userId: userId })
    wiredContactId({ error, data }) {
        if (data) {
            this.contactId = data;
        } else if (error) {
            console.error('Could not retrieve contact ID for booking.', error);
            this.error = 'Could not retrieve your contact information for booking.';
        }
    }

    handleSeatsChange(event) {
        this.numberOfSeats = event.target.value;
    }

    handleBookNow() {
        // --- THIS IS THE FIX ---
        // 1. Add validation to check for all required data BEFORE calling Apex.
        if (!this.eventId) {
            this.error = 'Could not identify the event. Please go back to the events page and try again.';
            return;
        }
        if (!this.contactId) {
            this.error = 'Could not identify your user record. Please ensure you are logged in correctly.';
            return;
        }
        if (this.numberOfSeats < 1) {
            this.error = 'You must book at least one seat.';
            return;
        }

        this.isLoading = true;
        this.error = '';

        // 2. Call Apex only if all data is valid.
        createRegistration({
            eventId: this.eventId,
            contactId: this.contactId,
            numberOfSeats: this.numberOfSeats
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

    navigateToEventsPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__comm__namedPage',
            attributes: { name: 'Events' }
        });
    }
}
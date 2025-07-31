import { LightningElement, track, wire } from 'lwc';
import isGuest from '@salesforce/user/isGuest';
import userId from '@salesforce/user/Id';
import getRecentEvents from '@salesforce/apex/EventController.getRecentEvents';
import getCurrentUserContactId from '@salesforce/apex/EventController.getCurrentUserContactId';
import createRegistration from '@salesforce/apex/EventController.createRegistration';

export default class RecentEvents extends LightningElement {
    @track recentEvents;
    @track error;
    @track isLoading = true;

    // Modal state properties
    @track isModalOpen = false;
    @track selectedEvent = {};
    @track showDetailsView = false;
    @track showBookingView = false;
    @track bookingSuccess = false;
    @track isBookingLoading = false;

    // Booking form properties
    @track numberOfSeats = 1;
    @track contactId;

    isGuestUser = isGuest;

    @wire(getRecentEvents)
    wiredEvents({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.recentEvents = data;
        } else if (error) {
            this.error = error;
        }
    }

    @wire(getCurrentUserContactId, { userId: userId })
    wiredContactId({ error, data }) {
        if (data) {
            this.contactId = data;
        } else if (error) {
            console.error('Could not retrieve contact ID for booking.', error);
        }
    }

    handleSeatsChange(event) {
        this.numberOfSeats = event.target.value;
    }

    // --- Modal View Handlers ---
    handleViewMore(event) {
        const eventId = event.target.dataset.id;
        this.selectedEvent = this.recentEvents.find(e => e.eventId === eventId);
        this.isModalOpen = true;
        this.showDetailsView = true; // Start by showing the details view
    }

    closeModal() {
        this.isModalOpen = false;
        this.showDetailsView = false;
        this.showBookingView = false;
        this.bookingSuccess = false;
        this.numberOfSeats = 1;
        this.error = '';
    }

    handleShowBookingForm() {
        if (this.isGuestUser) {
            // Redirect guests to the login page if they try to book
            window.location.href = '/SummitSync/login';
        } else {
            // For logged-in users, switch to the booking form view
            this.showDetailsView = false;
            this.showBookingView = true;
        }
    }

    handleShowDetailsView() {
        this.showBookingView = false;
        this.showDetailsView = true;
        this.bookingSuccess = false; // Reset success state if they go back
        this.error = '';
    }

    // --- Booking Logic ---
    handleConfirmBooking() {
        // Add validation to check for all required data BEFORE calling Apex.
        if (!this.selectedEvent || !this.selectedEvent.eventId || !this.contactId || this.numberOfSeats < 1) {
            this.error = 'Missing required information. Please refresh and try again.';
            return;
        }
        
        this.isBookingLoading = true;
        this.error = '';

        createRegistration({
            eventId: this.selectedEvent.eventId,
            contactId: this.contactId,
            numberOfSeats: this.numberOfSeats
        })
        .then(result => {
            this.bookingSuccess = true;
            this.isBookingLoading = false;
        })
        .catch(error => {
            this.error = error.body.message;
            this.isBookingLoading = false;
        });
    }
}
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import userId from '@salesforce/user/Id';
import getEvents from '@salesforce/apex/EventController.getEvents';
import getRegionPicklistValues from '@salesforce/apex/EventController.getRegionPicklistValues';
import getEventTypePicklistValues from '@salesforce/apex/EventController.getEventTypePicklistValues';
import getCurrentUserContactId from '@salesforce/apex/EventController.getCurrentUserContactId';
import createRegistration from '@salesforce/apex/EventController.createRegistration';

export default class EventPage extends LightningElement {
    @track events;
    @track error;
    @track isLoading = true;
    @track regionOptions = [];
    @track eventTypeOptions = [];
    
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

    // Filter values
    @track regionFilter = '';
    @track eventTypeFilter = '';
    @track startDateFilter = null;
    @track nameFilter = '';

    isGuestUser = isGuest;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.nameFilter = currentPageReference.state?.name || '';
            this.regionFilter = currentPageReference.state?.region || this.regionFilter;
            this.eventTypeFilter = currentPageReference.state?.type || this.eventTypeFilter;
        }
    }

    @wire(getCurrentUserContactId, { userId: userId })
    wiredContactId({ error, data }) {
        if (data) { this.contactId = data; }
    }

    @wire(getRegionPicklistValues)
    wiredRegions({ error, data }) {
        if (data) { this.regionOptions = [{ label: 'All Regions', value: '' }, ...data]; }
    }

    @wire(getEventTypePicklistValues)
    wiredEventTypes({ error, data }) {
        if (data) { this.eventTypeOptions = [{ label: 'All Types', value: '' }, ...data]; }
    }

    @wire(getEvents, { 
        regionFilter: '$regionFilter', 
        eventTypeFilter: '$eventTypeFilter', 
        startDateFilter: '$startDateFilter',
        nameFilter: '$nameFilter'
    })
    wiredEvents({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.events = data.length > 0 ? data : null;
        } else if (error) {
            this.error = error;
            this.events = null;
        }
    }

    handleRegionChange(event) { this.isLoading = true; this.regionFilter = event.detail.value; }
    handleEventTypeChange(event) { this.isLoading = true; this.eventTypeFilter = event.detail.value; }
    handleDateChange(event) { this.isLoading = true; this.startDateFilter = event.target.value; }
    handleSeatsChange(event) { this.numberOfSeats = event.target.value; }

    // --- Modal Handlers ---
    handleViewMore(event) {
        const eventId = event.target.dataset.id;
        this.selectedEvent = this.events.find(e => e.eventId === eventId);
        this.isModalOpen = true;
        this.showDetailsView = true; // Start by showing the details
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
            // Redirect guests to login
            window.location.href = '/SummitSync/login';
        } else {
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
        if (this.numberOfSeats < 1) {
            this.error = 'You must book at least one seat.';
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
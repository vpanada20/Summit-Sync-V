import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getEvents from '@salesforce/apex/EventController.getEvents';
import getRegionPicklistValues from '@salesforce/apex/EventController.getRegionPicklistValues';
import getEventTypePicklistValues from '@salesforce/apex/EventController.getEventTypePicklistValues';

export default class EventPage extends LightningElement {
    @track events;
    @track error;
    @track isLoading = true;
    @track regionOptions = [];
    @track eventTypeOptions = [];
    
    @track isModalOpen = false;
    @track selectedEvent = {};

    // Filter values
    @track regionFilter = '';
    @track eventTypeFilter = ''; // This will now be set by the URL parameter
    @track startDateFilter = null;
    @track nameFilter = '';

    // Wire the page reference to read URL parameters
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            // Read search terms from the navbar
            this.nameFilter = currentPageReference.state?.name || '';
            this.regionFilter = currentPageReference.state?.region || '';
            // Read event type from the carousel
            this.eventTypeFilter = currentPageReference.state?.type || '';
        }
    }

    @wire(getRegionPicklistValues)
    wiredRegions({ error, data }) {
        if (data) { this.regionOptions = [{ label: 'All Regions', value: '' }, ...data]; }
    }

    @wire(getEventTypePicklistValues)
    wiredEventTypes({ error, data }) {
        if (data) { this.eventTypeOptions = [{ label: 'All Types', value: '' }, ...data]; }
    }

    // Main wire service now includes all filters
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

    // --- Filter Handlers ---
    handleRegionChange(event) { this.isLoading = true; this.regionFilter = event.detail.value; }
    handleEventTypeChange(event) { this.isLoading = true; this.eventTypeFilter = event.detail.value; }
    handleDateChange(event) { this.isLoading = true; this.startDateFilter = event.target.value; }

    // --- Modal Handlers ---
    handleViewMore(event) {
        const eventId = event.target.dataset.id;
        this.selectedEvent = this.events.find(e => e.eventId === eventId);
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedEvent = {};
    }
}
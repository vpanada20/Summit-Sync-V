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
    @track eventTypeFilter = '';

    @track startDateFilter = null;
    @track nameFilter = ''; // New filter for event name

    // Wire the page reference to read URL parameters
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            // Read the search terms from the URL and apply them to the filters
            this.nameFilter = currentPageReference.state?.name || '';
            this.regionFilter = currentPageReference.state?.region || this.regionFilter;
            this.eventTypeFilter = currentPageReference.state?.type || this.eventTypeFilter;
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

    // Main wire service now includes the nameFilter
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
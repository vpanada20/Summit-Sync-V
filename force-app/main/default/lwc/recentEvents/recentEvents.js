import { LightningElement, track, wire } from 'lwc';
import getRecentEvents from '@salesforce/apex/EventController.getRecentEvents';

export default class RecentEvents extends LightningElement {
    @track recentEvents;
    @track error;
    @track isLoading = true;

    // Properties for the modal
    @track isModalOpen = false;
    @track selectedEvent = {};

    @wire(getRecentEvents)
    wiredEvents({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.recentEvents = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.recentEvents = undefined;
            console.error('Error fetching recent events:', error);
        }
    }

    // --- Modal Handlers ---
    handleViewMore(event) {
        const eventId = event.target.dataset.id;
        // Find the full event object from the wired data
        this.selectedEvent = this.recentEvents.find(e => e.eventId === eventId);
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedEvent = {};
    }
}
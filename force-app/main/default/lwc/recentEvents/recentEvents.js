import { LightningElement, track, wire } from 'lwc';
import isGuest from '@salesforce/user/isGuest';
import getRecentEvents from '@salesforce/apex/EventController.getRecentEvents';

export default class RecentEvents extends LightningElement {
    @track recentEvents;
    @track error;
    @track isLoading = true;

    @track isModalOpen = false;
    @track selectedEvent = {};

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

    handleViewMore(event) {
        const eventId = event.target.dataset.id;
        this.selectedEvent = this.recentEvents.find(e => e.eventId === eventId);
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedEvent = {};
    }
}
import { LightningElement, wire } from 'lwc';
import getPendingEventsForUser from '@salesforce/apex/FeedbackController.getPendingEventsForUser';
import { refreshApex } from '@salesforce/apex';

export default class EventFeedbackList extends LightningElement {
    isModalOpen = false;
    selectedEventId;
    
    wiredData;
    pendingEvents = [];

    @wire(getPendingEventsForUser)
    wiredEvents(result) {
        this.wiredData = result;
        if (result.data) {
            this.pendingEvents = result.data;
        } else if (result.error) {
            console.error('Error fetching pending events:', result.error);
        }
    }

    handleGiveFeedbackClick(event) {
        this.selectedEventId = event.target.dataset.id;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleFeedbackSuccess() {
        this.isModalOpen = false;
        // Refresh the data from Apex to update the list
        return refreshApex(this.wiredData);
    }
}
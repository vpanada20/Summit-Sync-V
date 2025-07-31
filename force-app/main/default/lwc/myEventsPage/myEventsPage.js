import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import userId from '@salesforce/user/Id';
import getCurrentUserContactId from '@salesforce/apex/EventController.getCurrentUserContactId';
import getMyRegisteredEvents from '@salesforce/apex/EventController.getMyRegisteredEvents';
import cancelRegistration from '@salesforce/apex/EventController.cancelRegistration';

export default class MyEventsPage extends LightningElement {
    @track registeredEvents;
    @track error;
    @track isLoading = true;
    @track contactId;
    
    // Property to hold the provisioned wired result
    wiredEventsResult;

    // Modal state properties
    @track isModalOpen = false;
    @track selectedEvent = {};
    @track isCanceling = false;

    // Get the current user's Contact ID
    @wire(getCurrentUserContactId, { userId: userId })
    wiredContactId({ error, data }) {
        if (data) {
            this.contactId = data;
        } else if (error) {
            this.error = 'Could not retrieve your contact information.';
        }
    }

    // Fetch the user's registered events once we have their Contact ID
    @wire(getMyRegisteredEvents, { contactId: '$contactId' })
    wiredRegisteredEvents(result) {
        this.wiredEventsResult = result; // Store the provisioned result
        this.isLoading = false;
        if (result.data) {
            this.registeredEvents = result.data.length > 0 ? result.data : null;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.registeredEvents = null;
        }
    }

    handleViewDetails(event) {
        const regId = event.target.dataset.id;
        this.selectedEvent = this.registeredEvents.find(e => e.registrationId === regId);
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedEvent = {};
    }

    handleCancelBooking() {
        this.isCanceling = true;
        cancelRegistration({ registrationId: this.selectedEvent.registrationId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Your booking has been canceled.',
                        variant: 'success',
                    })
                );
                this.closeModal();
                // Refresh the list of events
                return refreshApex(this.wiredEventsResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Canceling Booking',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            })
            .finally(() => {
                this.isCanceling = false;
            });
    }
}
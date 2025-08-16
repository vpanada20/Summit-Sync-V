import { LightningElement, track, wire } from 'lwc';
import userId from '@salesforce/user/Id';
import getSpeakerEventsWithFeedback from '@salesforce/apex/SpeakerFeedbackController.getSpeakerEventsWithFeedback';

export default class SpeakerFeedbackPage extends LightningElement {
    @track eventsWithFeedback;
    @track error;
    @track isLoading = true;

    @wire(getSpeakerEventsWithFeedback, { userId: userId })
    wiredFeedback({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.eventsWithFeedback = data.length > 0 ? data : null;
        } else if (error) {
            this.error = error;
            console.error('Error fetching speaker feedback:', error);
        }
    }
}
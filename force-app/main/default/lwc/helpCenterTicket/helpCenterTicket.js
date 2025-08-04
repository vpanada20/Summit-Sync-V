import { LightningElement } from 'lwc';
import createCase from '@salesforce/apex/CaseController.createCase';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class SubmitTicketForm extends LightningElement {
    requesterEmail = ''; subject = ''; description = ''; queryType = '';
    get queryTypeOptions() {
        return [
            { label: 'Booking Issue', value: 'Booking Issue' }, { label: 'Payment Failure', value: 'Payment Failure' },
            { label: 'Refund Query', value: 'Refund Query' }, { label: 'Technical Problem', value: 'Technical Problem' },
            { label: 'General Feedback', value: 'General Feedback' },
        ];
    }
    handleChange(event) {
        const { label, value } = event.target;
        if (label === 'Your Email Address') this.requesterEmail = value;
        if (label === 'Subject') this.subject = value;
        if (label === 'What is this about?') this.queryType = value;
    }
    handleDescriptionChange(event) { this.description = event.target.value; }
    handleSubmit() {
        const fullDescription = `Query Type: ${this.queryType}\n\n${this.description}`;
        createCase({ requesterEmail: this.requesterEmail, subject: this.subject, description: fullDescription })
            .then(result => {
                this.dispatchEvent(new ShowToastEvent({ title: 'Success', message: 'Ticket submitted! Case ID: ' + result, variant: 'success' }));
                this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-input-rich-text').forEach(el => { el.value = null; });
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({ title: 'Error', message: error.body.message, variant: 'error' }));
            });
    }
}
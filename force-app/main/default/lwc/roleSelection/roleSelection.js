import { LightningElement, api } from 'lwc';
import createContactAndUser from '@salesforce/apex/SignUpcontroller.createContactAndUser';
import webinarBG from '@salesforce/resourceUrl/webinar';

export default class RoleSelection extends LightningElement {
    @api email; 
    @api firstName; 
    @api lastName; 
    @api password;
    @api attendeeRecordTypeId; 
    @api speakerRecordTypeId;
    error;

    renderedCallback() {
        const container = this.template.querySelector('.signup-container');
        if (container) container.style.backgroundImage = `url(${webinarBG})`;
    }

    selectRole(event) {
        const selectedRole = event.currentTarget.dataset.role;
        const recordTypeId = selectedRole === 'Speaker' ? this.speakerRecordTypeId : this.attendeeRecordTypeId;
        
        createContactAndUser({
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            recordTypeId: recordTypeId,
            profileName: selectedRole
        })
        .then(() => { this.dispatchEvent(new CustomEvent('complete')); })
        .catch(error => { this.error = error.body.message; });
    }
}
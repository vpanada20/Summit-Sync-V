import { LightningElement, track, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import webinarBG from '@salesforce/resourceUrl/webinar';

export default class SignupContainer extends LightningElement {
    @track currentStep = 'email';
    @track email = '';
    @track firstName = '';
    @track lastName = '';
    @track password = '';
    attendeeRtId;
    speakerRtId;

    renderedCallback() {
        if (this.showSuccessMessage) {
            const container = this.template.querySelector('.signup-container');
            if(container) container.style.backgroundImage = `url(${webinarBG})`;
        }
    }

    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    contactObjectInfo({ data }) {
        if (data) {
            const rtis = data.recordTypeInfos;
            this.attendeeRtId = Object.keys(rtis).find(rti => rtis[rti].name === 'Attendee');
            this.speakerRtId = Object.keys(rtis).find(rti => rtis[rti].name === 'Speaker');
        }
    }
    
    get showEmailVerification() { return this.currentStep === 'email'; }
    get showRoleSelection() { return this.currentStep === 'role'; }
    get showSuccessMessage() { return this.currentStep === 'success'; }

    handleVerificationSuccess(event) {
        this.email = event.detail.email;
        this.firstName = event.detail.firstName;
        this.lastName = event.detail.lastName;
        this.password = event.detail.password;
        this.currentStep = 'role';
    }

    handleSignupComplete() {
        this.currentStep = 'success';
    }
}

import { LightningElement } from 'lwc';
// Import your static resource. Make sure the name 'feedback_banner' matches
// the name you gave the static resource in Salesforce Setup.
import feedbackBannerResource from '@salesforce/resourceUrl/FeedbackBanner';

export default class FeedbackBanner extends LightningElement {
    // Expose the static resource URL to the template
    bannerUrl = feedbackBannerResource;
}
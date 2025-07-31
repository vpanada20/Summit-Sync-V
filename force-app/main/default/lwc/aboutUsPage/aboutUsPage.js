import { LightningElement, track } from 'lwc';

// --- IMPORTANT ---
// These import statements match the Static Resource API Names from your screenshot.

import img1Url from '@salesforce/resourceUrl/img1';
import img2Url from '@salesforce/resourceUrl/img2';
import img3Url from '@salesforce/resourceUrl/img3';
import img4Url from '@salesforce/resourceUrl/img4';
import img5Url from '@salesforce/resourceUrl/img5';
import img6Url from '@salesforce/resourceUrl/img6';
import img7Url from '@salesforce/resourceUrl/img7';
import img8Url from '@salesforce/resourceUrl/img8';
import img9Url from '@salesforce/resourceUrl/img9';
import img10Url from '@salesforce/resourceUrl/img10';

// Imports for the card images
import about1Url from '@salesforce/resourceUrl/about1';
import about2Url from '@salesforce/resourceUrl/about2';


export default class AboutUsPage extends LightningElement {
    // The 'src' for each image now directly uses the imported URL variables.
    images = [
        { id: 1, src: img1Url, alt: 'Event Decor 1' },
        { id: 2, src: img2Url, alt: 'Event Decor 2' },
        { id: 3, src: img3Url, alt: 'Event Decor 3' },
        { id: 4, src: img4Url, alt: 'Event Decor 4' },
        { id: 5, src: img5Url, alt: 'Event Decor 5' },
        { id: 6, src: img6Url, alt: 'Event Decor 6' },
        { id: 7, src: img7Url, alt: 'Event Decor 7' },
        { id: 8, src: img8Url, alt: 'Event Decor 8' },
        { id: 9, src: img9Url, alt: 'Event Decor 9' },
        { id: 10, src: img10Url, alt: 'Event Decor 10' }
    ];

    // Card images now use the 'about1' and 'about2' resources.
    cardImage1 = about1Url;
    cardImage2 = about2Url;

    // --- The rest of the code remains the same ---
    scrollInterval;
    imagesRendered = false;

    @track isModalOpen = false;
    @track contactName = '';
    @track contactEmail = '';

    renderedCallback() {
        if (!this.imagesRendered) {
            this.renderImages();
            this.imagesRendered = true;
        }
        this.startImageScroller();
    }

    disconnectedCallback() {
        clearInterval(this.scrollInterval);
    }

    renderImages() {
        const scroller = this.template.querySelector('.image-scroller');
        if (scroller) {
            this.images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = image.alt;
                imgElement.className = 'scroll-image';
                scroller.appendChild(imgElement);
            });
        }
    }

    startImageScroller() {
        const scroller = this.template.querySelector('.image-scroller');
        if (scroller && !this.scrollInterval) {
            this.scrollInterval = setInterval(() => {
                if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth) {
                    scroller.scrollLeft = 0;
                } else {
                    scroller.scrollLeft += 2;
                }
            }, 50);
        }
    }

    openModal() { this.isModalOpen = true; }
    closeModal() { this.isModalOpen = false; }
    handleNameChange(event) { this.contactName = event.target.value; }
    handleEmailChange(event) { this.contactEmail = event.target.value; }

    handleSubmit() {
        console.log('Name:', this.contactName);
        console.log('Email:', this.contactEmail);
        alert('Thank you! Your submission has been received.');
        this.closeModal();
        this.contactName = '';
        this.contactEmail = '';
    }
}
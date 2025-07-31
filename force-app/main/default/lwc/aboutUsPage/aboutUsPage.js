import { LightningElement, track } from 'lwc';

// Replace these with your actual image URLs
const IMAGE_LIST = [
    { id: 1, src: 'https://i.imgur.com/example-image-3.jpg', alt: 'Event Decor 1' },
    { id: 2, src: 'https://i.imgur.com/example-image-4.jpg', alt: 'Event Decor 2' },
    { id: 3, src: 'https://i.imgur.com/example-image-5.jpg', alt: 'Event Decor 3' },
    { id: 4, src: 'https://i.imgur.com/example-image-6.jpg', alt: 'Event Decor 4' },
    { id: 5, src: 'https://i.imgur.com/example-image-7.jpg', alt: 'Event Decor 5' },
    { id: 6, src: 'https://i.imgur.com/example-image-8.jpg', alt: 'Event Decor 6' },
    { id: 7, src: 'https://i.imgur.com/example-image-9.jpg', alt: 'Event Decor 7' },
    { id: 8, src: 'https://i.imgur.com/example-image-10.jpg', alt: 'Event Decor 8' },
    { id: 9, src: 'https://i.imgur.com/example-image-11.jpg', alt: 'Event Decor 9' },
    { id: 10, src: 'https://i.imgur.com/example-image-12.jpg', alt: 'Event Decor 10' }
];


export default class AboutUsPage extends LightningElement {
    // Image Gallery
    @track images = IMAGE_LIST;
    scrollInterval;
    imagesRendered = false; // Flag to prevent re-rendering images

    // Modal and Form
    @track isModalOpen = false;
    @track contactName = '';
    @track contactEmail = '';

    renderedCallback() {
        // Manually render the images only once
        if (!this.imagesRendered) {
            this.renderImages();
            this.imagesRendered = true;
        }

        // Start the scroller logic
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
                    scroller.scrollLeft = 0; // Reset to start
                } else {
                    scroller.scrollLeft += 2; // Adjust scroll speed
                }
            }, 50); // Adjust interval timing
        }
    }

    // Modal Controls
    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    // Form Input Handlers
    handleNameChange(event) {
        this.contactName = event.target.value;
    }

    handleEmailChange(event) {
        this.contactEmail = event.target.value;
    }

    // Form Submission (No Apex)
    handleSubmit() {
        console.log('Name:', this.contactName);
        console.log('Email:', this.contactEmail);
        alert('Thank you! Your submission has been received.');
        this.closeModal();
        this.contactName = '';
        this.contactEmail = '';
    }
}
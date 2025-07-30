import { LightningElement, track } from 'lwc';
import workshopBG from '@salesforce/resourceUrl/workshop';
import webinarBG from '@salesforce/resourceUrl/webinar';
import conferenceBG from '@salesforce/resourceUrl/conferenceBackground';

const SLIDES_DATA = [
    { index: 0, dotClass: 'dot active' },
    { index: 1, dotClass: 'dot' },
    { index: 2, dotClass: 'dot' }
];

export default class Carousel extends LightningElement {
    @track slides = SLIDES_DATA;
    currentSlide = 0;
    
    renderedCallback() {
        const carousel = this.template.querySelector('.carousel');
        if (carousel) {
            carousel.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        this.template.host.style.setProperty('--workshop-bg-image', `url(${workshopBG})`);
        this.template.host.style.setProperty('--webinar-bg-image', `url(${webinarBG})`);
        this.template.host.style.setProperty('--conference-bg-image', `url(${conferenceBG})`);
    }
    
    updateDots() {
        this.slides = this.slides.map(slide => ({
            ...slide,
            dotClass: slide.index === this.currentSlide ? 'dot active' : 'dot'
        }));
    }

    goToNext = () => {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    goToPrev = () => {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }
    
    goToSlide = (event) => {
        this.currentSlide = parseInt(event.target.dataset.index, 10);
        this.updateCarousel();
    }

    updateCarousel() {
        const carousel = this.template.querySelector('.carousel');
        if (carousel) {
            carousel.style.transform = `translateX(-${this.currentSlide * 100}%)`;
            this.updateDots();
        }
    }
}
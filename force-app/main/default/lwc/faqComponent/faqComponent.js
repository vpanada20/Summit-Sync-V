import { LightningElement, track } from 'lwc';

export default class FaqComponent extends LightningElement {
    @track faqs = [
        { id: 1, question: "How do I book an event ticket?", answer: "Simply browse the events list, click 'Book Now', select your seat, and confirm payment.", isOpen: false, iconName: "utility:chevronright" },
        { id: 2, question: "Can I cancel or reschedule my booking?", answer: "Yes, you can cancel or reschedule from your profile under 'My Bookings', subject to event policies.", isOpen: false, iconName: "utility:chevronright" },
        { id: 3, question: "Do I need to create an account to book?", answer: "Yes, creating an account helps us track your bookings, preferences, and provide better service.", isOpen: false, iconName: "utility:chevronright" },
        { id: 4, question: "What payment methods are accepted?", answer: "We accept all major credit cards, debit cards, UPI, and digital wallets for secure transactions.", isOpen: false, iconName: "utility:chevronright" },
        { id: 5, question: "Will I receive a booking confirmation?", answer: "Yes, after successful booking, you’ll receive a confirmation email and SMS with event details.", isOpen: false, iconName: "utility:chevronright" },
        { id: 6, question: "Can I book multiple tickets at once?", answer: "Yes, you can select multiple seats while booking, depending on event availability.", isOpen: false, iconName: "utility:chevronright" },
        { id: 7, question: "What happens if an event is canceled?", answer: "If an event is canceled, you will receive a full refund within 5–7 business days.", isOpen: false, iconName: "utility:chevronright" },
        { id: 8, question: "Is there a mobile app for booking?", answer: "Yes, you can also book via our mobile app available on iOS and Android.", isOpen: false, iconName: "utility:chevronright" },
        { id: 9, question: "How do I contact customer support?", answer: "You can reach us through our Help Center or email us at support@bookingsite.com.", isOpen: false, iconName: "utility:chevronright" },
        { id: 10, question: "Can I transfer my ticket to someone else?", answer: "Yes, ticket transfers are allowed if the event organizer permits it. You can update details under 'My Bookings'.", isOpen: false, iconName: "utility:chevronright" }
    ];

    toggleAnswer(event) {
        const faqId = parseInt(event.currentTarget.dataset.id, 10);
        this.faqs = this.faqs.map(faq => {
            if (faq.id === faqId) {
                faq.isOpen = !faq.isOpen;
                faq.iconName = faq.isOpen ? "utility:chevrondown" : "utility:chevronright";
            }
            return faq;
        });
    }
}

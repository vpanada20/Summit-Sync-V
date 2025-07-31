import { LightningElement, track } from 'lwc';

export default class FeedbackImpactShowcase extends LightningElement {
    @track improvements = [
        {
            id: 1,
            icon: 'utility:food_and_drink',
            title: 'More Culinary Variety',
            description: 'You asked for more diverse food options, so we expanded our catering menu to include more vegetarian, vegan, and international cuisine choices.'
        },
        {
            id: 2,
            icon: 'utility:checkin',
            title: 'Faster Check-In Process',
            description: 'We heard your comments about wait times. We\'ve implemented a new digital check-in system to get you to the celebration faster than ever.'
        },
        {
            id: 3,
            icon: 'utility:photo',
            title: 'Better Photo Opportunities',
            description: 'To help you capture the best memories, we\'ve added dedicated, beautifully designed photo booths and backdrops at all of our major events.'
        }
    ];
}
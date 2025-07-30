import { LightningElement, track, wire } from 'lwc';
import isGuest from '@salesforce/user/isGuest';
import userId from '@salesforce/user/Id';
import getCommunityUserInfo from '@salesforce/apex/CommunityLoginController.getCommunityUserInfo';

export default class Navbar extends LightningElement {
    @track isMobileMenuOpen = false;
    @track isProfileMenuOpen = false;
    @track userName = '';
    @track userPhotoUrl = '';
    
    // Properties to hold search terms
    nameSearchTerm = '';
    regionSearchTerm = '';
    
    isGuestUser = isGuest;

    @wire(getCommunityUserInfo, { userId: userId })
    wiredUserInfo({ error, data }) {
        if (data) {
            this.userName = data.userName;
            this.userPhotoUrl = data.userPhotoUrl;
        } else if (error) {
            console.error('Error fetching user info:', error);
        }
    }

    get isMember() { return !this.isGuestUser; }

    get userInitials() {
        if (this.userName) {
            const parts = this.userName.split(' ');
            return (parts.length > 1) ? (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase() : this.userName.charAt(0).toUpperCase();
        }
        return '';
    }

    toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
    toggleProfileMenu() { this.isProfileMenuOpen = !this.isProfileMenuOpen; }

    // --- Search Handlers ---
    handleNameSearchChange(event) {
        this.nameSearchTerm = event.target.value;
    }
    handleRegionSearchChange(event) {
        this.regionSearchTerm = event.target.value;
    }

    // This getter dynamically builds the search URL
    get searchUrl() {
        // Use encodeURIComponent to handle spaces and special characters safely
        const nameParam = encodeURIComponent(this.nameSearchTerm);
        const regionParam = encodeURIComponent(this.regionSearchTerm);
        return `/SummitSync/events?name=${nameParam}&region=${regionParam}`;
    }
}
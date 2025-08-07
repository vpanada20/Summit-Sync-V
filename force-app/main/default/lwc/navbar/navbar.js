import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import userId from '@salesforce/user/Id';
import getCommunityUserInfo from '@salesforce/apex/CommunityLoginController.getCommunityUserInfo';
import getRegionPicklistValues from '@salesforce/apex/EventController.getRegionPicklistValues';
import logo from '@salesforce/resourceUrl/logo';

export default class Navbar extends NavigationMixin(LightningElement) {
    @track isMobileMenuOpen = false;
    @track isProfileMenuOpen = false;
    @track userName = '';
    @track userPhotoUrl = '';
    @track searchError = '';
    
    nameSearchTerm = '';
    regionSearchTerm = '';
    validRegions = [];
    isGuestUser = isGuest;
    logoUrl = logo;

    @wire(getCommunityUserInfo, { userId: userId })
    wiredUserInfo({ error, data }) {
        if (data) {
            this.userName = data.userName;
            this.userPhotoUrl = data.userPhotoUrl;
        } else if (error) {
            console.error('Error fetching user info:', error);
        }
    }

    @wire(getRegionPicklistValues)
    wiredRegions({ error, data }) {
        if (data) {
            this.validRegions = data.map(option => option.value);
        } else if (error) {
            console.error('Error fetching region picklist values:', error);
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

    handleNameSearchChange(event) {
        this.nameSearchTerm = event.target.value;
    }
    handleRegionSearchChange(event) {
        this.regionSearchTerm = event.target.value;
        this.searchError = '';
    }

    handleSearch() {
        this.searchError = '';
        let formattedRegion = '';
        if (this.regionSearchTerm) {
            formattedRegion = this.regionSearchTerm.charAt(0).toUpperCase() + this.regionSearchTerm.slice(1).toLowerCase();
            if (!this.validRegions.includes(formattedRegion)) {
                this.searchError = 'Invalid region. Please enter a valid region name.';
                return;
            }
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__comm__namedPage',
            attributes: { name: 'Events' },
            state: { name: this.nameSearchTerm, region: formattedRegion }
        });
    }
}
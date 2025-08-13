import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import userId from '@salesforce/user/Id';
import getUserProfileInfo from '@salesforce/apex/UserProfileController.getUserProfileInfo';

export default class MyProfilePage extends NavigationMixin(LightningElement) {
    @track userName = '';
    @track userPhotoUrl = '';
    @track userEmail = '';
    @track userTitle = 'N/A';
    @track userDepartment = 'N/A';
    @track isLoading = true;

    @wire(getUserProfileInfo, { userId: userId })
    wiredUserInfo({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.userName = data.userName;
            this.userPhotoUrl = data.userPhotoUrl;
            this.userEmail = data.userEmail;
            if (data.userTitle) this.userTitle = data.userTitle;
            if (data.userDepartment) this.userDepartment = data.userDepartment;
        } else if (error) {
            console.error('Error fetching user profile info:', error);
        }
    }

    get userInitials() {
        if (this.userName) {
            const parts = this.userName.split(' ');
            if (parts.length > 1) {
                return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
            }
            return this.userName.charAt(0).toUpperCase();
        }
        return '';
    }

    handleEditProfile() {
        // Navigates to the standard Experience Cloud Account Management page
        this[NavigationMixin.Navigate]({
            type: 'standard__comm__namedPage',
            attributes: { name: 'My_Account' } 
        });
    }

    handleChangePassword() {
        // Navigates to the standard Experience Cloud Change Password page
        this[NavigationMixin.Navigate]({
            type: 'standard__comm__namedPage',
            attributes: { name: 'Change_Password' } 
        });
    }
}
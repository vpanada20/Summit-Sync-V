import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// IMPORTANT: Update the import to the new Apex class name
import getKnowledgeCategories from '@salesforce/apex/SupportArticleController.getKnowledgeCategories';
import getArticles from '@salesforce/apex/SupportArticleController.getArticles';

export default class SupportHome extends NavigationMixin(LightningElement) {
    // State properties
    @track categories = [];
    @track articles = [];
    selectedCategory = 'All';
    searchTerm = '';
    isLoading = true;

    // --- Data Fetching ---

    // 1. Fetch the list of categories when the component loads
    @wire(getKnowledgeCategories)
    wiredCategories({ error, data }) {
        if (data) {
            // Add a CSS class property to each category for UI styling
            this.categories = data.map(cat => ({...cat, cssClass: 'slds-nav-vertical__action' }));
            // Fetch articles for the default "All" category
            this.fetchArticles();
        } else if (error) {
            console.error('Error fetching categories:', error);
            this.isLoading = false;
        }
    }

    // 2. Imperatively fetch articles when needed
    async fetchArticles() {
        this.isLoading = true;
        try {
            const result = await getArticles({ 
                categoryName: this.selectedCategory, 
                searchTerm: this.searchTerm 
            });
            this.articles = result;
        } catch (error) {
            console.error('Error fetching articles:', error);
            this.articles = []; // Clear articles on error
        } finally {
            this.isLoading = false;
        }
    }

    // --- UI Event Handlers ---

    handleCategorySelect(event) {
        event.preventDefault();
        this.selectedCategory = event.target.dataset.category;
        // Reset search term when changing category
        this.searchTerm = '';
        
        // Update styling on the selected category
        this.categories.forEach(cat => {
            cat.cssClass = cat.name === this.selectedCategory ? 'slds-nav-vertical__action slds-is-active' : 'slds-nav-vertical__action';
        });

        this.fetchArticles();
    }

    handleSearchChange(event) {
        this.searchTerm = event.target.value;
        // Use a debounce mechanism to avoid calling Apex on every keystroke
        // For simplicity, we'll just call it on change, but debounce is best practice
        this.fetchArticles();
    }

    // --- Getters for UI ---
    get hasArticles() {
        return this.articles.length > 0;
    }
    
    get allTopicsClass() {
        return this.selectedCategory === 'All' ? 'slds-nav-vertical__action slds-is-active' : 'slds-nav-vertical__action';
    }

    get selectedCategoryLabel() {
        if (this.selectedCategory === 'All') {
            return 'All Topics';
        }
        const category = this.categories.find(cat => cat.name === this.selectedCategory);
        return category ? category.label : 'All Topics';
    }

    // --- Navigation ---
    navigateToArticle(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: 'comm__recordPage',
            attributes: {
                recordId: event.target.dataset.id,
                objectApiName: 'Knowledge__kav',
                actionName: 'view'
            }
        });
    }
}
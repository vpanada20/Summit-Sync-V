import { LightningElement, wire, track } from 'lwc';
import getCategorizedArticles from '@salesforce/apex/SupportHomeController.getCategorizedArticles';
import searchArticles from '@salesforce/apex/SupportHomeController.searchArticles'; // Import for the new bot
import { NavigationMixin } from 'lightning/navigation';

export default class SupportHome extends NavigationMixin(LightningElement) {
    // --- Properties for Main Page ---
    masterArticleList = [];
    @track filteredArticles = [];
    selectedCategory = 'All';
    searchTerm = '';
    
    // --- Properties for Chat Bot ---
    @track isChatOpen = false; 
    @track userInput = '';
    welcomeMessageSent = false;

    // --- Getters for UI ---
    get hasArticles() { 
        return this.filteredArticles && this.filteredArticles.length > 0; 
    }
    get allTopicsClass() { 
        return this.selectedCategory === 'All' ? 'slds-nav-vertical__action slds-is-active' : 'slds-nav-vertical__action'; 
    }
    get selectedCategoryLabel() {
        if (this.selectedCategory === 'All') return 'All Topics';
        const category = this.masterArticleList.find(cat => cat.categoryName === this.selectedCategory);
        return category ? category.categoryLabel : 'All Topics';
    }
    
    // --- Main Page Logic (Existing Functionality) ---
    @wire(getCategorizedArticles)
    wiredArticles({ error, data }) {
        if (data) {
            this.masterArticleList = data.map(cat => ({ 
                ...cat, 
                cssClass: 'slds-nav-vertical__action' 
            }));
            this.filterArticles();
        } else if (error) { 
            console.error('Error fetching articles:', error); 
        }
    }

    handleCategorySelect(event) {
        event.preventDefault();
        this.selectedCategory = event.target.dataset.category;
        this.masterArticleList.forEach(cat => {
            cat.cssClass = cat.categoryName === this.selectedCategory ? 'slds-nav-vertical__action slds-is-active' : 'slds-nav-vertical__action';
        });
        this.filterArticles();
    }

    handleSearchChange(event) {
        this.searchTerm = event.target.value.toLowerCase();
        this.filterArticles();
    }

    filterArticles() {
        let articles = [];
        if (this.selectedCategory === 'All') {
            this.masterArticleList.forEach(cat => { articles.push(...cat.articles); });
        } else {
            const category = this.masterArticleList.find(cat => cat.categoryName === this.selectedCategory);
            if(category) articles = category.articles;
        }

        if (this.searchTerm.length > 1) {
            articles = articles.filter(article => article.Title.toLowerCase().includes(this.searchTerm));
        }
        this.filteredArticles = articles;
    }

    // --- Chat Bot Logic (New Functionality) ---
    openChat() { 
        this.isChatOpen = true; 
        if (!this.welcomeMessageSent) {
            this.displayWelcomeMessage();
            this.welcomeMessageSent = true;
        }
    }
    
    closeChat() { this.isChatOpen = false; }
    handleInputChange(event) { this.userInput = event.target.value; }
    handleEnterKey(event) { if (event.keyCode === 13) this.handleSendMessage(); }
    
    handleSendMessage() {
        const text = this.userInput.trim();
        if (!text) return;
        this.addUserMessage(text); 
        this.generateBotResponse(text); 
        this.userInput = '';
    }

    addUserMessage(text) { this.addMessage(text, 'slds-chat-listitem_outbound'); }
    addBotMessage(text, isHtml = false) { this.addMessage(text, 'slds-chat-listitem_inbound', isHtml); }
    
    addMessage(text, cssClass, isHtml) {
        const chatLog = this.template.querySelector('.chat-log');
        if(!chatLog) return;
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `slds-chat-message ${cssClass}`;
        const messageBody = document.createElement('div');
        messageBody.className = 'slds-chat-message__body';
        const messageText = document.createElement('div');
        messageText.className = 'slds-chat-message__text';
        if(isHtml) { 
            messageText.innerHTML = text; 
        } else { 
            messageText.innerText = text; 
        }
        messageBody.appendChild(messageText);
        messageWrapper.appendChild(messageBody);
        chatLog.appendChild(messageWrapper);
        this.scrollToBottom();
    }

    displayWelcomeMessage() {
        const welcomeText = `Hello! I can search our Knowledge Base for you. What are you looking for?`;
        this.addBotMessage(welcomeText);
    }
    
    handleChatLogClick(event) {
        if (event.target.dataset.id) {
            this.navigateToArticle(event);
        }
    }

    async generateBotResponse(inputText) {
        this.addBotMessage("Searching for articles...", false);
        try {
            const results = await searchArticles({ searchTerm: inputText });
            const chatLog = this.template.querySelector('.chat-log');
            if (chatLog && chatLog.lastChild) {
                chatLog.removeChild(chatLog.lastChild); 
            }

            if (results.length > 0) {
                let htmlResponse = 'I found a few articles that might help:<ul class="slds-list_dotted slds-m-top_small">';
                results.forEach(article => {
                    htmlResponse += `<li><a href="#" class="bot-article-link" data-id="${article.id}">${article.title}</a></li>`;
                });
                htmlResponse += '</ul>';
                this.addBotMessage(htmlResponse, true);
            } else {
                this.addBotMessage("I couldn't find any articles matching that term. Please try rephrasing, or submit a ticket for more help.");
            }
        } catch (error) {
            console.error('Bot search error:', error);
            this.addBotMessage("Sorry, I encountered an error while searching. Please try again or submit a ticket.");
        }
    }
    
    renderedCallback() {
        if (this.isChatOpen) {
            const chatLog = this.template.querySelector('.chat-log');
            if (chatLog && !chatLog.dataset.listenerAttached) {
                chatLog.addEventListener('click', this.handleChatLogClick.bind(this));
                chatLog.dataset.listenerAttached = 'true';
            }
        }
    }

    scrollToBottom() { 
        setTimeout(() => { 
            const el = this.template.querySelector('.chat-log'); 
            if (el) el.scrollTop = el.scrollHeight; 
        }, 0); 
    }
    
    // --- Navigation ---
    navigateToNewTicket() { 
        this[NavigationMixin.Navigate]({ 
            type: 'comm__namedPage', 
            attributes: { 
                name: 'Help_Center_Ticket__c' 
            } 
        }); 
    }
    
    navigateToArticle(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({ 
            type: 'standard__recordPage', 
            attributes: { 
                recordId: event.target.dataset.id,
                objectApiName: 'Knowledge__kav',
                actionName: 'view'
            } 
        });
    }
}
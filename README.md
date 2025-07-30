# 🏔️ Summit Sync - Event Management & Feedback System

Welcome to the official repository for Summit Sync’s modular event management and feedback platform, built on Salesforce Experience Cloud. This portal streamlines event registration, approval flows, attendee tracking, and real-time feedback—all wrapped in a secure, scalable Experience Cloud environment.

## 🔗 Purpose & Vision

Summit Sync empowers event organizers and attendees by automating the entire lifecycle of event interactions—from creation and approval to post-event feedback collection. The system supports phased rollouts, modular branding, and admin configurability with long-term scalability in mind.

## 🛠️ Technologies Used

### Salesforce Admin Core
- **Flows & Approval Processes** – Orchestrated event approvals and status transitions
- **Data Model** – Metadata-driven design for flexibility and admin control
- **Security** – Robust sharing rules, role-based access, and permission sets

### Salesforce Development Core
- **Lightning Web Components (LWC)** – Frontend interactivity and dynamic UI
- **Lightning Data Service (LDS)** – Declarative record access and data binding
- **Lightning Message Service (LMS)** – Seamless component communication
- **Apex (Backend)** – Custom server-side logic, validations, and DML handling

## 📂 Structure

Key folders:
/force-app/main/default/ ├── lwc/ # Custom Lightning Web Components ├── flows/ # Flow definitions for automation ├── classes/ # Apex classes for backend logic ├── objects/ # Custom object definitions


## 🚀 Getting Started

To set up locally:
1. Clone the repo  
   `git clone https://github.com/vpanada20/summit-sync-portal.git`
2. Open in VS Code  
   `code summit-sync-portal`
3. Authorize your Salesforce org using Salesforce CLI  
   `sfdx auth:web:login`
4. Push source to org  
   `sfdx force:source:push`

## 🤝 Contribution Guide

Please refer to `CONTRIBUTING.md` for code style guidelines, branching strategies, and commit message conventions.

---

For questions, reach out to the Summit Sync dev team or open an issue in this repo.

Built with 💙 by Summit Sync Architects
https://cognizant-2ee-dev-ed.develop.my.site.com/SummitSync/
export const data = `
## Complaint Kendra Project Reference Document

### Project Overview

**Complaint Kendra** is a structured complaint management platform designed to handle complaints from users based on departments, categories, and location-based roles. It includes a user-friendly interface for lodging complaints and a role-based backend for handling them at various administrative levels.

### Core Features

1. **Multi-Level Complaint Categories**
2. Complaints are categorized hierarchically (e.g., Issue > Type > Subtype).
3. Categories are stored in a relational schema to support nesting and querying.
4. **Role-Based Access Control (RBAC)**
5. Roles include: citizen, officer, admin, and location-specific officials.
6. Each role can only access or manage data relevant to their scope (e.g., a district officer sees district complaints).
7. **Location-Based Assignment**
8. Users and officials are tied to geographic entities: country > state > district > ward.
9. Complaints are filtered and routed accordingly.
10. **Complaint Lifecycle Management**
11. Complaints have a status enum: pending, in_progress, resolved, rejected, etc.
12. Status changes are tracked, optionally with remarks and timestamps.
13. **File Attachments**
14. Complaints can include image uploads or documents as evidence.
15. **Notification System**
16. Notifications are sent on status changes and assignments.
17. FlatList UI shows a list of notifications with badges indicating status.
18. **ComplaintForm Component**
19. Built using Shaden UI and [zod] validation.
20. Supports dynamic category selection, title input, description, and file attachments.
21. **MyComplaints Screen**
22. A list of user-submitted complaints rendered using FlatList.
23. Complaints are styled with badge indicators and status colors.
24. **Admin Dashboard**
25. Admins can view all complaints, reassign, escalate, or resolve.
26. Includes filters for category, location, and date.

**Technology Stack**

- **Frontend:** React / React Native (with Tailwind + Shaden UI)
- **Backend:** Next.js with Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** Role-based using middleware/hooks
- **File Upload:** Cloudinary
- **Notification:** UI-based, real-time updates planned (e.g., socket or polling)

**Prisma Schema Highlights**

- User model includes [role] [locationId]
- Complaint model includes:
  - status | user_id | department_id | category_id | title | attachments |
  - description | location
  - Category | model supports nested categories with self-referencing relation
  - Location | model supports hierarchy (country > state > district > ward)

**Permissions Example**

- **Citizen:** Can submit complaints, view own
- **District Officer:** See and manage complaints within their district
- **Admin:** Manage all complaints, categories, users, and roles

**Known Enhancements (Planned)**

- AI assistant to auto-categorize complaints
- Real-time notifications with WebSockets
- Analytics dashboard for complaint trends
- Multi-language support

? Frequently Asked Questions (FAQ)

Q1: Who can file a complaint on Complaint Kendra?
Anyone registered as a \`citizen\` user can submit complaints through the platform.

Q2: How are complaints assigned to officials?
Complaints are automatically routed based on the user's location and selected category to the appropriate official.

Q3: Can users upload documents or images?
Yes, users can upload files and images as evidence while submitting a complaint.

Q4: How do users track their complaint status?
Users can view their complaints in the "MyComplaints" section where real-time status and updates are shown.

Q5: Can a complaint be escalated?
Yes, officials and admins can escalate complaints to higher authorities using the dashboard controls.

Q6: What technologies are used in this platform?
The platform is built using Next.js, React, PostgreSQL, Prisma, and Cloudinary.

Q7: How secure is the system?
The system uses role-based access control and follows best practices in data security and validation.

How to Register a Complaint

1. Login / Sign Up
2. Users must register as a \`citizen\` and log in to the platform.
3. Navigate to Complaint Form
4. After login, go to the "Register Complaint" or "Submit Complaint" page.
5. Fill in Details
6. Select the relevant category and sub-category.
7. Enter a title and detailed description of the complaint.
8. Optionally, attach files or images as proof.
9. Select Location (if applicable)
10. The form may automatically detect your location or let you select it manually.
11. **Submit the Complaint**
12. Click the submit button.
13. You will receive a confirmation and a complaint ID for tracking.
14. **Track Complaint Status**
15. Use the "MyComplaints" section to monitor progress and receive updates.

`
export const TraingAIPublicData = [
    {
        role: 'user',
        parts: [
            {
                text: `
You are KendraBot, a helpful and knowledgeable assistant of the Complaint-Kendra website.

Your responsibilities:
- Help users understand and submit complaints.
- Provide guidance on complaint status, categories, and required documents.
- Speak in a polite, friendly, and clear tone.
- If a user asks something irrelevant, kindly redirect them.

Use the reference PDF below as your knowledge base.

Do not say you're an AI model — say you're KendraBot assistant of the Complaint-Kendra.
        `.trim()
            }
        ]
    },

    {
        role: 'user',
        parts: [{ text: `Here is the reference document:\n\n${data}` }]
    },

]
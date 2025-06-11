# AHD | SaaS CRM Backend

Backend for the MVP SaaS platform built with NestJS and MongoDB.

## 🛠 Tech Stack
- NestJS
- MongoDB (Mongoose)
- JWT Auth

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-org/your-repo.git
cd backend
npm install
```
### 2. Set Up Environment Variables

copy .env.example to your .env file

```bash
cp .env.example .env
```

Make sure your .env.example is in the repo, and .env is ignored:

```bash
# .gitignore
.env
```

### 3. Run Locally
```bash
npm run start:dev
```

### Requirements

- Node.js 18+
- MongoDB (local or Atlas)

### git structure:

main         → team pushes their work here (for dev and test)
prod         → production (deployed or stable)
feature      → Create your own branch for each feature

```bash
# PULL changes to your local machine first

git pull origin main

# Start a new task by creating a new branch
git checkout -b new-feature

# After coding
git push origin new-feature

# Then open a PR into main branch
```


### Additional infos

you can visualize the DB using:
- MongoDB Atlas
- MongoDB Compass — official GUI
- Studio 3T — advanced GUI

# 🚀 ahdigital Platform | Architecture

> **Plateforme SaaS Multi-Tenant pour Agences Marketing**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://postgresql.org/)

## 🎯 Architecture Multi-Tenant

```
ahdigital
├── Agency (nos clients)
│   ├── SubAccount (clients des agences) 
│   │   ├── Contacts
│   │   ├── Funnels
│   │   └── Workflows
└── Users (avec rôles différents)
```

---

## 🛠️ Stack Technique

**Backend Core:**
- **Framework:** NestJS + TypeScript
- **Base de données:** MongoDB (messages)
- **Cache/Queue:** Redis + BullMQ
- **Storage:** AWS S3

**Intégrations:**
- **Auth:** JWT + OAuth2 + Passport.js
- **Communications:** Twilio (SMS) + Mailgun (Email) + WhatsApp API
- **Paiements:** Stripe + PayPal API
- **Infrastructure:** Docker + Kubernetes + NGINX

**Architecture Backend:**
```
[Frontend SPA] ↔ [API Gateway/NestJS]
                        ↓
┌─────────────────────────────────┐
│     Backend Modules             │
│ Auth | CRM | Workflows | Chat   │
│ Calendar | Funnels | Payments   │
└─────────────────────────────────┘
         ↓         ↓         ↓
   PostgreSQL   MongoDB    Redis
         ↓
[Twilio, Stripe, WhatsApp APIs]
```

---

## 📦 Entités Principales

### 🏢 **Agency**
```sql
agency_id (PK)
agency_name
contact_email
phone, address, city
logo, creation_date, status
```

### 🏪 **SubAccount** 
```sql
sub_account_id (PK)
agency_id (FK) → Agency
sub_account_name
industry, contact_email
creation_date, status
```

### 👤 **User**
```sql
user_id (PK)
email, password_hash
first_name, last_name
phone, creation_date, status
```

### 🎯 **Funnel**
```sql
funnel_id (PK)
sub_account_id (FK) → SubAccount
funnel_name, description
type (acquisition/conversion/retention)
status, creation_date
```

### 📍 **FunnelStage**
```sql
stage_id (PK)
funnel_id (FK) → Funnel
stage_name, description
order, estimated_duration
auto_actions (JSON)
```

### 👥 **Contact**
```sql
contact_id (PK)
sub_account_id (FK) → SubAccount
first_name, last_name
email, phone, company
source, tags (JSON)
creation_date
```

### 🎯 **Lead**
```sql
lead_id (PK)
contact_id (FK) → Contact
stage_id (FK) → FunnelStage
score (0-100)
temperature (hot/warm/cold)
entry_date, assigned_to
```

### 💼 **Deal**
```sql
deal_id (PK)
contact_id (FK) → Contact
lead_id (FK) → Lead
title, amount, probability
creation_date, closing_date
status (open/won/lost)
```

### ⚙️ **Workflow**
```sql
workflow_id (PK)
agency_id (FK) → Agency
sub_account_id (FK) → SubAccount
name, description
status, run_count
```

### 🔔 **Trigger**
```sql
trigger_id (PK)
workflow_id (FK) → Workflow
trigger_type (event/schedule/webhook)
event_source, activation_rules (JSON)
is_active
```

### ✅ **Action**
```sql
action_id (PK)
workflow_id (FK) → Workflow
trigger_id (FK) → Trigger
action_type (send_email/create_task/etc)
action_details (JSON)
execution_order, delay
```

---

## 🔗 Relations Clés

### **Hiérarchie**
- `Agency` (1) → `SubAccount` (N)
- `SubAccount` (1) → `Funnel` (N)
- `Funnel` (1) → `FunnelStage` (N)

### **Leads & Conversion**
- `Contact` (1) → `Lead` (N)
- `Lead` (1) → `Deal` (1)
- `FunnelStage` (1) → `Lead` (N)

### **Automation**
- `Workflow` (1) → `Trigger` (N)
- `Workflow` (1) → `Action` (N)
- `Lead` → déclenche → `Workflow`

---

## 🎮 Exemple Concret

### Restaurant "Pizza Luigi"
```sql
-- 1. Agence crée sous-compte
INSERT INTO SubAccount (agency_id, name) 
VALUES (1, 'Pizza Luigi');

-- 2. Funnel réservation
INSERT INTO Funnel (sub_account_id, name, type) 
VALUES (1, 'Réservation table', 'conversion');

-- 3. Étapes du funnel
INSERT INTO FunnelStage (funnel_id, name, order) 
VALUES 
(1, 'Formulaire rempli', 1),
(1, 'Contact confirmé', 2),
(1, 'Réservation confirmée', 3);
```

### Flow automatisé
```
Sophie remplit formulaire
↓
Contact créé
↓
Lead créé (étape "Formulaire rempli")
↓
Workflow "Nouveau lead" déclenché
↓
Actions: Email Sophie + SMS restaurant + Tâche
```

---

## 🛡️ Sécurité Multi-Tenant

### Isolation des données
```sql
-- Toujours filtrer par agence
SELECT * FROM contacts c
JOIN sub_accounts sa ON c.sub_account_id = sa.id
WHERE sa.agency_id = @current_agency_id;
```

### Rôles
- **Agency Admin** : Tout sur son agence
- **SubAccount Manager** : Tout sur ses sous-comptes
- **User** : Permissions limitées

---

## 📊 Tables Secondaires

### Communications
- `Conversation` → `Message` → `Channel`
- Centralise WhatsApp, Email, SMS, Chat

### Calendar
- `Event` → `EventType` → `Attendee` → `Reminder`

### Reputation  
- `Review` → `Rating` → `Customer`

### Landing Pages
- `Page` → `Section` → `Block` → `Form` → `Submission`

---

## 🔧 Contraintes Importantes

1. **Un lead** ne peut être que dans **une étape** à la fois
2. **Workflows** ne peuvent pas créer de **boucles infinies**
3. **Emails** uniques par contexte (agency/sub-account)
4. **Triggers** ont des **limites de fréquence**
5. **Données** toujours **isolées par agence**
# Role-Based Kanban Workflow System

## Overview

This document explains the comprehensive role-based Kanban workflow system that enables sequential task management across multiple teams and roles.

## Roles Involved

| Role | Icon | Responsibility |
|------|------|----------------|
| **Product Manager (PM)** | 👔 | Creates tasks, assigns all roles at creation time |
| **Developer** | 💻 | Implements features/fixes during Development stage |
| **Tester** | 🧪 | Tests implementations during Testing stage |
| **DevOps** | 🚀 | Deploys to environments during DevOps stage |
| **QA Reviewer** | ✅ | Final quality review during QA stage |

> **Note:** Roles can be customized per project by modifying the `workflowConfig.js` file.

---

## Kanban Columns (Stages)

Tasks move sequentially through these columns:

### 1. Backlog (PM Created)
- **Owner:** Product Manager
- **Description:** Initial task creation and planning
- **Actions:** Advance to Development

### 2. Development
| Sub-stage | Description |
|-----------|-------------|
| **Pending** | Waiting for developer to pick up |
| **In Progress** | Developer actively working |
| **Done** | Development completed, ready for testing |

### 3. Testing
| Sub-stage | Description |
|-----------|-------------|
| **Pending** | Waiting for tester to start |
| **In Progress** | Active testing (can reject → Dev Pending) |
| **Passed** | All tests passed |
| **Failed** | Tests failed (auto-moves to Dev Pending) |

### 4. DevOps
| Sub-stage | Description |
|-----------|-------------|
| **Deployment Pending** | Waiting for deployment |
| **Deploying** | Deployment in progress |
| **Deployed** | Successfully deployed |

### 5. QA Review
| Sub-stage | Description |
|-----------|-------------|
| **In Review** | QA actively reviewing (can reject → Test Pending) |
| **Approved** | QA approved |
| **Rejected** | QA rejected (auto-moves to Test Pending) |

### 6. Done
- **Final State:** Task successfully completed
- **No further actions available**

---

## Rules & Flow

### Task Creation Rules
1. **Only PM can create tasks** in the Backlog
2. **All roles must be assigned** at task creation:
   - Developer (required)
   - Tester (required)
   - DevOps (required)
   - QA Reviewer (required)
3. **Assignments are locked** after creation - PM cannot change them

### Task Movement Rules
1. **Sequential Movement Only** - Tasks must move through stages in order
2. **Role-Based Ownership** - Only the assigned role can work on tasks in their stage
3. **Automatic Transitions** - When work is completed, task moves to next stage

### Rejection Rules
1. **Testing can reject** → Task moves back to **Development Pending**
2. **QA can reject** → Task moves back to **Testing Pending**
3. **Rejection requires a reason** which is logged in task history

---

## State Transition Logic

### Step-by-Step Flow

```
┌─────────────┐
│   BACKLOG   │ ← PM creates task
└─────┬───────┘
      ↓ [Advance]
┌─────────────────────────────────────┐
│           DEVELOPMENT               │
│  Pending → In Progress → Done       │
└─────┬───────────────────────────────┘
      ↓ [Complete]
┌─────────────────────────────────────┐
│             TESTING                 │
│  Pending → In Progress → Passed     │
│              ↓ [Fail]               │
│         ← (Back to Dev) ←           │
└─────┬───────────────────────────────┘
      ↓ [Pass]
┌─────────────────────────────────────┐
│             DEVOPS                  │
│  Pending → Deploying → Deployed     │
└─────┬───────────────────────────────┘
      ↓ [Deploy]
┌─────────────────────────────────────┐
│           QA REVIEW                 │
│  In Review → Approved               │
│      ↓ [Reject]                     │
│  ← (Back to Testing) ←              │
└─────┬───────────────────────────────┘
      ↓ [Approve]
┌─────────────┐
│    DONE     │ ✅ Task Complete
└─────────────┘
```

### Transition Functions

| Current Stage | Action | Target Stage |
|---------------|--------|--------------|
| Backlog | Advance | Dev Pending |
| Dev Pending | Advance | Dev In Progress |
| Dev In Progress | Advance | Dev Done |
| Dev Done | Advance | Test Pending |
| Test Pending | Advance | Test In Progress |
| Test In Progress | Advance | Test Passed |
| Test In Progress | **Reject** | **Dev Pending** |
| Test Passed | Advance | Deploy Pending |
| Deploy Pending | Advance | Deploying |
| Deploying | Advance | Deployed |
| Deployed | Advance | QA In Review |
| QA In Review | Advance | QA Approved |
| QA In Review | **Reject** | **Test Pending** |
| QA Approved | Advance | Done |

---

## Example: Task Journey from Backlog to Done

### Task: "Implement User Authentication"

1. **Backlog** (Day 1)
   - PM: John creates task
   - Assigns: Dev: Alice, Test: Bob, DevOps: Charlie, QA: Diana
   - → Advances to Development

2. **Development Pending** (Day 1)
   - Alice sees task in her queue
   - → Alice starts working

3. **Development In Progress** (Day 2-4)
   - Alice implements authentication feature
   - → Alice marks as done

4. **Development Done** (Day 4)
   - Automatically moves to Testing

5. **Testing Pending** (Day 4)
   - Bob sees task in testing queue
   - → Bob starts testing

6. **Testing In Progress** (Day 5)
   - Bob finds a bug!
   - → Bob **REJECTS** with reason: "Password validation fails for special characters"

7. **⚠️ Back to Development Pending** (Day 5)
   - Alice sees rejection reason
   - → Alice fixes the bug and resubmits

8. **Development → Testing (Again)** (Day 6)
   - Bob retests
   - → All tests pass

9. **Test Passed** (Day 6)
   - Automatically moves to DevOps

10. **Deployment Pending → Deploying → Deployed** (Day 7)
    - Charlie deploys to staging
    - → Successfully deployed

11. **QA In Review** (Day 8)
    - Diana performs final review
    - → Approves the feature

12. **Done** (Day 8) ✅
    - Task completed successfully!

---

## Data Model (JSON Structure)

### Task Object

```json
{
  "id": 1706792400123,
  "title": "Implement User Authentication",
  "description": "Add login/signup functionality with OAuth support",
  "descMedia": [],
  "labels": [
    { "text": "Feature", "color": "#4fcc25" },
    { "text": "High Priority", "color": "#a8193d" }
  ],
  "date": "2026-02-15",
  "priority": "high",
  "tasks": [
    { "id": 1, "text": "Create login form", "completed": true, "media": [] },
    { "id": 2, "text": "Add OAuth providers", "completed": true, "media": [] }
  ],
  "currentStage": "qa_in_review",
  "stageHistory": [
    {
      "stageId": "backlog",
      "enteredAt": "2026-02-01T10:00:00Z",
      "exitedAt": "2026-02-01T10:30:00Z",
      "action": "created",
      "actor": "pm_john"
    },
    {
      "stageId": "dev_pending",
      "enteredAt": "2026-02-01T10:30:00Z",
      "exitedAt": "2026-02-01T11:00:00Z",
      "action": "advanced",
      "actor": "pm_john"
    },
    {
      "stageId": "test_in_progress",
      "enteredAt": "2026-02-05T09:00:00Z",
      "exitedAt": "2026-02-05T14:00:00Z",
      "action": "rejected",
      "actor": "tester_bob",
      "reason": "Password validation fails for special characters"
    }
  ],
  "createdBy": "pm_john",
  "createdAt": "2026-02-01T10:00:00Z",
  "updatedAt": "2026-02-08T16:00:00Z",
  "assignees": {
    "pm": "John Smith",
    "developer": "Alice Developer",
    "tester": "Bob Tester",
    "devops": "Charlie DevOps",
    "qa": "Diana QA"
  },
  "assigneesLocked": true,
  "completed": false,
  "rejected": false,
  "rejectionReason": "",
  "rejectionHistory": [
    {
      "fromStage": "test_in_progress",
      "toStage": "dev_pending",
      "reason": "Password validation fails for special characters",
      "at": "2026-02-05T14:00:00Z",
      "by": "tester_bob"
    }
  ]
}
```

### Stage Definition

```json
{
  "id": "test_in_progress",
  "name": "Testing In Progress",
  "category": "testing",
  "owner": "tester",
  "color": "#e91e84",
  "nextStage": "test_passed",
  "prevStage": "test_pending",
  "canReject": true,
  "rejectTarget": "dev_pending",
  "canPass": true,
  "description": "Tester is actively testing"
}
```

### Role Definition

```json
{
  "id": "developer",
  "name": "Developer",
  "color": "#49ccf9",
  "icon": "💻"
}
```

---

## Configuration

To customize roles or stages, edit `/src/config/workflowConfig.js`:

```javascript
// Add a new role
export const ROLES = {
  // ... existing roles
  SECURITY: { id: 'security', name: 'Security Reviewer', color: '#ff0000', icon: '🔐' }
};

// Add a new stage
export const STAGES = {
  // ... existing stages
  SECURITY_REVIEW: {
    id: 'security_review',
    name: 'Security Review',
    category: 'security',
    owner: 'security',
    color: '#ff0000',
    nextStage: 'done',
    prevStage: 'qa_approved',
    canReject: true,
    rejectTarget: 'dev_pending',
    canPass: true,
    description: 'Security team reviewing the implementation'
  }
};
```

---

## Usage Guide

### For Product Managers
1. Click **"Create Task"** button
2. Fill in task details
3. **Assign all roles** (required)
4. Click **"Create"** - task appears in Backlog

### For Team Members
1. Navigate to **Workflow Board** in sidebar
2. Find tasks in your role's columns
3. Click task card to view details
4. Use **"Advance"** to move to next stage
5. Use **"Reject"** to send back (Testing/QA only)

### Filtering & Search
- Use category tabs to filter by stage group
- Use search bar to find specific tasks
- Filter by role or priority using the filter dropdown

---

## Best Practices

1. **Always provide rejection reasons** - helps the receiving team understand what needs fixing
2. **Keep task titles descriptive** - easier to track across stages
3. **Use labels for categorization** - Feature, Bug, Enhancement, etc.
4. **Set due dates** - keeps the team accountable
5. **Break down large tasks** into subtasks - track progress better

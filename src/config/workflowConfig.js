/**
 * Role-Based Kanban Workflow Configuration
 * 
 * This file defines the complete workflow structure, roles, and state transition rules
 * for the role-based Kanban board system.
 */

// Available roles in the system
export const ROLES = {
    PM: { id: 'pm', name: 'Product Manager', color: '#7b68ee', icon: '👔' },
    DEVELOPER: { id: 'developer', name: 'Developer', color: '#49ccf9', icon: '💻' },
    TESTER: { id: 'tester', name: 'Tester', color: '#ff6b9d', icon: '🧪' },
    DEVOPS: { id: 'devops', name: 'DevOps', color: '#00d4aa', icon: '🚀' },
    QA: { id: 'qa', name: 'QA Reviewer', color: '#ffa800', icon: '✅' },
};

// Hardcoded users for demonstration
export const USERS = {
    'user1': { id: 'user1', name: 'Alice Johnson', role: 'pm', avatar: '👩' },
    'user2': { id: 'user2', name: 'Bob Smith', role: 'developer', avatar: '👨' },
    'user3': { id: 'user3', name: 'Charlie Brown', role: 'tester', avatar: '👦' },
    'user4': { id: 'user4', name: 'Diana Prince', role: 'devops', avatar: '👸' },
    'user5': { id: 'user5', name: 'Eve Wilson', role: 'qa', avatar: '👩‍💼' },
};

// Column/Stage definitions with their properties
export const STAGES = {
    // Backlog Stage (PM Created)
    BACKLOG: {
        id: 'backlog',
        name: 'Backlog',
        category: 'backlog',
        owner: 'pm',
        color: '#7b68ee',
        nextStage: 'dev_pending',
        prevStage: null,
        canReject: false,
        canPass: true,
        description: 'Tasks created by PM, waiting to be picked up'
    },

    // Development Stages
    DEV_PENDING: {
        id: 'dev_pending',
        name: 'Development Pending',
        category: 'development',
        owner: 'developer',
        color: '#49ccf9',
        nextStage: 'dev_in_progress',
        prevStage: 'backlog',
        canReject: false,
        canPass: true,
        description: 'Waiting for developer to start'
    },
    DEV_IN_PROGRESS: {
        id: 'dev_in_progress',
        name: 'Development In Progress',
        category: 'development',
        owner: 'developer',
        color: '#3498db',
        nextStage: 'dev_done',
        prevStage: 'dev_pending',
        canReject: false,
        canPass: true,
        description: 'Developer is actively working'
    },
    DEV_DONE: {
        id: 'dev_done',
        name: 'Development Done',
        category: 'development',
        owner: 'developer',
        color: '#2980b9',
        nextStage: 'test_pending',
        prevStage: 'dev_in_progress',
        canReject: false,
        canPass: true,
        description: 'Development completed, ready for testing'
    },

    // Testing Stages
    TEST_PENDING: {
        id: 'test_pending',
        name: 'Testing Pending',
        category: 'testing',
        owner: 'tester',
        color: '#ff6b9d',
        nextStage: 'test_in_progress',
        prevStage: 'dev_done',
        canReject: false,
        canPass: true,
        description: 'Waiting for tester to start'
    },
    TEST_IN_PROGRESS: {
        id: 'test_in_progress',
        name: 'Testing In Progress',
        category: 'testing',
        owner: 'tester',
        color: '#e91e84',
        nextStage: 'test_passed',
        prevStage: 'test_pending',
        canReject: true,
        rejectTarget: 'dev_pending', // On failure, goes back to Development Pending
        canPass: true,
        description: 'Tester is actively testing'
    },
    TEST_PASSED: {
        id: 'test_passed',
        name: 'Test Passed',
        category: 'testing',
        owner: 'tester',
        color: '#10b981',
        nextStage: 'deploy_pending',
        prevStage: 'test_in_progress',
        canReject: false,
        canPass: true,
        description: 'All tests passed'
    },
    TEST_FAILED: {
        id: 'test_failed',
        name: 'Test Failed',
        category: 'testing',
        owner: 'tester',
        color: '#ef4444',
        nextStage: 'dev_pending', // Goes back to development
        prevStage: 'test_in_progress',
        canReject: false,
        canPass: false, // Special: rejecting moves to dev_pending
        isFailureState: true,
        description: 'Testing failed, needs to go back to development'
    },

    // DevOps Stages
    DEPLOY_PENDING: {
        id: 'deploy_pending',
        name: 'Deployment Pending',
        category: 'devops',
        owner: 'devops',
        color: '#00d4aa',
        nextStage: 'deploying',
        prevStage: 'test_passed',
        canReject: false,
        canPass: true,
        description: 'Waiting for deployment'
    },
    DEPLOYING: {
        id: 'deploying',
        name: 'Deploying',
        category: 'devops',
        owner: 'devops',
        color: '#00b894',
        nextStage: 'deployed',
        prevStage: 'deploy_pending',
        canReject: false,
        canPass: true,
        description: 'Deployment in progress'
    },
    DEPLOYED: {
        id: 'deployed',
        name: 'Deployed',
        category: 'devops',
        owner: 'devops',
        color: '#009966',
        nextStage: 'qa_in_review',
        prevStage: 'deploying',
        canReject: false,
        canPass: true,
        description: 'Successfully deployed'
    },

    // QA Review Stages
    QA_IN_REVIEW: {
        id: 'qa_in_review',
        name: 'QA In Review',
        category: 'qa',
        owner: 'qa',
        color: '#ffa800',
        nextStage: 'qa_approved',
        prevStage: 'deployed',
        canReject: true,
        rejectTarget: 'test_pending', // On rejection, goes back to Testing Pending
        canPass: true,
        description: 'QA is reviewing the deployment'
    },
    QA_APPROVED: {
        id: 'qa_approved',
        name: 'QA Approved',
        category: 'qa',
        owner: 'qa',
        color: '#f39c12',
        nextStage: 'done',
        prevStage: 'qa_in_review',
        canReject: false,
        canPass: true,
        description: 'QA approved, ready to complete'
    },
    QA_REJECTED: {
        id: 'qa_rejected',
        name: 'QA Rejected',
        category: 'qa',
        owner: 'qa',
        color: '#ef4444',
        nextStage: 'test_pending', // Goes back to testing
        prevStage: 'qa_in_review',
        canReject: false,
        canPass: false,
        isFailureState: true,
        description: 'QA rejected, needs to go back to testing'
    },

    // Done Stage
    DONE: {
        id: 'done',
        name: 'Done',
        category: 'done',
        owner: null,
        color: '#10b981',
        nextStage: null,
        prevStage: 'qa_approved',
        canReject: false,
        canPass: false,
        isFinalState: true,
        description: 'Task completed successfully'
    }
};

// Workflow order for sequential board display
export const WORKFLOW_ORDER = [
    'backlog',
    'dev_pending',
    'dev_in_progress',
    'dev_done',
    'test_pending',
    'test_in_progress',
    'test_passed',
    'deploy_pending',
    'deploying',
    'deployed',
    'qa_in_review',
    'qa_approved',
    'done'
];

// Category groupings for visual display
export const STAGE_CATEGORIES = {
    backlog: { name: 'Backlog', color: '#7b68ee', stages: ['backlog'] },
    development: { name: 'Development', color: '#49ccf9', stages: ['dev_pending', 'dev_in_progress', 'dev_done'] },
    testing: { name: 'Testing', color: '#ff6b9d', stages: ['test_pending', 'test_in_progress', 'test_passed'] },
    devops: { name: 'DevOps', color: '#00d4aa', stages: ['deploy_pending', 'deploying', 'deployed'] },
    qa: { name: 'QA Review', color: '#ffa800', stages: ['qa_in_review', 'qa_approved'] },
    done: { name: 'Done', color: '#10b981', stages: ['done'] }
};

// Helper function to get stage by ID
export const getStageById = (stageId) => {
    return Object.values(STAGES).find(stage => stage.id === stageId);
};

// Helper function to get the next stage ID
export const getNextStage = (currentStageId) => {
    const currentStage = getStageById(currentStageId);
    return currentStage?.nextStage || null;
};

// Helper function to get the previous stage ID
export const getPrevStage = (currentStageId) => {
    const currentStage = getStageById(currentStageId);
    return currentStage?.prevStage || null;
};

// Helper function to check if a role can work on a stage
export const canRoleWorkOnStage = (roleId, stageId) => {
    const stage = getStageById(stageId);
    return stage?.owner === roleId;
};

// Helper function to get rejection target stage
export const getRejectionTarget = (stageId) => {
    const stage = getStageById(stageId);
    return stage?.rejectTarget || null;
};

// Task creation default template
export const createTask = (title, pmId, assignees = {}) => {
    const now = new Date().toISOString();
    return {
        id: Date.now() + Math.random() * 2,
        title,
        description: '',
        descMedia: [],
        labels: [],
        date: '',
        priority: 'medium',
        tasks: [], // subtasks
        currentStage: 'backlog',
        stageHistory: [
            {
                stageId: 'backlog',
                enteredAt: now,
                exitedAt: null,
                action: 'created',
                actor: pmId
            }
        ],
        createdBy: pmId,
        createdAt: now,
        updatedAt: now,
        // Assignees locked at creation by PM
        assignees: {
            pm: assignees.pm || null,
            developer: assignees.developer || null,
            tester: assignees.tester || null,
            devops: assignees.devops || null,
            qa: assignees.qa || null
        },
        assigneesLocked: true, // PM cannot change after creation
        completed: false,
        rejected: false,
        rejectionReason: '',
        rejectionHistory: []
    };
};

// Transition logic
export const transitionTask = (task, action, actorId, reason = '') => {
    const currentStage = getStageById(task.currentStage);
    const now = new Date().toISOString();

    if (action === 'advance') {
        if (!currentStage.canPass) {
            throw new Error(`Cannot advance from ${currentStage.name}`);
        }

        const nextStageId = currentStage.nextStage;
        if (!nextStageId) {
            throw new Error(`No next stage from ${currentStage.name}`);
        }

        // Update history
        const historyIndex = task.stageHistory.findIndex(
            h => h.stageId === task.currentStage && !h.exitedAt
        );
        if (historyIndex !== -1) {
            task.stageHistory[historyIndex].exitedAt = now;
        }

        // Add new history entry
        task.stageHistory.push({
            stageId: nextStageId,
            enteredAt: now,
            exitedAt: null,
            action: 'advanced',
            actor: actorId
        });

        task.currentStage = nextStageId;
        task.updatedAt = now;

        // Check if final state
        const nextStage = getStageById(nextStageId);
        if (nextStage.isFinalState) {
            task.completed = true;
        }

    } else if (action === 'reject') {
        if (!currentStage.canReject) {
            throw new Error(`Cannot reject from ${currentStage.name}`);
        }

        const rejectTargetId = currentStage.rejectTarget;
        if (!rejectTargetId) {
            throw new Error(`No rejection target from ${currentStage.name}`);
        }

        // Update history
        const historyIndex = task.stageHistory.findIndex(
            h => h.stageId === task.currentStage && !h.exitedAt
        );
        if (historyIndex !== -1) {
            task.stageHistory[historyIndex].exitedAt = now;
        }

        // Add new history entry
        task.stageHistory.push({
            stageId: rejectTargetId,
            enteredAt: now,
            exitedAt: null,
            action: 'rejected',
            actor: actorId,
            reason
        });

        // Track rejection history
        task.rejectionHistory.push({
            fromStage: task.currentStage,
            toStage: rejectTargetId,
            reason,
            at: now,
            by: actorId
        });

        task.currentStage = rejectTargetId;
        task.rejected = true;
        task.rejectionReason = reason;
        task.updatedAt = now;
    }

    return task;
};

const workflowConfig = {
    ROLES,
    USERS,
    STAGES,
    WORKFLOW_ORDER,
    STAGE_CATEGORIES,
    getStageById,
    getNextStage,
    getPrevStage,
    canRoleWorkOnStage,
    getRejectionTarget,
    createTask,
    transitionTask
};
export default workflowConfig;

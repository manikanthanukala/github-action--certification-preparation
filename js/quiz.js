const questions = [
    {
        question: "How does GitHub expose an input named 'build target' from a workflow to a JavaScript action?",
        options: [
            "As INPUT_BUILD_TARGET in uppercase with underscores",
            "As build-target with hyphens",
            "As GITHUB_BUILD_TARGET",
            "As build target exactly as written"
        ],
        correct: 0,
        explanation: "GitHub automatically converts action inputs to environment variables with the prefix <code>INPUT_</code>, converts the name to UPPERCASE, and replaces spaces with underscores. So 'build target' becomes <code>INPUT_BUILD_TARGET</code>."
    },
    {
        question: "What is the maximum number of jobs a matrix can create in a single workflow run?",
        options: ["512", "256", "1024", "No limit"],
        correct: 1,
        explanation: "GitHub imposes a hard limit of <strong>256 jobs</strong> per workflow run when using a matrix strategy."
    },
    {
        question: "Your company wants to enforce secure, standardized CI/CD across 50+ repositories. What is the best approach?",
        options: [
            "Require CODEOWNERS reviews for all workflow changes",
            "Publish reusable workflows and starter templates with built-in security",
            "Move everything to another CI system",
            "Use repository environment variables only"
        ],
        correct: 1,
        explanation: "The most scalable and enforceable way is to create <strong>organization-level reusable workflows</strong> and starter workflows that include required security steps (CodeQL, dependency review, secrets scanning, etc.)."
    },
    {
        question: "When are service containers (like postgres, redis) created and destroyed in a job?",
        options: [
            "Once per workflow run",
            "Once per runner session",
            "At the start of the job and destroyed when the job ends",
            "Only when a step references them"
        ],
        correct: 2,
        explanation: "Service containers are created when the job starts and are automatically destroyed when the job completes — even if some steps don't use them."
    },
    },
    {
        question: "Where can you view the detailed logs from a Docker container action step?",
        options: [
            "In the GitHub Actions workflow run → expand the step",
            "Using docker logs on the runner machine",
            "In Cloud Build console",
            "Only via GitHub CLI"
        ],
        correct: 0,
        explanation: "All action output (including container actions) appears directly in the GitHub Actions UI when you expand the step in the workflow run."
    },
    {
        question: "Which event can trigger a workflow manually from the GitHub UI?",
        options: ["push, pull_request, issues, workflow_dispatch],
        correct: 3,
        explanation: "<code>workflow_dispatch</code> allows you to trigger a workflow manually or via API with custom inputs."
    },
    {
        question: "What is the default permission level of GITHUB_TOKEN in a workflow?",
        options: [
            "read-only for contents and packages",
            "full repo access",
            "depends on the triggering event",
            "no access at all"
        ],
        correct: 0,
        explanation: "By default, <code>GITHUB_TOKEN</code> has read access to contents, packages, and limited write access. Since 2022, the default is now more restrictive unless explicitly set with <code>permissions</code>."
    },
    {
        question: "How do you cache dependencies across workflow runs?",
        options: [
            "Use actions/cache with a key based on hashFiles()",
            "Use artifacts with retention",
            "GitHub does it automatically",
            "Only self-hosted runners support caching"
        ],
        correct: 0,
        explanation: "The official <code>actions/cache</code> action + a unique key (usually from <code>hashFiles('**/package-lock.json')</code>) is the standard way to cache node_modules, Maven, etc."
    },
    {
        question: "Which scope can secrets be defined in? (Select all that apply)",
        options: [
            "Repository secrets",
            "Environment secrets",
            "Organization secrets",
            "All of the above"
        ],
        correct: 3,
        explanation: "Secrets can be defined at repository, environment, and organization levels. Org secrets can be made available to selected or all repositories."
    },
    {
        question: "What happens if you set <code>continue-on-error: true</code> on a step?",
        options: [
            "The job fails immediately",
            "The job continues even if the step fails",
            "Only the step is skipped",
            "The workflow is cancelled"
        ],
        correct: 1,
        explanation: "<code>continue-on-error: true</code> allows the job to continue running even if that step fails. The step result will be marked as failed, but the job outcome can still be success."
    }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');

totalEl.textContent = questions.length;

function loadQuestion() {
    const q = questions[currentQuestion];
    questionEl.innerHTML = `<strong>Question ${currentQuestion + 1}:</strong> ${q.question}`;
    optionsEl.innerHTML = '';
    feedbackEl.classList.add('d-none');
    nextBtn.disabled = true;

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'list-group-item list-group-item-action';
        btn.innerHTML = option;
        btn.onclick = () => selectAnswer(index, btn);
        optionsEl.appendChild(btn);
    });

    currentEl.textContent = currentQuestion + 1;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
}

function selectAnswer(selectedIndex, btn) {
    const q = questions[currentQuestion];
    const allBtns = optionsEl.querySelectorAll('button');

    // Disable all buttons
    allBtns.forEach(b => b.disabled = true);
    btn.classList.add(selectedIndex === q.correct ? 'list-group-item-success' : 'list-group-item-danger');

    if (selectedIndex === q.correct) {
        score++;
        feedbackEl.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
        feedbackEl.className = 'alert alert-success';
    } else {
        feedbackEl.innerHTML = `<strong>Incorrect.</strong> ${q.explanation} <br><small>The correct answer is: <strong>${q.options[q.correct]}</strong></small>`;
        feedbackEl.className = 'alert alert-danger';
        // Highlight correct one
        allBtns[q.correct].classList.add('list-group-item-success');
    }

    feedbackEl.classList.remove('d-none');
    nextBtn.disabled = false;
}

nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
};

function showResult() {
    document.getElementById('quiz-container').classList.add('d-none');
    const result = document.getElementById('result-container');
    result.classList.remove('d-none');
    document.getElementById('score').textContent = score;
    document.getElementById('total-questions').textContent = questions.length;
}

// Start the quiz
loadQuestion();

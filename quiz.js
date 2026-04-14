// Quiz questions and options
const questions = [
    {
        question: "Which of the following best describes your current situation?",
        options: [
            { text: "I feel called to grow something, but I'm stuck in inconsistency and overthinking", value: "A" },
            { text: "I have ideas and some movement, but no clear structure or consistent income yet", value: "B" },
            { text: "I already have a business/personal brand and i'm ready to scale with strategy and structure", value: "C" }
        ]
    },
    {
        question: "How would you describe your current emotional state on a daily basis??",
        options: [
            { text: "I feel stable and in control", value: "A" },
            { text: "I know I can achieve more success if I get the right guidance", value: "B" },
            { text: "I often feel overwhelmed or mentally scattered", value: "C" }
        ]
    },
    {
        question: "Which of these patterns do you recognize in recognize in yourself the most?",
        options: [
            { text: "Overthinking everything and delaying decisions", value: "A" },
            { text: "Starting things but not following through", value: "B" },
            { text: "Doubting myself even when I know what to do", value: "C" }
        ]
    },
    {
        question: "Have you experienced moments where you feel completely anxious, overwhelmed, or unsure of yourself?",
        options: [
            { text: "No", value: "A" },
            { text: "Rarely", value: "B" },
            { text: "Yes - and it'becoming exhausting", value: "C" }
        ]
    },
    {
        question: "How often do your emotions affect your ability to stay consistent in your business or decisions?",
        options: [
            { text: "Rarely - I can stay consistent regardless of how i feel", value: "A" },
            { text: "Sometimes - it affects me, but i can usually get back on track", value: "B" },
            { text: "I feel like I'm constantly self-sabotaging my business", value: "C" }
        ]
    },
    {
        question: "What do you feel is the main thing holding you back right now?",
        options: [
            { text: "I overthink/ I'm inconsistent", value: "A" },
            { text: "I don't know what to do next", value: "B" },
            { text: "I start but don't finish", value: "C" }
            
            
        ]
    },
    {
        question: "If nothing changes in your life or business over the next 6-12 months.. how would that honestly make you feel?",
        options: [
            { text: "I'm honestly okay staying where I am right now", value: "A" },
            { text: "I feel far from it", value: "B" },
            { text: "I feel completely disconnected from it", value: "C" },
        
            
        ]
    },

    {  
        question: "How far do you feel from the life or business you actuall want?",
        options: [
            { text: "I'm pretty close, just some adjustments needed", value: "A" },
            { text: "I feel far from it", value: "B" },
            { text: "I feel completley disconnected from it", value: "C" },

        ]

    },
    { 
        question: "RIght now, are you more afraid of investing in yourself.. or staying in the same situation?",
        options: [
            { text: "Investing feels scarier", value: "A" },
            { text: "Both feel ucomfortable", value: "B" },
            { text: "I'm more afraid of wasting more time like this", value: "C" },
        ]
    },
    { question: "What is your current monthly income ( from your business or personal brand )?",
        options: [
            { text: "€1K- €3K", value: "A" },
            { text: "€3K- €5K", value: "B" },
            { text: "€10K+", value: "C" }
        ]
    },
    {
        question: "If you found the right support to help you create clarity, structure, and consistent income, are you in a position to invest in your growth right now?",
        options: [
            { text: "Yes, I'm ready to invest in myself right now", value: "A" },
            { text: "I'm open, but I would need to think about it", value: "B" },
            { text: "Not at the moment", value: "C" },
        ]
    },

];

let currentQuestion = 0;
let answers = [];

// DOM Elements
const questionsContainer = document.getElementById('questionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const contactSection = document.getElementById('contactSection');
const quizForm = document.getElementById('quizForm');

// Initialize quiz
function initQuiz() {
    showQuestion(currentQuestion);
    updateProgress();
}

// Show question
function showQuestion(index) {
    const question = questions[index];
    questionsContainer.innerHTML = '';

    const questionCard = document.createElement('div');
    questionCard.className = 'bg-white rounded-lg shadow-lg p-6 question-card';
    
    const questionTitle = document.createElement('h2');
    questionTitle.className = 'text-xl font-semibold mb-4';
    questionTitle.textContent = question.question;
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'space-y-3';
    
    question.options.forEach((option, optionIndex) => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card p-4 border rounded-lg cursor-pointer hover:bg-gray-50';
        if (answers[index] === option.value) {
            optionCard.classList.add('selected');
        }
        
        optionCard.innerHTML = `
            <label class="flex items-center cursor-pointer">
                <input type="radio" name="q${index}" value="${option.value}" 
                    ${answers[index] === option.value ? 'checked' : ''} class="hidden">
                <span class="ml-2">${option.text}</span>
            </label>
        `;
        
        optionCard.addEventListener('click', () => selectOption(optionCard, index, option.value));
        optionsContainer.appendChild(optionCard);
    });
    
    questionCard.appendChild(questionTitle);
    questionCard.appendChild(optionsContainer);
    questionsContainer.appendChild(questionCard);

    // Update navigation buttons
    prevBtn.style.display = index === 0 ? 'none' : 'block';
    nextBtn.style.display = index === questions.length - 1 ? 'none' : 'block';
    submitBtn.style.display = index === questions.length - 1 ? 'block' : 'none';
    contactSection.style.display = index === questions.length - 1 ? 'block' : 'none';
}

// Select option
function selectOption(optionCard, questionIndex, value) {
    // Remove selection from other options
    const options = optionCard.parentElement.children;
    Array.from(options).forEach(option => option.classList.remove('selected'));
    
    // Add selection to clicked option
    optionCard.classList.add('selected');
    
    // Save answer
    answers[questionIndex] = value;
}

// Navigation
prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
        updateProgress();
    }
});

nextBtn.addEventListener('click', () => {
    if (answers[currentQuestion]) {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
            updateProgress();
        }
    } else {
        alert('Please select an answer before continuing.');
    }
});

// Update progress
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
}

// Form submission
quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!answers.every(answer => answer)) {
        alert('Please answer all questions before submitting.');
        return;
    }

    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    const formData = new FormData();
    formData.append('access_key', '812ad935-9c03-4aba-817c-a5f9253d662a');
    formData.append('subject', 'New Transformation Quiz Submission');
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('answers', JSON.stringify(answers));
    

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Thank you for completing the quiz! I will be in contact with you soon to share the next steps ☺️');
            window.location.href = 'https://euniceinsideglow.com/thankyouquiz';
        } else {
            alert('There was an error submitting your quiz. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your quiz. Please try again.');
    }
});

// Calculate quiz type
function calculateQuizType(answers) {
    const counts = {
        A: answers.filter(a => a === 'A').length,
        B: answers.filter(a => a === 'B').length,
        C: answers.filter(a => a === 'C').length
       
    };

    if (counts.A > counts.B && counts.A > counts.C ) {
        return 'style-transformer';
    } else if (counts.B > counts.A && counts.B > counts.C) {
        return 'ambitious-creator';
    } else if (counts.C > counts.A && counts.C > counts.B) {
        return 'inner-healer';
    } else {
        return 'multi-dreamer';
    }
}

// Initialize the quiz
initQuiz();
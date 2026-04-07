// Quiz questions and options
const questions = [
    {
        question: "When you think about improving your life, what excites you most right now?",
        options: [
            { text: "Transforming my image (hair, makeup, fashion)", value: "A" },
            { text: "Growing in business & learning strategies", value: "B" },
            { text: "Healing my emotions & strengthening my mindset", value: "C" }
        ]
    },
    {
        question: "Which of these statements feels more like you today?",
        options: [
            { text: "I want to look in the mirror and finally LOVE what I see", value: "A" },
            { text: "I know I can achieve more success if I get the right guidance", value: "B" },
            { text: "I feel stuck emotionally and need to break free from negative cycles", value: "C" }
        ]
    },
    {
        question: "How do you usually handle challenges?",
        options: [
            { text: "I change my appearance or style to feel better", value: "A" },
            { text: "I focus on working harder or trying new business ideas", value: "B" },
            { text: "I retreat, overthink, or get demotivated", value: "C" }
        ]
    },
    {
        question: "Which result would make the biggest impact in your life right now?",
        options: [
            { text: "Confidence to shine with my personal image", value: "A" },
            { text: "Financial stability and business growth", value: "B" },
            { text: "Inner peace, clarity, and emotional strength", value: "C" }
        ]
    },
    {
        question: "How much are you currently investing in your personal growth?",
        options: [
            { text: "Less than $100/month", value: "A" },
            { text: "Around $100–$500/month", value: "B" },
            { text: "$500+ /month because I see it as a priority", value: "C" }
        ]
    },
    {
        question: "What best describes your income level right now?",
        options: [
            { text: "Less than $2,000/month", value: "A" },
            { text: "$2,000–$5,000/month", value: "B" },
            { text: "$5,000+/month", value: "C" },
            { text: "Prefer Not to Say", value: "D" }
            
        ]
    },
    {
        question: "What's the BEST time to contact you?",
        options: [
            { text: "Morning", value: "morning" },
            { text: "Afternoon", value: "afternoon" },
            { text: "Evening", value: "evening" }
        ]
    }
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
    formData.append('bestTimeToContact', answers[6] || 'Not specified');

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Thank you for completing the quiz! We will email you soon with your results.');
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
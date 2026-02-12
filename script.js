// Wait for the DOM to load
window.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const yesButton = document.getElementById("yesButton");
    const noButton = document.getElementById("noButton");
    const question = document.getElementById("question");
    const noAudio = document.getElementById("noAudio");
    const bgAudio = document.getElementById("bgAudio");

    // Questions and button texts
    const questions = [
        "Sure na?",
        "SURE NAJUD?:(",
        "SURE BA??? T-T",
        "SIGE NA BA :<"
    ];
    const noButtonLoopTexts = [
        "DELE",
        "NOOOO",
        "DI LAGI",
        "SURE KO NGA DILI"
    ];

    // State variables
    let questionIdx = 0;
    let noTextIdx = 0;
    let noClickCount = 0;
    let grow = true;
    const fontSizeStep = 50; // Change this value to control the amount of increase/decrease
    const minFontSize = 18;

    // Handle 'No' button click (change question, button text, play sound, grow Yes button only)
    noButton.addEventListener("click", () => {
        noClickCount++;
        // Get current font size
        let currentFontSize = parseInt(window.getComputedStyle(yesButton).fontSize);
        // Only grow the Yes button
        yesButton.style.fontSize = `${currentFontSize + fontSizeStep}px`;
        // Cycle through questions
        questionIdx = (questionIdx + 1) % questions.length;
        question.textContent = questions[questionIdx];
        // Cycle through No button texts
        noButton.textContent = noButtonLoopTexts[noTextIdx];
        noTextIdx = (noTextIdx + 1) % noButtonLoopTexts.length;
        // Play sound
        if (noAudio) {
            noAudio.currentTime = 0;
            noAudio.play();
        }
    });

    // Handle 'No' button movement (avoid Yes button)
    noButton.addEventListener("click", function () {
        const container = document.querySelector(".container");
        const yesBtn = document.getElementById("yesButton");
        const nRect = container.getBoundingClientRect();
        const yRect = yesBtn.getBoundingClientRect();
        const btnWidth = this.offsetWidth;
        const btnHeight = this.offsetHeight;
        const maxX = nRect.width - btnWidth;
        const maxY = nRect.height - btnHeight;
        let tries = 0;
        let a, c, overlap;
        do {
            a = Math.floor(Math.random() * maxX);
            c = Math.floor(Math.random() * maxY);
            const noBtnRect = {
                left: nRect.left + a,
                top: nRect.top + c,
                right: nRect.left + a + btnWidth,
                bottom: nRect.top + c + btnHeight
            };
            const yesBtnRect = yesBtn.getBoundingClientRect();
            overlap = !(
                noBtnRect.right < yesBtnRect.left ||
                noBtnRect.left > yesBtnRect.right ||
                noBtnRect.bottom < yesBtnRect.top ||
                noBtnRect.top > yesBtnRect.bottom
            );
            tries++;
        } while (overlap && tries < 100);
        this.style.position = "absolute";
        this.style.left = `${a}px`;
        this.style.top = `${c}px`;
    });

    // Handle 'Yes' button click (download contract and set flag)
    yesButton.addEventListener("click", () => {
        // prevent double clicks
        yesButton.disabled = true;

        // Download the date contract
        downloadDateContract();
        
        // Set flag to show notification on thank you page
        localStorage.setItem('showDownloadNotif', 'true');
        
        // Redirect to thank you page
        window.location.href = "thankyou.html";
    });

    // Function to download the date contract
    function downloadDateContract() {
        const link = document.createElement('a');
        link.href = 'assets/images/Contract.png';
        link.download = 'Date_Contract.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Try to play background audio; if autoplay is blocked, resume on first user interaction
    function tryPlayBgAudio() {
        if (!bgAudio) return;
        bgAudio.volume = 0.8;
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                const resume = () => {
                    bgAudio.play().catch(() => {});
                    window.removeEventListener('click', resume);
                    window.removeEventListener('keydown', resume);
                };
                window.addEventListener('click', resume, { once: true });
                window.addEventListener('keydown', resume, { once: true });
            });
        }
    }

    tryPlayBgAudio();

    // Show notification on thank you page if flag is set
    if (document.getElementById('notification')) {
        if (localStorage.getItem('showDownloadNotif') === 'true') {
            showNotification();
            localStorage.removeItem('showDownloadNotif');
        }
    }

    // Function to show notification
    function showNotification() {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        const closeBtn = notification.querySelector('.notification-close');
        
        notification.classList.remove('hidden');
        notification.classList.remove('hiding');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', hideNotification);
        }
        
        // Auto-hide after 3 seconds
        setTimeout(hideNotification, 3000);
    }

    // Function to hide notification
    function hideNotification() {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.classList.add('hiding');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 400);
    }
});
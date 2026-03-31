document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Reveal elements on scroll
    const sections = document.querySelectorAll('section');
    
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        sectionObserver.observe(section);
    });

    // Chatbox logic
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatboxWindow');
    const closeChat = document.getElementById('closeChat');
    const sendChat = document.getElementById('sendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if(chatToggle && chatWindow && closeChat && sendChat && chatInput && chatMessages) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });

        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', sender);
            msgDiv.innerHTML = `<p>${text}</p>`;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        // Respuestas predefinidas
        const getBotResponse = (input) => {
            const lowerInput = input.toLowerCase();
            
            if (lowerInput.includes('precio') || lowerInput.includes('costo') || lowerInput.includes('mensualidad') || lowerInput.includes('cuanto')) {
                return "Nuestra membresía Básica es de $50/mes y la Pro Elite es de $90/mes. Ambas te dan acceso 24/7. ¡Revisa la sección de Membresías para más detalles!";
            }
            if (lowerInput.includes('horario') || lowerInput.includes('abierto') || lowerInput.includes('a que hora')) {
                return "¡Estamos abiertos 24/7 de Lunes a Viernes! Fines de semana de 6:00 AM a 10:00 PM.";
            }
            if (lowerInput.includes('ubicacion') || lowerInput.includes('direccion') || lowerInput.includes('donde') || lowerInput.includes('ubicación') || lowerInput.includes('dirección')) {
                return "Nos encontramos en la ubicación mostrada en el mapa al final de la página. ¡Te esperamos!";
            }
            if (lowerInput.includes('clase') || lowerInput.includes('crossfit') || lowerInput.includes('yoga') || lowerInput.includes('funcional')) {
                return "Ofrecemos clases de CrossFit, HIIT, Powerlifting, Yoga Recovery y mucho más. Tenemos horarios desde las 7:00 AM hasta las 8:00 PM.";
            }
            if (lowerInput.includes('hola') || lowerInput.includes('buenos dias') || lowerInput.includes('buenas tardes') || lowerInput.includes('buenas')) {
                return "¡Hola! Bienvenido a Nexus Fitness. ¿En qué te puedo ayudar hoy (horarios, precios, clases)?";
            }
            
            return "En este momento todos nuestros entrenadores están dando el 100% 🏋️‍♂️. Déjanos tus datos o llámanos al +1 234 567 8900 y te atenderemos enseguida.";
        };

        const handleSend = () => {
            const text = chatInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                chatInput.value = '';
                
                // Respond based on user input
                setTimeout(() => {
                    const response = getBotResponse(text);
                    addMessage(response, 'bot');
                }, 800);
            }
        };

        sendChat.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }

    // Modal Logic
    const modals = document.querySelectorAll('.open-modal-btn');
    const modalOverlay = document.getElementById('leadModal');
    const modalClose = document.getElementById('closeModal');

    if(modalOverlay && modalClose) {
        modals.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modalOverlay.classList.add('active');
            });
        });

        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });

        modalOverlay.addEventListener('click', (e) => {
            if(e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // Swiper Carousel init
    const swiper = new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            }
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        }
    });

    // Form Mock Submit
    const leadForm = document.getElementById('leadForm');
    if(leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Solicitud enviada! Nos pondremos en contacto contigo.');
            modalOverlay.classList.remove('active');
            leadForm.reset();
        });
    }
});

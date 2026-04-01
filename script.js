document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, input, select, .tilt-card');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // Parallax Effect for Hero Video
    const heroVideo = document.querySelector('.hero-video');
    window.addEventListener('scroll', () => {
        if (heroVideo) {
            let scrollPosition = window.pageYOffset;
            heroVideo.style.transform = `translateX(-50%) translateY(calc(-50% + ${scrollPosition * 0.4}px))`;
        }
    });

    // 3D Tilt Effect for Coaches
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // X position within the element
            const y = e.clientY - rect.top;  // Y position within the element
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 15 degrees)
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // remove transition for smooth tracking
        });
    });
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

    // AI Coach logic
    const aiToggle = document.getElementById('aiCoachToggle');
    const aiWindow = document.getElementById('aiCoachWindow');
    const closeAI = document.getElementById('closeAICoach');
    
    // Tabs
    const tabs = document.querySelectorAll('.ai-tab');
    const tabContents = document.querySelectorAll('.ai-tab-content');

    // Chat elements
    const sendAIChat = document.getElementById('sendAIChat');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatMessages = document.getElementById('aiChatMessages');

    // Forms
    const btnGenerateRoutine = document.getElementById('btnGenerateRoutine');
    const btnGenerateDiet = document.getElementById('btnGenerateDiet');
    
    // Result Overlay
    const aiResultOverlay = document.getElementById('aiResultOverlay');
    const btnBackToForms = document.getElementById('btnBackToForms');
    const aiResultContent = document.getElementById('aiResultContent');

    if (aiToggle && aiWindow && closeAI) {
        // Toggle Window
        aiToggle.addEventListener('click', () => {
            aiWindow.classList.toggle('active');
        });

        closeAI.addEventListener('click', () => {
            aiWindow.classList.remove('active');
        });

        // Tab Navigation
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            });
        });

        // Chat Logic
        const addMessage = (text, sender, isHtml = false) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', sender);
            msgDiv.innerHTML = isHtml ? text : `<p>${text}</p>`;
            aiChatMessages.appendChild(msgDiv);
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        };

        const getBotResponse = (input) => {
            const lowerInput = input.toLowerCase();
            if (lowerInput.includes('precio') || lowerInput.includes('mensualidad') || lowerInput.includes('cuanto')) {
                return "Nuestra membresía Básica es de $50/mes y la Pro Elite es de $90/mes. Ambas te dan acceso 24/7. ¡Revisa la sección de Membresías para más detalles!";
            }
            if (lowerInput.includes('horario') || lowerInput.includes('abierto')) {
                return "¡Estamos abiertos 24/7 de Lunes a Viernes! Fines de semana de 6:00 AM a 10:00 PM.";
            }
            if (lowerInput.includes('ubicacion') || lowerInput.includes('direccion') || lowerInput.includes('donde')) {
                return "Nos encontramos en la Av. 20 de Noviembre. Revisa el mapa abajo.";
            }
            if (lowerInput.includes('clase') || lowerInput.includes('crossfit') || lowerInput.includes('yoga')) {
                return "Ofrecemos clases de CrossFit, HIIT, Powerlifting, Yoga Recovery y mucho más.";
            }
            if (lowerInput.includes('hola') || lowerInput.includes('buenas')) {
                return "¡Hola! Bienvenido a Nexus AI. ¿Quieres que te genere una rutina, una dieta, o tienes dudas sobre el gimnasio?";
            }
            return "Interesante. Si quieres un plan a medida, te recomiendo usar las pestañas de 'Rutina IA' o 'Dieta IA' en este mismo panel.";
        };

        const handleSend = () => {
            const text = aiChatInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                aiChatInput.value = '';
                
                // Typing effect
                addMessage('<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>', 'bot', true);
                
                setTimeout(() => {
                    aiChatMessages.lastChild.remove(); // remove typing
                    addMessage(getBotResponse(text), 'bot');
                }, 1000);
            }
        };

        sendAIChat.addEventListener('click', handleSend);
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        // Generator Logic
        const showResult = (htmlString) => {
            aiResultContent.innerHTML = htmlString;
            aiResultOverlay.classList.add('active');
        };

        btnBackToForms.addEventListener('click', () => {
            aiResultOverlay.classList.remove('active');
        });

        // Routine Generator
        btnGenerateRoutine.addEventListener('click', () => {
            const level = document.getElementById('routineLevel').value;
            const goal = document.getElementById('routineGoal').value;
            
            btnGenerateRoutine.innerHTML = "Generando...";
            btnGenerateRoutine.style.opacity = '0.7';
            
            setTimeout(() => {
                btnGenerateRoutine.innerHTML = "GENERAR RUTINA";
                btnGenerateRoutine.style.opacity = '1';
                
                let resultText = `<h4 style="color:var(--neon-green); margin-bottom:15px;">Tu Rutina: ${level.toUpperCase()} - ${goal.toUpperCase()}</h4>`;
                resultText += `<p style="color:var(--text-secondary); margin-bottom:15px; font-size: 0.9rem;">El algoritmo de Nexus ha creado este plan basado en evidencia científica para ti.</p>`;
                
                if (goal === 'hipertrofia') {
                    resultText += `<ul>
                        <li style="margin-bottom:10px;"><strong>Lunes (Pecho/Tríceps):</strong> Press de banca 4x10, Cruces de polea 3x12, Fondos 3x12.</li>
                        <li style="margin-bottom:10px;"><strong>Miércoles (Espalda/Bíceps):</strong> Dominadas 4xFallo, Remo con barra 4x10, Curl con mancuernas 3x12.</li>
                        <li style="margin-bottom:10px;"><strong>Viernes (Pierna/Hombro):</strong> Sentadillas 4x10, Prensa 3x12, Press militar 4x10, Elevaciones laterales 3x15.</li>
                    </ul>`;
                } else if (goal === 'fuerza') {
                    resultText += `<ul>
                        <li style="margin-bottom:10px;"><strong>Lunes (Sentadilla/Pecho):</strong> Sentadilla pesada 5x5, Press Banca 5x5.</li>
                        <li style="margin-bottom:10px;"><strong>Miércoles (Peso Muerto):</strong> Peso Muerto 1x5, Remo Pendlay 3x5.</li>
                        <li style="margin-bottom:10px;"><strong>Viernes (Sentadilla Ligera):</strong> Sentadilla frontal 3x5, Press Militar 5x5.</li>
                    </ul>`;
                } else {
                    resultText += `<ul>
                        <li style="margin-bottom:10px;"><strong>Lunes (Full Body + HIIT):</strong> Circuito de pesas rusas, 20 min HIIT en cinta.</li>
                        <li style="margin-bottom:10px;"><strong>Miércoles (Fuerza y Core):</strong> Sentadilla, Remo, Planchas 4x1 min, Crunch inverso.</li>
                        <li style="margin-bottom:10px;"><strong>Viernes (Circuito Metábolico):</strong> Box Jumps, Burpees, Battle Ropes (3 rondas de 5 minutos).</li>
                    </ul>`;
                }
                showResult(resultText);
            }, 1500);
        });

        // Diet Generator
        btnGenerateDiet.addEventListener('click', () => {
            const goal = document.getElementById('dietGoal').value;
            const pref = document.getElementById('dietPref').value;
            
            btnGenerateDiet.innerHTML = "Generando...";
            btnGenerateDiet.style.opacity = '0.7';

            setTimeout(() => {
                btnGenerateDiet.innerHTML = "GENERAR DIETA";
                btnGenerateDiet.style.opacity = '1';
                
                let resultText = `<h4 style="color:var(--neon-green); margin-bottom:15px;">Plan Nutricional: ${goal.toUpperCase()} (${pref})</h4>`;
                resultText += `<p style="color:var(--text-secondary); margin-bottom:15px; font-size: 0.9rem;">Estas son recomendaciones base. Ajusta las porciones según tu peso real.</p>`;
                
                if (pref === 'vegano') {
                    resultText += `<ul>
                        <li style="margin-bottom:10px;"><strong>Desayuno:</strong> Tazón de avena con proteína vegana, leche de almendras y semillas de chía.</li>
                        <li style="margin-bottom:10px;"><strong>Almuerzo:</strong> Tazón de quinoa con tofu a la plancha, garbanzos y brócoli.</li>
                        <li style="margin-bottom:10px;"><strong>Cena:</strong> Ensalada abundante con lentejas, aguacate y aderezo de tahini.</li>
                    </ul>`;
                } else if (pref === 'keto') {
                    resultText += `<ul>
                        <li style="margin-bottom:10px;"><strong>Desayuno:</strong> Huevos revueltos con espinacas y aguacate, cocinados en mantequilla.</li>
                        <li style="margin-bottom:10px;"><strong>Almuerzo:</strong> Salmón al horno con espárragos y aceite de oliva.</li>
                        <li style="margin-bottom:10px;"><strong>Cena:</strong> Filete de res con coliflor asada y queso parmesano.</li>
                    </ul>`;
                } else {
                    resultText += `<ul>
                        <li style="margin-bottom:10px;"><strong>Desayuno:</strong> Huevos al gusto con 2 rebanadas de pan integral y fruta mixta.</li>
                        <li style="margin-bottom:10px;"><strong>Almuerzo:</strong> Pechuga de pollo a la plancha, arroz blanco y ensalada mixta.</li>
                        <li style="margin-bottom:10px;"><strong>Cena:</strong> Atún o pescado blanco, porción de papas al horno y vegetales al vapor.</li>
                    </ul>`;
                }
                
                if (goal === 'volumen') {
                    resultText += `<p style="margin-top:15px; color: #fff;">💡 <strong>Tip IA:</strong> Agrega crema de cacahuate extra y porciones dobles de arroz para subir tus calorías (Superávit del 15%).</p>`;
                } else if (goal === 'definicion') {
                    resultText += `<p style="margin-top:15px; color: #fff;">💡 <strong>Tip IA:</strong> Controla estrictamente las grasas y aceites, priorizando saciedad con vegetales fibrosos.</p>`;
                }
                
                showResult(resultText);
            }, 1500);
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

    // Advanced Form Submit (Formsubmit.co Native + LocalStorage)
    const leadForm = document.getElementById('leadForm');
    const bookingFormSection = document.getElementById('bookingFormSection');
    const ticketSuccessSection = document.getElementById('ticketSuccessSection');
    const nextUrlInput = document.getElementById('nextUrl');
    
    // Ticket Spans
    const tckName = document.getElementById('tckName');
    const tckDate = document.getElementById('tckDate');
    const tckTime = document.getElementById('tckTime');
    const tckClass = document.getElementById('tckClass');

    // Check if we are returning from a successful FormSubmit redirect
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('success') === 'true') {
        const modalOverlay = document.getElementById('leadModal');
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            
            if (bookingFormSection && ticketSuccessSection) {
                bookingFormSection.style.display = 'none';
                ticketSuccessSection.style.display = 'block';

                tckName.textContent = localStorage.getItem('tckName') || 'Invitado VIP';
                tckDate.textContent = localStorage.getItem('tckDate') || '--';
                tckTime.textContent = localStorage.getItem('tckTime') || '--';
                tckClass.textContent = localStorage.getItem('tckClass') || '--';
            }
        }
        
        // Clean the URL without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if(leadForm) {
        // Set minimum date to today
        const datePicker = document.getElementById('datePicker');
        if (datePicker) {
            const today = new Date().toISOString().split('T')[0];
            datePicker.setAttribute('min', today);
        }

        // Configure the _next URL dynamically
        if(nextUrlInput) {
            // we remove any queries/hashes and append ?success=true
            nextUrlInput.value = window.location.origin + window.location.pathname + '?success=true';
        }

        leadForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitamos la recarga para generar el ticket aquí mismo
            
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = "PROCESANDO RESERVA...";
            submitBtn.disabled = true;

            const formData = new FormData(leadForm);
            
            // Simulamos el envío (Temporalmente, por caída de FormSubmit)
            setTimeout(() => {
                const name = formData.get('name');
                const fecha = formData.get('fecha');
                const hora = formData.get('hora');
                const clase = formData.get('clase');

                tckName.textContent = name;
                tckDate.textContent = fecha;
                tckTime.textContent = hora;
                tckClass.textContent = clase;

                if (bookingFormSection && ticketSuccessSection) {
                    bookingFormSection.style.display = 'none';
                    ticketSuccessSection.style.display = 'block';
                }
                
                // NOTA: Como FormSubmit está caído (Error 521 Cloudflare),
                // No enviamos físicamente el POST remoto.
            }, 1000);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const isPassword = input.type === 'password';
            
            input.type = isPassword ? 'text' : 'password';
            this.classList.toggle('active', isPassword);
        });
    });

    // Form validation utilities
    const validators = {
        email: (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        password: (password) => {
            return {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /\d/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };
        },
        
        phone: (phone) => {
            const re = /^[\+]?[1-9][\d]{0,15}$/;
            return re.test(phone.replace(/\s/g, ''));
        },
        
        name: (name) => {
            return name.trim().length >= 2 && /^[a-zA-Z\s]*$/.test(name);
        }
    };

    // Real-time validation
    function validateField(input, validatorName, customMessage) {
        const value = input.value.trim();
        const inputGroup = input.closest('.input-group');
        const errorMessage = inputGroup.querySelector('.error-message');
        
        let isValid = true;
        let message = '';
        
        if (!value && input.required) {
            isValid = false;
            message = `${input.labels[0].textContent} is required`;
        } else if (value && validators[validatorName]) {
            if (validatorName === 'password') {
                // Special handling for password
                const checks = validators.password(value);
                const passedChecks = Object.values(checks).filter(Boolean).length;
                
                if (passedChecks < 3) {
                    isValid = false;
                    message = 'Password must contain at least 8 characters with uppercase, lowercase, and numbers';
                }
            } else if (!validators[validatorName](value)) {
                isValid = false;
                message = customMessage || `Please enter a valid ${validatorName}`;
            }
        }
        
        // Update UI
        inputGroup.classList.toggle('error', !isValid && value);
        inputGroup.classList.toggle('success', isValid && value);
        
        if (!isValid && value) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        } else {
            errorMessage.classList.remove('show');
            setTimeout(() => {
                errorMessage.textContent = '';
            }, 200);
        }
        
        return isValid || !value;
    }

    // Password strength indicator
    function updatePasswordStrength(password) {
        const strengthContainer = document.querySelector('.password-strength');
        if (!strengthContainer) return;
        
        const strengthBar = strengthContainer.querySelector('.strength-fill');
        const strengthText = strengthContainer.querySelector('.strength-text');
        
        if (!password) {
            strengthContainer.className = 'password-strength';
            strengthText.textContent = 'Password strength';
            return;
        }
        
        const checks = validators.password(password);
        const score = Object.values(checks).filter(Boolean).length;
        
        // Remove existing strength classes
        strengthContainer.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
        
        if (score <= 2) {
            strengthContainer.classList.add('strength-weak');
            strengthText.textContent = 'Weak password';
        } else if (score === 3) {
            strengthContainer.classList.add('strength-fair');
            strengthText.textContent = 'Fair password';
        } else if (score === 4) {
            strengthContainer.classList.add('strength-good');
            strengthText.textContent = 'Good password';
        } else {
            strengthContainer.classList.add('strength-strong');
            strengthText.textContent = 'Strong password';
        }
    }

    // Sign In Form
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        emailInput.addEventListener('blur', () => {
            validateField(emailInput, 'email', 'Please enter a valid email address');
        });
        
        emailInput.addEventListener('input', () => {
            if (emailInput.value) {
                setTimeout(() => validateField(emailInput, 'email', 'Please enter a valid email address'), 300);
            }
        });
        
        passwordInput.addEventListener('blur', () => {
            if (passwordInput.value && passwordInput.value.length < 6) {
                const inputGroup = passwordInput.closest('.input-group');
                const errorMessage = inputGroup.querySelector('.error-message');
                inputGroup.classList.add('error');
                errorMessage.textContent = 'Password must be at least 6 characters';
                errorMessage.classList.add('show');
            }
        });
        
        signInForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-primary');
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Validate fields
            const emailValid = validateField(emailInput, 'email', 'Please enter a valid email address');
            const passwordValid = password.length >= 6;
            
            if (!passwordValid) {
                validateField(passwordInput, null, 'Password must be at least 6 characters');
            }
            
            if (!emailValid || !passwordValid) {
                return;
            }
            
            // Simulate API call
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success - you would handle actual authentication here
                showSuccess('Sign in successful! Redirecting...');
                setTimeout(() => {
                    // Redirect to dashboard or main app
                    console.log('Redirect to dashboard');
                }, 1500);
                
            } catch (error) {
                showError('Invalid email or password. Please try again.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // Sign Up Form
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('signupEmail');
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('signupPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const termsCheckbox = document.getElementById('terms');
        
        // Real-time validation for all fields
        if (firstNameInput) {
            firstNameInput.addEventListener('blur', () => {
                validateField(firstNameInput, 'name', 'First name must be at least 2 characters and contain only letters');
            });
        }
        
        if (lastNameInput) {
            lastNameInput.addEventListener('blur', () => {
                validateField(lastNameInput, 'name', 'Last name must be at least 2 characters and contain only letters');
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                validateField(emailInput, 'email', 'Please enter a valid email address');
            });
            
            emailInput.addEventListener('input', () => {
                if (emailInput.value) {
                    setTimeout(() => validateField(emailInput, 'email', 'Please enter a valid email address'), 500);
                }
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                validateField(phoneInput, 'phone', 'Please enter a valid phone number');
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                updatePasswordStrength(passwordInput.value);
                validateField(passwordInput, 'password');
                
                // Also validate confirm password if it has a value
                if (confirmPasswordInput && confirmPasswordInput.value) {
                    validateConfirmPassword();
                }
            });
        }
        
        function validateConfirmPassword() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const inputGroup = confirmPasswordInput.closest('.input-group');
            const errorMessage = inputGroup.querySelector('.error-message');
            
            const isValid = password === confirmPassword;
            
            inputGroup.classList.toggle('error', !isValid && confirmPassword);
            inputGroup.classList.toggle('success', isValid && confirmPassword);
            
            if (!isValid && confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.classList.add('show');
            } else {
                errorMessage.classList.remove('show');
                setTimeout(() => {
                    errorMessage.textContent = '';
                }, 200);
            }
            
            return isValid || !confirmPassword;
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
            confirmPasswordInput.addEventListener('input', () => {
                if (confirmPasswordInput.value) {
                    setTimeout(validateConfirmPassword, 300);
                }
            });
        }
        
        signUpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-primary');
            
            // Validate all fields
            const firstNameValid = validateField(firstNameInput, 'name', 'First name must be at least 2 characters');
            const lastNameValid = validateField(lastNameInput, 'name', 'Last name must be at least 2 characters');
            const emailValid = validateField(emailInput, 'email', 'Please enter a valid email address');
            const phoneValid = validateField(phoneInput, 'phone', 'Please enter a valid phone number');
            const passwordValid = validateField(passwordInput, 'password');
            const confirmPasswordValid = validateConfirmPassword();
            const termsValid = termsCheckbox.checked;
            
            if (!termsValid) {
                showError('Please agree to the Terms of Service and Privacy Policy');
                return;
            }
            
            if (!firstNameValid || !lastNameValid || !emailValid || !phoneValid || !passwordValid || !confirmPasswordValid) {
                showError('Please fix the errors above');
                return;
            }
            
            // Simulate API call
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                await new Promise(resolve => setTimeout(resolve, 2500));
                
                // Success - you would handle actual registration here
                showSuccess('Account created successfully! Please check your email to verify your account.');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } catch (error) {
                showError('Registration failed. Please try again.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // Utility functions for showing messages
    function showSuccess(message) {
        showNotification(message, 'success');
    }
    
    function showError(message) {
        showNotification(message, 'error');
    }
    
    function showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 24px;
                right: 24px;
                max-width: 400px;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @media (max-width: 640px) {
                .notification {
                    top: 16px;
                    right: 16px;
                    left: 16px;
                    max-width: none;
                }
            }
        `;
        
        if (!document.querySelector('style[data-notifications]')) {
            style.setAttribute('data-notifications', '');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Google sign in simulation
    const googleBtns = document.querySelectorAll('.btn-google');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Google Sign In would be implemented here', 'success');
        });
    });

    // Smooth form transitions
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Enhanced form interactions
    const form = document.querySelector('.auth-form');
    if (form) {
        form.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                const submitBtn = this.querySelector('.btn-primary');
                if (submitBtn && !submitBtn.disabled) {
                    e.preventDefault();
                    submitBtn.click();
                }
            }
        });
    }
});
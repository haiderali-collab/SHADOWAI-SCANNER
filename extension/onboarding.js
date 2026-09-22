document.addEventListener('DOMContentLoaded', () => {
  const formSection = document.getElementById('form-section');
  const successCard = document.getElementById('success-card');
  const form = document.getElementById('onboarding-form');
  const nameInput = document.getElementById('employee-name');
  const emailInput = document.getElementById('employee-email');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');

  // Load existing identity if editing
  chrome.storage.local.get(['employeeIdentity'], (data) => {
    if (data.employeeIdentity) {
      if (data.employeeIdentity.name) {
        nameInput.value = data.employeeIdentity.name;
      }
      if (data.employeeIdentity.email) {
        emailInput.value = data.employeeIdentity.email;
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    nameError.classList.remove('visible');
    emailError.classList.remove('visible');

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();

    if (!nameVal) {
      nameError.classList.add('visible');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      emailError.classList.add('visible');
      isValid = false;
    }

    if (!isValid) return;

    const identity = {
      name: nameVal,
      email: emailVal,
      updatedAt: new Date().toISOString()
    };

    chrome.storage.local.set({ employeeIdentity: identity }, () => {
      console.log('[Shadow AI Extension] Employee identity saved:', identity);
      formSection.classList.add('hidden');
      successCard.classList.add('visible');
    });
  });
});

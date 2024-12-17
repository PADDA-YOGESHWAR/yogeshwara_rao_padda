(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if (!action) {
        thisForm.querySelector('.sent-message').innerHTML = 'The form action property is not set!';
        thisForm.querySelector('.sent-message').classList.add('d-block');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function() {
            grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
            .then(token => {
              formData.set('recaptcha-response', token);
              php_email_form_submit(thisForm, action, formData);
            });
          });
        } else {
          thisForm.querySelector('.sent-message').innerHTML = 'The reCaptcha javascript API url is not loaded!';
          thisForm.querySelector('.sent-message').classList.add('d-block');
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => response.json())
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.ok) {
        window.location.href = data.next;
      } else {
        thisForm.querySelector('.sent-message').innerHTML = 'Form submission failed.';
        thisForm.querySelector('.sent-message').classList.add('d-block');
      }
    });
  }
})();

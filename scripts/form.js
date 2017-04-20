function validEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
// get all data in form and return object
function getFormData(form) {
  var elements = form.elements; // all form elements
  var fields = Object.keys(elements).map(function (k) {
    if (elements[k].name !== undefined) {
      return elements[k].name;
      // special case for Edge's html collection
    } else if (elements[k].length > 0) {
      return elements[k].item(0).name;
    }
  }).filter(function (item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function (k) {
    data[k] = elements[k].value;
    var str = "";
    if (elements[k].type === "checkbox") {
      str = str + elements[k].checked + ", ";
      data[k] = str.slice(0, -2);
      // special case for Edge's html collection
    } else if (elements[k].length) {
      for (var i = 0; i < elements[k].length; i++) {
        if (elements[k].item(i).checked) {
          str = str + elements[k].item(i).value + ", ";
          data[k] = str.slice(0, -2);
        }
      }
    }
  });
  return data;
}

function handleFormSubmit(event) { // handles form submit without any jquery
  event.preventDefault(); // we are submitting via xhr below
  var form = this;
  var data = getFormData(form); // get the values submitted in the form
  if (!validEmail(data.email)) { // if email is not valid show error
    document.getElementById('email-invalid').parentNode.classList.add('has-error');
    document.getElementById('email').focus();
    return false;
  } else {
    form.classList.add('is-loading');
    var url = event.target.action;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        form.classList.remove('is-loading');
        form.classList.add('is-complete');
        var successMessage = document.createElement('p');
        successMessage.tabIndex = -1;
        successMessage.classList.add('form-success');
        var successMessageContent = document.createTextNode('Thanks for your enquiry, we\'ll be in touch.');
        successMessage.appendChild(successMessageContent);
        form.parentNode.insertBefore(successMessage, form);
        successMessage.focus();
        return;
      }
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
  }
}

function loaded() {
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  form.addEventListener("submit", handleFormSubmit, false);
};

document.addEventListener('DOMContentLoaded', loaded, false);
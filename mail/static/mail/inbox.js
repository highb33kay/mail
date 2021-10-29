document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('form') = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-detail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
  // Print emails
  console.log(emails);
  email.forEach(email => show_email(email, mailbox));
  // ... do something else with emails ...
 
});
  

}

function send_email(email, mailbox) {
  
  const recipient = document.querySelector('compose-recipients').value;
  const subject = document.querySelector('compose-subject').value;
  const body = document.querySelector('compose-body').value;
  
  document.querySelector('#emails-view').innerHTML = email;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
    recipients: recipients,
    subject: subject,
    body: body
    })
   })
   .then(response => response.json())
   .then(result => {
    // Print result
    console.log(result);
   });
   localStorage.clear();
   load_mailbox('sent');
   return false;
   

}

function show_email(email, mailbox){
 const emailDiv = document.createElement('div');
 emailDiv= "email";
 emailDiv.className= "row";

 const recipient = document.createElement('div');
 recipient.id = "email-recipient";
 recipient.className = "col-lg-2 col-md-2 col-sm-12";
 console.log(`Mailbox atual: ${mailbox}`);
 if (mailbox === "inbox") {
   recipient.innerHTML = email.sender;
 } else {
  recipient.innerHTML = email.recipient[0];
 }
 emailDiv.append(recipient);

 const subject = document.createElement('div');
 subject.id = "email-subject";
 subject.className = "col-lg-2 col-md-2 col-sm-12";
 subject.innerHTML = email.subject;
 emailDiv.append(subject);

 const timestamp = document.createElement('div');
 timestamp.id = "email-subject";
 timestamp.className = "col-lg-2 col-md-2 col-sm-12";
 timestamp.innerHTML = email.timestamp;
 emailDiv.append(timestamp);

 console.log(mailbox);
 if (mailbox !== "sent") {
   const button = document.createElement('img');
   button.id = "archive-icon";
   button.src = "static/mail/archive-icon.jpg"
   button.innerHTML = "Archive it";
   emailDiv.append(button);
   button.addEventListener('click', () => change_email_archive(email.id, email.archive));
   
 }

 const emailCard = document.createElement('div');
 emailCard.id ="email-card";
 if(email.read){
   emailCard.className = "read card";
 } else {
   emailCard.className = "card";
 }
 emailCard.append(emailDiv);

 recipient.addEventListener('click', () => view_email(email.id));
 subject.addEventListener('click', () => view_email(email.id));
 timestamp.addEventListener('click', () => view_email(email.id));
 document.querySelector('#emails-view').append(emailCard);

}


function view_email(email_id) {
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('email-detail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  fetch(`/emails/$(email_id)`)
  .then(response => response.json())
  .then(email => {
    mail_email_as_read(email_id);
    console.log(email);
    document.querySelector('#email-view-sende r').innerHTML = email.sender
    document.querySelector('#email-view-recipient').innerHTML = email.recipient
    document.querySelector('#email-view-subject').innerHTML = email.subject
    document.querySelector('#email-view-timestamp').innerHTML = email.timestamp
    document.querySelector('#email-view-body').innerHTML = email.body

    document.getElementById('reply-email-button').addEventListener('click', () => reply_email(email));
  });
  return false;
}

function change_email_archive(email_id, previousvalue) {
  const newValue = !previousvalue;
  console.log(`updating email as archived = ${newValue}`);
  fetch(`/emails/$(email_id)`, {
    method: "PUT",
    body: body =JSON.stringify({
      archived: newValue
    })
  })

  load_mailbox('inbox');
  window.location.reload();
  
}

function mark_email_as_read(email_id) {
  console.log(`updating email as read = true`);
  fetch(`/emails/$(email_id)`, {
    method: "PUT",
    body: body =JSON.stringify({
      read : true
    })
  })
}

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    
})(jQuery);





    // const submitBtn = document.getElementById('submit');
    // const chatBox = document.getElementById('message');
    // const responseField = document.getElementById('subject');

    // submitBtn.addEventListener('click', async () => {
    //   const userMessage = chatBox.value.trim();
    //   if (!userMessage) {
    //     responseField.value = "Please enter your message!";
    //     return;
    //   }

    //   try {
    //     responseField.value = "Thinking...";

    //     // Send message to server and await response
    //     const response = await fetch('/generate-response', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ message: userMessage }),
    //     });

    //     if (!response.ok) {
    //       throw new Error('Failed to get a response');
    //     }

    //     const data = await response.json();
    //     responseField.value = data.reply;
    //   } catch (error) {
    //     console.error(error);
    //     responseField.value = "Error occurred while generating response. Please try again!";
    //   }
    // });


    document.getElementById("submit").addEventListener("click", async () => {
        const messageInput = document.getElementById("message").value;
        const subjectTextArea = document.getElementById("subject");
        const loader = document.getElementById("loader");
        const overlay = document.getElementById("overlay");
        overlay.style.display = 'flex';
        if (messageInput.trim() === "") {
          alert("Please enter a message!");
          overlay.style.display = 'none';
          return;
        }
      
        try {
          const response = await fetch('/conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput: messageInput }),
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch assistant response");
          }
      
          const data = await response.json();
          const assistantResponse = data.assistantResponse;
          overlay.style.display = 'none';
          // Append conversation to subject textarea
          const formattedConversation = `
      <b>User:</b> ${messageInput}<br>
<b>Assistant:</b> ${assistantResponse}<br><br>
          `;
          subjectTextArea.innerHTML += formattedConversation;
      
          // Clear input field
          document.getElementById("message").value = "";
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while communicating with the assistant.");
          overlay.style.display = 'none';
        }
      });
      
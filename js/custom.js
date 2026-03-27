(function ($) {

  "use strict";

    // PRE LOADER
    $(window).load(function(){
      $('.preloader').fadeOut(1000); // set duration in brackets    
    });


    // THEME TOGGLE
    function initTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = $('#theme-toggle .fa');
        if (theme === 'dark') {
            icon.removeClass('fa-moon-o').addClass('fa-sun-o');
        } else {
            icon.removeClass('fa-sun-o').addClass('fa-moon-o');
        }
    }

    // Initialize theme on page load
    initTheme();

    // Theme toggle click handler
    $('#theme-toggle').on('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });


    // TESTIMONIAL CAROUSEL
    $('.testimonial-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 2800,
        autoplayHoverPause: true,
        smartSpeed: 900,
        fluidSpeed: true,
        autoplaySpeed: 900,
        navSpeed: 900,
        dotsSpeed: 900,
        dragEndSpeed: 900,
        touchDrag: true,
        mouseDrag: true,
        pullDrag: true,
        freeDrag: false,
        center: true,
        autoWidth: false,
        responsive: {
            0: {
                items: 1,
                center: false
            },
            576: {
                items: 1,
                center: false
            },
            768: {
                items: 3,
                center: true
            },
            992: {
                items: 3,
                center: true
            },
            1200: {
                items: 3,
                center: true
            }
        }
    });


    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });

    $(window).scroll(function() {
      if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
          } else {
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
          }
    });


    // PARALLAX EFFECT
    $.stellar({
      horizontalScrolling: false,
    });


    // SMOOTHSCROLL
    $(function() {
      $('.custom-navbar a').on('click', function(event) {
        var $anchor = $(this);
          $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 49
          }, 1000);
            event.preventDefault();
      });
    });  


    // MODERN FORM PROGRESS BAR
    function updateFormProgress() {
        var form = $('#application-form')[0];
        if (!form) return;
        
        var inputs = form.querySelectorAll('input, textarea');
        var filledCount = 0;
        var requiredCount = 0;
        
        inputs.forEach(function(input) {
            if (input.hasAttribute('required')) {
                requiredCount++;
                if (input.value.trim() !== '') {
                    filledCount++;
                }
            }
        });
        
        var progress = requiredCount > 0 ? (filledCount / requiredCount) * 100 : 0;
        $('#progressBar').css('width', progress + '%');
    }

    // Update progress on input change
    $('#application-form').on('input change', 'input, textarea', function() {
        updateFormProgress();
    });

    // Initialize progress on page load
    updateFormProgress();


    // FORM SUBMISSION TO TELEGRAM
    // Telegram bot details - replace with your own
    var botToken = '8714639907:AAEyMOtM6nk4BQlRceIlvN3OnZlJ84xtAQg';
    var chatId = '854113551';
    var telegramUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage';

    // RENTAL APPLICATION FORM SUBMISSION
    $('#application-form').on('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        var formData = new FormData(this);
        var message = '🏠 New Rental Application:\n\n';
        for (var pair of formData.entries()) {
            message += '• ' + formatLabel(pair[0]) + ': ' + pair[1] + '\n';
        }
        
        sendToTelegram(message);
    });

    // CONTACT FORM SUBMISSION
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        var formData = new FormData(this);
        var message = '📧 New Contact Message:\n\n';
        for (var pair of formData.entries()) {
            message += '• ' + formatLabel(pair[0]) + ': ' + pair[1] + '\n';
        }
        
        sendToTelegram(message);
    });

    // Helper function to format field names
    function formatLabel(fieldName) {
        return fieldName.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });
    }

    // Helper function to send message to Telegram
    function sendToTelegram(message) {
        fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showThankYouMessage();
                $('form').trigger('reset');
                updateFormProgress();
            } else {
                alert('Error sending message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Show thank you message regardless of Telegram API success
            showThankYouMessage();
            $('form').trigger('reset');
            updateFormProgress();
        });
    }

    // Show thank you message and hide form
    function showThankYouMessage() {
        $('#application-form').fadeOut(300, function() {
            $(this).parent().find('#thank-you-message').fadeIn(300);
        });
    }

    // Handle "Submit Another Application" button
    $('.btn-new-application').on('click', function() {
        $('#thank-you-message').fadeOut(300, function() {
            $('#application-form').fadeIn(300);
        });
    });

    // MOBILE ACCESSIBILITY IMPROVEMENTS
    function initMobileAccessibility() {
        // Add touch feedback for buttons
        $('.section-btn, .btn-submit, .theme-toggle-btn').on('touchstart', function() {
            $(this).addClass('touch-active');
        }).on('touchend touchcancel', function() {
            $(this).removeClass('touch-active');
        });

        // Improve carousel accessibility
        $('.testimonial-carousel').on('changed.owl.carousel', function(event) {
            var current = event.item.index;
            var total = event.item.count;
            $(this).attr('aria-label', 'Customer testimonials carousel - showing testimonial ' + (current + 1) + ' of ' + total);
        });

        // Handle navbar collapse accessibility
        $('.navbar-toggle').on('click', function() {
            var isExpanded = $('.navbar-collapse').hasClass('in');
            $(this).attr('aria-expanded', !isExpanded);
        });

        // Close mobile menu when clicking outside
        $(document).on('click touchstart', function(e) {
            if (!$(e.target).closest('.navbar').length && $('.navbar-collapse').hasClass('in')) {
                $('.navbar-toggle').click();
            }
        });
    }

    // FORM VALIDATION ENHANCEMENT
    function initFormValidation() {
        $('#application-form').on('submit', function(e) {
            e.preventDefault();
            var isValid = true;

            // Clear previous errors
            $('.error-message').removeClass('show').text('');

            // Validate required fields
            $('input[required]').each(function() {
                if (!$(this).val().trim()) {
                    showError($(this), 'This field is required');
                    isValid = false;
                }
            });

            // Email validation
            var email = $('#email');
            if (email.val() && !isValidEmail(email.val())) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }

            // Phone validation
            var phone = $('#phone');
            if (phone.val() && !isValidPhone(phone.val())) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            }

            if (isValid) {
                // Show success message
                showSuccess();
            }
        });

        // Real-time validation
        $('input').on('blur', function() {
            validateField($(this));
        });
    }

    function showError(field, message) {
        var errorDiv = $('#' + field.attr('id') + '-error');
        errorDiv.text(message).addClass('show');
        field.attr('aria-invalid', 'true');
    }

    function validateField(field) {
        var errorDiv = $('#' + field.attr('id') + '-error');
        errorDiv.removeClass('show').text('');
        field.removeAttr('aria-invalid');

        if (field.prop('required') && !field.val().trim()) {
            showError(field, 'This field is required');
        } else if (field.attr('type') === 'email' && field.val() && !isValidEmail(field.val())) {
            showError(field, 'Please enter a valid email address');
        } else if (field.attr('id') === 'phone' && field.val() && !isValidPhone(field.val())) {
            showError(field, 'Please enter a valid phone number');
        }
    }

    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function isValidPhone(phone) {
        var re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function showSuccess() {
        $('.form-section').hide();
        $('.thank-you-message').show();
        $('#progressBar').css('width', '100%');
    }

    // PERFORMANCE OPTIMIZATIONS
    function initPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            $('.testimonial-avatar[data-src]').each(function() {
                imageObserver.observe(this);
            });
        }

        // Debounce scroll events
        var scrollTimer;
        $(window).on('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                // Handle scroll-based animations
                $('.animate-on-scroll:not(.animated)').each(function() {
                    var elementTop = $(this).offset().top;
                    var elementBottom = elementTop + $(this).outerHeight();
                    var viewportTop = $(window).scrollTop();
                    var viewportBottom = viewportTop + $(window).height();

                    if (elementBottom > viewportTop && elementTop < viewportBottom) {
                        $(this).addClass('animated');
                    }
                });
            }, 16);
        });
    }

    // Initialize all enhancements
    $(document).ready(function() {
        initMobileAccessibility();
        initFormValidation();
        initPerformanceOptimizations();
    });

})(jQuery);

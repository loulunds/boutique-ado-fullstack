// get id, slice "" marks
var stripePublicKey = $('#id_stripe_public_key').text().slice(1, -1); 
var clientSecret = $('#id_client_secret').text().slice(1, -1);
var stripe = Stripe(stripePublicKey);
var elements = stripe.elements();
var style = {
    base: {
        color: '#000',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#dc3545',
        iconColor: '#dc3545'
    }
};

var card = elements.create('card', {style: style});
card.mount('#card-element');

// Handle realtime validation errors on the card element
// add listener for change event, for every change, check for errors
// error message produced by stripe
card.addEventListener('change', function (event) {
    var errorDiv = document.getElementById('card-errors');
    if (event.error) {
        var html = `
            <span class="icon" role="alert">
                <i class="fas fa-times"></i>
            </span>
            <span>${event.error.message}</span>
        `;
        $(errorDiv).html(html);
    } else {
        errorDiv.textContent = '';
    }
});
// ^^^^^^^^^^^^^^
// stripe has payment intents
// 1. when user hits checkout, checkout view will call stripe to create payment intent
// 2. when stripe creates it, a secret identifies it
// secret will be returned to us and we'll send it to the template as client secret variable
// 3. on js client side, we call confirm card payment method from stripe.js...
// using client secret w/c verifies the card number

// handle form submit
var form = document.getElementById("payment-form");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    card.update({'disabled':true});
    $('#submit-button').attr('disabled', true);
    // trigger overlay and fadeout form on submit
    $('#payment-form').fadeToggle(100);
    $('#loading-overlay').fadeToggle(100);
    // Complete payment when the submit button is clicked

    var saveInfo = Boolean($('#id-save-info').attr('checked'));
    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
    var postData = {
        'csrfmiddlewaretoken': csrfToken,
        'client_secret': clientSecret,
        'save_info': saveInfo,
    };
    var url = '/checkout/cache_checkout_data/';

    $.post(url, postData).done(function() {
        stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: $.trim(form.full_name.value),
                    phone: $.trim(form.phone_number.value),
                    email: $.trim(form.email.value),
                    address:{
                        line1: $.trim(form.street_address1.value),
                        line2: $.trim(form.street_address2.value),
                        city: $.trim(form.town_or_city.value),
                        country: $.trim(form.country.value),
                        state: $.trim(form.county.value),
                    }
                }
            },
            shipping: {
                name: $.trim(form.full_name.value),
                phone: $.trim(form.phone_number.value),
                address: {
                    line1: $.trim(form.street_address1.value),
                    line2: $.trim(form.street_address2.value),
                    city: $.trim(form.town_or_city.value),
                    country: $.trim(form.country.value),
                    postal_code: $.trim(form.postcode.value),
                    state: $.trim(form.county.value),
                }
            },
    })
    // then execute this function
        .then(function(result) {
            if (result.error) {
                var errorDiv = document.getElementById('card-errors');
                var html = `
                    <span class="icon" role="alert">
                    <i class="fas fa-times"></i>
                    </span>
                    <span>${result.error.message}</span>`;
                $(errorDiv).html(html);
                $('#payment-form').fadeToggle(100);
                $('#loading-overlay').fadeToggle(100);
                card.update({'disabled':false});
                $('#submit-button').attr('disabled', false);
            } else {
            // The payment succeeded!
                if (result.paymentIntent.status === 'succeeded'){
                    form.submit();
                }
            }    
        });
    }).fail(function () {
        // just reload the page, the error will be in django messages
        location.reload(); 
    })
});



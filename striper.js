  var initStriper = function(){
    jQuery(function($) {
    var $form = $('form.checkout,form#order_review');
        
    var deferred = $.Deferred();
    deferred.fail(function(){
    
    });

    $('body').on('click', 'form#order_review input:submit', function(){
      // Make sure there's not an old token on the form
      $('form#order_review').find('[name=stripeToken]').remove()
      Stripe.setPublishableKey($('#stripe_pub_key').data('publishablekey'));
      Stripe.createToken($form, stripeResponseHandler);
      return false;
    });

    var delayForToken = function($form){
        Stripe.card.createToken($form, stripeResponseHandler);
        return deferred.promise();
    }
    var stripeResponseHandler = function(status, response) {
    $('form.checkout').find('[name=stripeToken]').remove()

    if (response.error) {

      // Show the errors on the form
      $form.find('.payment-errors').css({'color': 'red'}).text(response.error.message);
      // Unblock the form to re-enter data
      $form.unblock();

      deferred.fail();
    } else {
      // Append the Token
      $form.append($('<input type="hidden" name="stripeToken" />').val(response.id));

      deferred.resolve();
    }
  };

    // Bind to the checkout_submit event to add the token
    $('body').on('click', 'form.checkout input:submit', function(e){

      $form = $('form.checkout');
      window.striper = true;
      if($('input[name=payment_method]:checked').val() != 'Striper'){
         $form.submit();
      }

      $form.find('.payment-errors').html('');

      // Pass if we have a token
      if( $form.find('[name=stripeToken]').length)
      {
        $form.submit();
        return true;
      }
      e.preventDefault();

      Stripe.setPublishableKey($('#stripe_pub_key').data('publishablekey'));
      return $.when(delayForToken($form)).then($.proxy(function(){
       $form.submit();
        return true;
      },this), $.proxy(function(){
        return false;
      },this));
    });
  });
};

if(typeof jQuery=='undefined')
{
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';
    jqTag.onload = initStriper;
    headTag.appendChild(jqTag);
} else {
   initStriper()
}


  var initStriper = function(){
    jQuery(function($) {
      var $form = $('form.checkout,form#order_review');
          
      var deferred = $.Deferred();

      var delayForToken = function($form){
          Stripe.card.createToken($form, stripeResponseHandler);
          return deferred.promise();
      }
      var stripeResponseHandler = function(status, response) {
      $('form.checkout').find('[name=stripeToken]').remove()

      if (response.error) {

        // Show the errors on the form
        $form.find('.payment-errors').css({'color': 'red'}).text(response.error.message);

        deferred.fail();
      } else {
        // Append the Token
        $form.append($('<input type="hidden" name="stripeToken" />').val(response.id));

        deferred.resolve();
      }
    };
    $('body').on('click', 'form.checkout input#place_order', function(e){

      var button = $(e.currentTarget);
      $form = $('form.checkout');
      if($('input[name=payment_method]:checked').val() != 'Striper'){
          return true;
      }

      $form.find('.payment-errors').html('');

      // Pass if we have a token
      if( $form.find('[name=stripeToken]').length)
      {
        return true;
      }
      e.preventDefault();

      Stripe.setPublishableKey($('#stripe_pub_key').data('publishablekey'));
      return delayForToken($form).then(function(){
        button.click();
        return false;
      }, function(){
        return false;
      });
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


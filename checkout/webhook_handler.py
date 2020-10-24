from django.http import HttpResponse

#  this is a custom class


class StripeWH_Handler:
    """Handle Stripe webhooks"""

    # setup method everytime instance of class is created
    def __init__(self, request):
        # access request
        self.request = request

    def handle_event(self, event):
        """
        Handle a generic/unknown/unexpected webhook event
        """
        #  this will take the event stripe is sending us
        # will return httpresponse when received
        return HttpResponse(
            content=f'Unhandled webhook received: {event["type"]}',
            status=200)

    def handle_payment_intent_succeeded(self, event):
        """
        Handle the payment_intent.succeeded webhook from Stripe
        """
        intent = event.data.object
        print(intent)
        #  this will take the event stripe is sending us
        # will return httpresponse when received
        return HttpResponse(
            content=f'Webhook received: {event["type"]}',
            status=200)

    def handle_payment_intent_payment_failed(self, event):
        """
        Handle the payment_intent.failed webhook from Stripe
        """
        #  this will take the event stripe is sending us
        # will return httpresponse when received
        return HttpResponse(
            content=f'Webhook received: {event["type"]}',
            status=200)

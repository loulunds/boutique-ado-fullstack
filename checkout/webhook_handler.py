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
            content=f'Webhook received: {event["type"]}',
            status=200)

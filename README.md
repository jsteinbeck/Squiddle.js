# Squiddle.js #

Squiddle.js is a simple [Data Bus](http://c2.com/cgi/wiki?DataBusPattern "Data Bus Pattern in the c2 wiki") implementation in Javascript.
It can be used to build event-driven Javascript applications.

## Documentation ##

### [Constructor] Squiddle( [Object] args+ ) ###

Creates a new Squiddle object. Takes a configuration object as
its argument.

The config object can have the following properties:

 * [Boolean] debug: Log errors in listeners to the (web) console?
 * [Boolean] interceptErrors: Should errors encountered in listeners be intercepted? Note: They can still be logged when the debug property is set to true.
 * [Boolean] log: Show information about triggered events in the (web) console?


### [Function] Squiddle.prototype.subscribe( [Function] listener, [String] event+ ) ###

Subscribes a listener to an event. The event parameter is an optional event name. 
If no event name is supplied, "*" is assumed which means "listen for all events".

Event names can be namespaced by separating each part by a dot. Example:

    sq = new Squiddle();
    sq.subscribe( function() { console.log( "My function called." ); }, "squiddle.subscribe" );

This function will be called whenever the event "squiddle.subscribe" gets triggered.

    sq = new Squiddle();
    sq.subscribe( function() { console.log( "My function called." ); }, "squiddle" );

This function, on the other hand, will be called whenever a "squiddle" event gets triggered - or any event under
the "squiddle" namespace, e.g. "squiddle.error" or "squiddle.subscribe".


### [Function] Squiddle.prototype.unsubscribe( [Function] listener, [String] event+ ) ###

The counterpart to subscribe: Unsubscribes a listener from an event.


### [Function] Squiddle.prototype.trigger( [String] event+, [Mixed] data+, [Boolean] async+ ) ###

Triggers an event so that all interested listeners get called and optionally receive 
the data supplied by the second parameter. 

If the first parameter (the event name) is ommited, "*" is assumed. 

Note: "*" will not call __all__ listeners known to Squiddle but rather only the listeners 
explicitly subscribed to the wildcard event.

Parameter data can be anything you want the listeners to receive.

If the third parameter is supplied and is false then the listeners will be called in
synchronous fashion. If the third parameter is true the listeners will be 
called asynchronously. Default: true.


### [Function] listener( [Mixed] data+, [Object] info+ ) ###

This is the signature for a listener. When listeners are called by Squiddle
they get the data provided by the the one who triggered the event as the first
parameter. If no data has been sent along with the event then Squiddle will input null.

The second parameter contains information about the event and the queued listeners.
It has the following properties:

 * [String] event: The name of the triggered event. This will be exactly the name
   used for triggering the event, not only the part relevant to the listener.

 * [Number] subscribers: The total number of listeners subscribed to the triggered event.

 * [Function] getQueueLength(): Returns the number of listeners for the triggered event
   that haven't been called yet. Listeners can use this information, together with the
   total subscriber count, to determine whether they should perform there task now or
   wait until the queue has been further shortened or emptied.
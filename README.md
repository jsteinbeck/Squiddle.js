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


## License Agreement ##

License: BSD 3-Clause License.

    Copyright (c) 2012 Jonathan Steinbeck
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    * Neither the name Squiddle.js nor the names of its contributors 
      may be used to endorse or promote products derived from this software 
      without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
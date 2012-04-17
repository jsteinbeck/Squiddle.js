var console = console || { log: function() {} };

/**

    [Constructor] Squiddle
    ======================
    
        A DataBus or Publish/Subscribe implementation. 
        
        Anyone having access to a Squiddle can use it to trigger an event
        so that objects subscribed to the event will be notified and
        receive the data sent along with it.
        

*/
Squiddle = function(args)
{
    args = args || {};
    
    if (!(this instanceof Squiddle))
    {
        return new Squiddle(args);
    }
    
    this.debug = args.debug || false;
    this.interceptErrors = args.interceptErrors || false;
    this.log = args.log || false;
    
    this.callbacks = {
        "*": []
    };
    
    var self = this, errorListener;
    
    errorListener = function(data, info)
    {
        if (self.debug !== true)
        {
            return;
        }
        var name = data.error.name || "Error";
        console.log(
            name + " in listener; Event: " + data.info.event + 
            "; Message: " + data.error.message
        );
    }
    
    this.subscribe(errorListener, "squiddle.error");
};

/**

    [Function] Squiddle.subscribe
    =============================

        Connects a listener and lets it listen for the occurence of a event.
    
    
    Parameters
    ----------
    
        * listener:
        
            [Function] A callback function that gets executed when the event
            specified by the second parameter is send on the bus.
        
        * event:
        
            [String] A string that identifies the event.
            
            Default: "*", which means that the listener listens for all events. 
            

*/
Squiddle.prototype.subscribe = function(listener, event)
{
    event = event || '*';
    this.callbacks[event] = this.callbacks[event] || [];
    this.callbacks[event].push(listener);
    this.trigger(
        "squiddle.subscribe", 
        {
            listener: listener,
            event: event,
            bus: this
        }
    );
};

/**

    [Function] Squiddle.unsubscribe
    ===============================
    
        Removes the listener from the list of listeners to be
        notified when the event is sent on the bus.
    
    
    Parameters
    ----------
    
        * listener:
        
            [Function] A callback function that listens for the event.
            
        * event
        
            [String] The event from which the listener shall be removed.

*/
Squiddle.prototype.unsubscribe = function(listener, event)
{
    event = event || '*';
    var cbs = this.callbacks[event] || [],
    len = cbs.length,
    i;
    for (i = 0; i < len; ++i)
    {
        if (cbs[i] == listener)
        {
            this.callbacks[event].splice(i,1)
        }
    }
    this.trigger(
        "squiddle.unsubscribe", 
        {
            listener: listener,
            event: event,
            bus: this
        }
    );
};

/**

    [Function] Squiddle.trigger
    ===========================
    
        Notifies all subscribers that an event occured.
        
    
    Parameters
    ----------
    
        * event:
        
            [String] The name of the event that occured.
        
        * data
        
            [Mixed] (optional) Data to be sent to all listeners for the event.
            

*/
Squiddle.prototype.trigger = function(event, data, async)
{
    data = data || null;
    async = async || true;
    async = (async === false) ? false : true;
    
    var cbs, len, info, j, f,
        self = this;
        
    // get subscribers in all relevant namespaces
    cbs = (
        function()
        {
            var n, words, wc, matches, k, kc
                old = "",
                out = [];
            // split event name into namespaces and get all subscribers
            words = event.split(".");
            for (n = 0, wc = words.length; n < wc; ++n)
            {
                old = old + (n > 0 ? "." : "") + words[n];
                matches = self.callbacks[old] || [];
                for (k = 0, kc = matches.length; k < kc; ++k)
                {
                    out.push(matches[k]);
                }
            }
            if (event === "*")
            {
                return out;
            }
            // get subscribers for "*" and add them, too
            matches = self.callbacks["*"] || [];
            for (k = 0, kc = matches.length; k < kc; ++k)
            {
                out.push(matches[k]);
            }
            return out;
        }
    )();
    
    len = cbs.length;
    
    info = {
        event: event,
        subscribers: len,
        getQueueLength: function () 
        { 
            return len - j;
        }
    };
    
    // function for iterating through the list of relevant listeners
    f = function()
    {
        if (self.log === true)
        {
            console.log("Squiddle event triggered: " + event + 
                "; Subscribers: " + len + 
                "; Data: ", data);
        }
        for (j = 0; j < len; ++j)
        {
            cur = cbs[j];
            try
            {
                cur(data, info);
            }
            catch (e)
            {
                self.trigger(
                    "squiddle.error", 
                    { error: e, info: info }
                );
                if (self.interceptErrors !== true)
                {
                    setTimeout(function() { throw e; }, 0);
                }
            }
        }
    }
    
    if (async === true)
    {
        setTimeout(f, 0);
    }
    else
    {
        f();
    }
};
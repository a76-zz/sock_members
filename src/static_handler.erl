-module(static_handler).

-export([init/3, 
		 handle/2, 
		 terminate/3]).


init({_Any, http}, Req, [FileName]) ->
    {ok, Req, [FileName]}.

handle(Req, State) ->
    [FileName] = State,
    
    {ok, Data} = file:read_file(string:concat("./priv/", FileName)),
    {ok, Req1} = cowboy_req:reply(200, [{<<"Content-Type">>, "text/html"}],
                                       Data, Req),
    {ok, Req1, State}.

terminate(_Reason, _Req, _State) ->
    ok.
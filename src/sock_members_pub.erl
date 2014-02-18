-module(sock_members_pub).

-behaviour(gen_server).

-export([start_link/0, register/1, unregister/1]).

-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-define(SERVER, ?MODULE).

start_link() ->
	gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

register(Conn) ->
	gen_server:call(?SERVER, {register, Conn}).

unregister(Conn) ->
	gen_server:call(?SERVER, {unregister, Conn}).

init([]) ->
	ets:new(sock_connections, [set, named_table]),
	{ok, []}.

terminate(_Reason, _State) ->
	ok.

handle_call(Msg, _From, State) ->
    case Msg of 
    	{register, Conn} ->
    		ets:insert(sock_connections, Conn);
    	{unregister, Conn} ->
    		ets:delete(sock_connections, Conn)
    end,
    {reply, ok, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.


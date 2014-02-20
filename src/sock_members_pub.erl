-module(sock_members_pub).

-behaviour(gen_server).

-export([start_link/0, register/1, unregister/1, broadcast/1]).

-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-define(SERVER, ?MODULE).

start_link() ->
	gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

register(Conn) ->
	gen_server:call(?SERVER, {register, Conn}).

unregister(Conn) ->
    case erlang:whereis(?SERVER) of
        undefined -> ok;
        _Pid -> gen_server:call(?SERVER, {unregister, Conn})
    end.

broadcast(Data) ->
    gen_server:call(?SERVER, {broadcast, Data}).

init([]) ->
	ets:new(sock_connections, [set, named_table]),
	{ok, []}.

terminate(_Reason, _State) ->
	ok.

handle_call(Msg, _From, State) ->
    case Msg of 
    	{register, Conn} ->
            {sockjs_session, {Pid, _}} = Conn,
    		ets:insert(sock_connections, {Pid, Conn});
    	{unregister, Conn} ->
            {sockjs_session, {Pid, _}} = Conn,
    		ets:delete(sock_connections, Pid);
        {broadcast, Data} ->
            ets:foldl(fun ({_Pid, Conn}, Acc) -> Conn:send(Data), Acc end, [], sock_connections)
    end,
    {reply, ok, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.


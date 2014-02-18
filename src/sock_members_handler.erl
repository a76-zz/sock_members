-module(sock_members_handler).

-behaviour(gen_server).

-export([start_link/0]).

-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).start_link() ->
	gen_server:start_link(?MODULE, [], []).

-define(SERVER, ?MODULE).

start_link() ->
	gen_server:start_link({local, ?SERVER},?MODULE, [], []).

init([]) ->
	SockjsState = sockjs_handler:init_state(
        <<"/members">>, fun service_members/3, [], []),
    VhostRoutes = [
    	{<<"/members/[...]">>, sockjs_cowboy_handler, SockjsState},
        {'_', static_handler, []}
    ],
    Routes = [{'_',  VhostRoutes}], % any vhost
    Dispatch = cowboy_router:compile(Routes),
    
    Port = 8081,
    cowboy:start_http(cowboy_members_http_listener, 100, 
        [{port, Port}],
        [{env, [{dispatch, Dispatch}]}]
    ),
    {ok, []}.

terminate(_Reason, _State) ->
	cowboy:stop_listener(cowboy_members_http_listener).

service_members(_Conn, init, State) -> {ok, State};
service_members(Conn, {recv, Request}, State) ->
	Response = amqp_rpc_client:call(Client, Request),
	Conn:send(Response);

service_members(_Conn, {info, _Info}, State) -> {ok, State};
service_members(_Conn, closed, State) -> {ok, State}.

handle_call(_Msg, _From, State) ->
    {noreply, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.



-module(sock_members_server).

-behaviour(gen_server).

-export([start_link/0]).

-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-record(state, {amqp_client, amqp_connection}).

-include_lib("deps/amqp_client/include/amqp_client.hrl").

start_link() ->
	gen_server:start_link(?MODULE, [], []).

init([]) ->
    {ok, Connection} = amqp_connection:start(#amqp_params_network{host = "localhost"}),
    Client = amqp_rpc_client:start(Connection, <<"rpc">>),
    State = #state{amqp_client = Client, amqp_connection = Connection},
    SockjsState = sockjs_handler:init_state(
                    <<"/members">>, fun service_members/3, State, []),
    VhostRoutes = [{<<"/members/[...]">>, sockjs_cowboy_handler, SockjsState},
                   {'_', static_handler, []}],
    
    Routes = [{'_',  VhostRoutes}], % any vhost
    Dispatch = cowboy_router:compile(Routes),
    
    Port = 8081,
    
    io:format(" [*] Running at http://localhost:~p~n", [Port]),
    cowboy:start_http(cowboy_members_http_listener, 100, 
                      [{port, Port}],
                      [{env, [{dispatch, Dispatch}]}]),
    {ok, State}.

terminate(_Reason, _State) ->
    ok.

handle_call(_Msg, _From, State) ->
    {noreply, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

service_members(_Conn, init, State) -> {ok, State};
service_members(Conn, {recv, Request}, #state{amqp_client = Client}) ->
	Response = amqp_rpc_client:call(Client, Request),
	Conn:send(Response);

service_members(_Conn, {info, _Info}, State) -> {ok, State};
service_members(_Conn, closed, State) -> {ok, State}.







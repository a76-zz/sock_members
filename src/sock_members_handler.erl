-module(sock_members_handler).

-behaviour(gen_server).

-export([start_link/0]).

-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
	 terminate/2, code_change/3]).

-define(SERVER, ?MODULE).

start_link() ->
	gen_server:start_link({local, ?SERVER},?MODULE, [], []).

init([]) ->
	SockjsState = sockjs_handler:init_state(
        <<"/members">>, fun service_members/3, [], []),
    VhostRoutes = [
    	{<<"/members/[...]">>, sockjs_cowboy_handler, SockjsState},
        
        {"/js/[...]", cowboy_static,
             [{directory, {priv_dir, sock_members, [<<"js">>]}},
              {mimetypes, [
                  {<<".js">>, [<<"application/javascript">>]}
               ]}]},
        {"/css/[...]", cowboy_static,
             [{directory, {priv_dir, sock_members, [<<"css">>]}},
              {mimetypes, [
                  {<<".css">>, [<<"text/css">>]}
               ]}]},
        {"/", static_handler, ["members.html"]}
    ],
    Routes = [{'_',  VhostRoutes}], % any vhost
    Dispatch = cowboy_router:compile(Routes),
    
    Port = 8081,
    cowboy:start_http(cowboy_members_http_listener, 100, 
        [{port, Port}],
        [{env, [{dispatch, Dispatch}]}]
    ),
    error_logger:info_msg(" [*] Running at http://localhost:~p~n", [Port]), 
    {ok, []}.

terminate(_Reason, _State) ->
	cowboy:stop_listener(cowboy_members_http_listener).

service_members(Conn, init, State) -> 
    error_logger:info_msg("init: ~p~n", [Conn]),
    sock_members_pub:register(Conn), 
    {ok, State};

service_members(Conn, {recv, Request}, State) ->
    error_logger:info_msg("request: ~p~n", [Request]),
    [{<<"uuid">>, Id}, {<<"data">>, Query}] = jsx:decode(Request), 
	Response = sock_members_search:search(Query), 
    error_logger:info_msg("search response: ~p~n", [Response]), 
    case Response of 
        {ok, {search_results, Data, MaxScore, NumFound}} -> 
            {_, Members} = lists:unzip(Data),
            Conn:send(jsx:encode([{<<"action">>, <<"rpc">>}, {<<"uuid">>, Id}, {<<"data">>, Members}]));
        _ ->
            error_logger:error_msg("unexpected search response: ~p~n", [Response])
    end; 

service_members(Conn, {info, _Info}, State) -> 
    error_logger:info_msg("info: ~p~n", [Conn]), 
    {ok, State};


service_members(Conn, closed, State) -> 
    %error_logger:info_msg("close: ~p~n", [Conn]),
    sock_members_pub:unregister(Conn), 
    {ok, State}.

handle_call(_Msg, _From, State) ->
    {noreply, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.



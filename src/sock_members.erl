-module(sock_members).

-export([start/0]).

start() ->
    ok = application:start(xmerl),
    ok = application:start(sockjs),
    ok = application:start(ranch),
    ok = application:start(crypto),
    ok = application:start(cowboy),
    ok = application:start(sock_members).
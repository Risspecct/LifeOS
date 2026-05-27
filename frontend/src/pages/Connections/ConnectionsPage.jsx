import { useEffect, useMemo, useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardTopBar from "../../components/dashboard/DashboardTopBar";
import MobileBottomNav from "../../components/navigation/MobileBottomNav";
import ConnectionsTabs from "../../components/connections/ConnectionsTabs";
import RequestTabs from "../../components/connections/RequestTabs";
import SearchBar from "../../components/connections/SearchBar";
import FriendCard from "../../components/connections/FriendCard";
import FriendRequestCard from "../../components/connections/FriendRequestCard";
import DiscoverUserCard from "../../components/connections/DiscoverUserCard";
import EmptyConnectionsState from "../../components/connections/EmptyConnectionsState";
import ConnectionsSkeleton from "../../components/connections/ConnectionsSkeleton";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../hooks/useSidebar";
import { getApiErrorMessage } from "../../utils/errorUtils";
import {
  acceptFriendRequest,
  getDiscoverUsers,
  getFriends,
  getIncomingRequests,
  getOutgoingRequests,
  rejectFriendRequest,
  removeFriend,
  searchDiscoverUsers,
  sendFriendRequest
} from "../../services/connectionsApi";

const ConnectionsPage = () => {
  const isCollapsed = useSidebar();
  const { clearAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("friends");
  const [activeRequestTab, setActiveRequestTab] = useState("incoming");
  const [search, setSearch] = useState("");

  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [profilesById, setProfilesById] = useState({});

  const [loadingSection, setLoadingSection] = useState(false);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [sendingStates, setSendingStates] = useState({});

  const loadFriends = async () => {
    const data = await getFriends();
    setFriends(Array.isArray(data) ? data : []);
  };

  const loadRequests = async () => {
    const [incoming, outgoing] = await Promise.all([getIncomingRequests(), getOutgoingRequests()]);
    setIncomingRequests(Array.isArray(incoming) ? incoming : []);
    setOutgoingRequests(Array.isArray(outgoing) ? outgoing : []);
  };

  const loadDiscover = async () => {
    const discover = await getDiscoverUsers();
    setDiscoverUsers(Array.isArray(discover) ? discover : []);
  };

  useEffect(() => {
    const loadDirectory = async () => {
      try {
        const discover = await getDiscoverUsers();
        const map = (Array.isArray(discover) ? discover : []).reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        setProfilesById(map);
        setDiscoverUsers(Array.isArray(discover) ? discover : []);
      } catch {
        setProfilesById({});
      }
    };
    loadDirectory();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoadingSection(true);
      setError("");
      try {
        if (activeTab === "friends") await loadFriends();
        if (activeTab === "requests") await loadRequests();
        if (activeTab === "discover") await loadDiscover();
      } catch (err) {
        if (isMounted) setError(getApiErrorMessage(err, "Unable to load connections."));
      } finally {
        if (isMounted) setLoadingSection(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (activeTab !== "discover") return;
      setLoadingSection(true);
      setError("");
      try {
        const data = search.trim() ? await searchDiscoverUsers(search.trim()) : await getDiscoverUsers();
        setDiscoverUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to search users."));
      } finally {
        setLoadingSection(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search, activeTab]);

  const blockedUserIds = useMemo(() => {
    const friendIds = friends.map((friend) => Number(friend.id));
    const pendingOutgoingIds = outgoingRequests.map((request) => Number(request.receiverId));
    return new Set([...friendIds, ...pendingOutgoingIds]);
  }, [friends, outgoingRequests]);

  const discoverVisibleUsers = useMemo(
    () => discoverUsers.filter((user) => !blockedUserIds.has(Number(user.id))),
    [discoverUsers, blockedUserIds]
  );

  const handleRemoveFriend = async (friendId) => {
    setRemovingId(friendId);
    setError("");
    try {
      await removeFriend(friendId);
      setFriends((prev) => prev.filter((friend) => Number(friend.id) !== Number(friendId)));
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to remove friend."));
    } finally {
      setRemovingId(null);
    }
  };

  const handleAccept = async (requestId) => {
    setProcessingRequestId(requestId);
    setError("");
    try {
      await acceptFriendRequest(requestId);
      const accepted = incomingRequests.find((request) => Number(request.requestId) === Number(requestId));
      setIncomingRequests((prev) => prev.filter((request) => Number(request.requestId) !== Number(requestId)));
      if (accepted) {
        setFriends((prev) => [...prev, { id: accepted.senderId, username: accepted.senderUsername, college: "" }]);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to accept request."));
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingRequestId(requestId);
    setError("");
    try {
      await rejectFriendRequest(requestId);
      setIncomingRequests((prev) => prev.filter((request) => Number(request.requestId) !== Number(requestId)));
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to reject request."));
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleSendRequest = async (receiverId) => {
    const normalizedReceiverId = Number(receiverId);
    if (!Number.isFinite(normalizedReceiverId) || normalizedReceiverId <= 0) {
      setError("Unable to send friend request: invalid user id.");
      return;
    }

    setSendingStates((prev) => ({ ...prev, [normalizedReceiverId]: "loading" }));
    setError("");
    try {
      await sendFriendRequest(normalizedReceiverId);
      setSendingStates((prev) => ({ ...prev, [normalizedReceiverId]: "success" }));
      setTimeout(() => {
        setSendingStates((prev) => ({ ...prev, [normalizedReceiverId]: "idle" }));
      }, 1200);
    } catch (err) {
      setSendingStates((prev) => ({ ...prev, [normalizedReceiverId]: "idle" }));
      setError(getApiErrorMessage(err, "Unable to send friend request."));
    }
  };

  return (
    <div className="bg-background min-h-screen text-on-surface">
      <DashboardSidebar onLogout={clearAuth} activeView="connections" />
      <DashboardTopBar />
      <main className={`ml-0 ${isCollapsed ? "md:ml-20" : "md:ml-64"} p-md lg:p-xl pb-[84px] md:pb-xl min-h-screen transition-all duration-300 ease-in-out`}>
        <section className="max-w-container-max mx-auto space-y-md">
          <header className="space-y-xs">
            <h1 className="font-h3 text-h3">Connections</h1>
            <p className="text-body-sm text-on-surface-variant">
              Build accountability with peers and stay consistent together.
            </p>
          </header>

          <SearchBar value={search} onChange={setSearch} />
          <ConnectionsTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {activeTab === "requests" ? (
            <RequestTabs
              activeTab={activeRequestTab}
              incomingCount={incomingRequests.length}
              onChangeTab={setActiveRequestTab}
            />
          ) : null}

          {error ? <p className="text-error text-label-sm">{error}</p> : null}
          {loadingSection ? <ConnectionsSkeleton rows={5} /> : null}

          {!loadingSection && activeTab === "friends" ? (
            friends.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
                {friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={{ ...friend, college: profilesById[friend.id]?.college || "" }}
                    removing={Number(removingId) === Number(friend.id)}
                    onRemove={handleRemoveFriend}
                  />
                ))}
              </div>
            ) : (
              <EmptyConnectionsState
                title="No friends connected yet"
                description="Send your first request in Discover to create a lightweight accountability circle."
              />
            )
          ) : null}

          {!loadingSection && activeTab === "requests" ? (
            (activeRequestTab === "incoming" ? incomingRequests : outgoingRequests).length ? (
              <div className="space-y-sm">
                {(activeRequestTab === "incoming" ? incomingRequests : outgoingRequests).map((request) => (
                  <FriendRequestCard
                    key={request.requestId}
                    request={request}
                    type={activeRequestTab}
                    college={
                      activeRequestTab === "incoming"
                        ? profilesById[request.senderId]?.college
                        : profilesById[request.receiverId]?.college
                    }
                    loading={Number(processingRequestId) === Number(request.requestId)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <EmptyConnectionsState
                title={activeRequestTab === "incoming" ? "No incoming requests" : "No outgoing requests"}
                description={
                  activeRequestTab === "incoming"
                    ? "You are all caught up. New requests will appear here."
                    : "Requests you send will appear here while pending."
                }
              />
            )
          ) : null}

          {!loadingSection && activeTab === "discover" ? (
            discoverVisibleUsers.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
                {discoverVisibleUsers.map((user) => (
                  <DiscoverUserCard
                    key={user.id}
                    user={user}
                    onSendRequest={handleSendRequest}
                    actionState={sendingStates[user.id] || "idle"}
                  />
                ))}
              </div>
            ) : (
              <EmptyConnectionsState
                title={search ? "No users found" : "No users to discover"}
                description={search ? "Try a different name or keyword." : "New students will appear here as they join."}
              />
            )
          ) : null}
        </section>
      </main>
      <MobileBottomNav activeView="connections" />
    </div>
  );
};

export default ConnectionsPage;

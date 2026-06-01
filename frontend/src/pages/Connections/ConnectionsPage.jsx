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
import PublicProfileDialog from "../../components/profile/PublicProfileDialog";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../hooks/useSidebar";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import { getApiErrorMessage } from "../../utils/errorUtils";
import { useToast } from "../../components/ui/ToastProvider";
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

const RELATIONSHIP = {
  SELF: "SELF",
  FRIEND: "FRIEND",
  REQUEST_SENT: "REQUEST_SENT",
  REQUEST_RECEIVED: "REQUEST_RECEIVED",
  DISCOVERABLE: "DISCOVERABLE"
};

const normalizeId = (value) => {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
};

const ConnectionsPage = () => {
  const isCollapsed = useSidebar();
  const { clearAuth, profile } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("friends");
  const [activeRequestTab, setActiveRequestTab] = useState("incoming");
  const [search, setSearch] = useState("");

  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [profilesById, setProfilesById] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  const [loadingSection, setLoadingSection] = useState(false);
  const [loadingSearchResults, setLoadingSearchResults] = useState(false);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [sendingStates, setSendingStates] = useState({});
  const [comingSoonMessage, setComingSoonMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const showSkeleton = useDelayedLoading(loadingSection, 200);
  const showSearchSkeleton = useDelayedLoading(loadingSearchResults, 200);

  const currentUserId = normalizeId(profile?.userId);
  const hasActiveSearch = Boolean(search.trim());

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
          const id = normalizeId(item.id);
          if (id) acc[id] = item;
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
    if (!hasActiveSearch) {
      setSearchResults([]);
      setLoadingSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSearchResults(true);
      setError("");
      try {
        const data = await searchDiscoverUsers(search.trim());
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to search users."));
        setSearchResults([]);
      } finally {
        setLoadingSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, hasActiveSearch]);

  const friendIdSet = useMemo(
    () => new Set(friends.map((friend) => normalizeId(friend.id)).filter(Boolean)),
    [friends]
  );
  const outgoingRequestByReceiverId = useMemo(
    () =>
      outgoingRequests.reduce((acc, request) => {
        const receiverId = normalizeId(request.receiverId);
        if (receiverId) acc[receiverId] = request;
        return acc;
      }, {}),
    [outgoingRequests]
  );
  const incomingRequestBySenderId = useMemo(
    () =>
      incomingRequests.reduce((acc, request) => {
        const senderId = normalizeId(request.senderId);
        if (senderId) acc[senderId] = request;
        return acc;
      }, {}),
    [incomingRequests]
  );

  const blockedUserIds = useMemo(
    () => new Set([...friendIdSet, ...Object.keys(outgoingRequestByReceiverId).map(Number)].filter(Boolean)),
    [friendIdSet, outgoingRequestByReceiverId]
  );

  const discoverVisibleUsers = useMemo(
    () => discoverUsers.filter((user) => !blockedUserIds.has(normalizeId(user.id))),
    [discoverUsers, blockedUserIds]
  );

  const resolveRelationshipType = (userId) => {
    const id = normalizeId(userId);
    if (!id) return RELATIONSHIP.DISCOVERABLE;
    if (currentUserId && id === currentUserId) return RELATIONSHIP.SELF;
    if (friendIdSet.has(id)) return RELATIONSHIP.FRIEND;
    if (outgoingRequestByReceiverId[id]) return RELATIONSHIP.REQUEST_SENT;
    if (incomingRequestBySenderId[id]) return RELATIONSHIP.REQUEST_RECEIVED;
    return RELATIONSHIP.DISCOVERABLE;
  };

  const relationshipAwareSearchResults = useMemo(
    () =>
      searchResults.map((user) => ({
        ...user,
        relationshipType: resolveRelationshipType(user.id)
      })),
    [searchResults, currentUserId, friendIdSet, outgoingRequestByReceiverId, incomingRequestBySenderId]
  );

  const handleRemoveFriend = async (friendId) => {
    setRemovingId(friendId);
    setError("");
    const previousFriends = friends;
    
    // Optimistic UI
    setFriends((prev) => prev.filter((friend) => normalizeId(friend.id) !== normalizeId(friendId)));
    
    try {
      await removeFriend(friendId);
      showToast("Friend removed");
    } catch (err) {
      setFriends(previousFriends);
      setError(getApiErrorMessage(err, "Unable to remove friend."));
      showToast("Unable to remove friend", "error");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAccept = async (requestId) => {
    setProcessingRequestId(requestId);
    setError("");
    
    const previousIncoming = incomingRequests;
    const previousFriends = friends;
    
    // Optimistic UI
    const accepted = incomingRequests.find((request) => normalizeId(request.requestId) === normalizeId(requestId));
    setIncomingRequests((prev) => prev.filter((request) => normalizeId(request.requestId) !== normalizeId(requestId)));
    if (accepted) {
      setFriends((prev) => [...prev, { id: accepted.senderId, username: accepted.senderUsername, college: "" }]);
    }

    try {
      await acceptFriendRequest(requestId);
      showToast("Request accepted");
    } catch (err) {
      setIncomingRequests(previousIncoming);
      setFriends(previousFriends);
      setError(getApiErrorMessage(err, "Unable to accept request."));
      showToast("Unable to accept request", "error");
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingRequestId(requestId);
    setError("");
    
    const previousIncoming = incomingRequests;
    
    // Optimistic UI
    setIncomingRequests((prev) => prev.filter((request) => normalizeId(request.requestId) !== normalizeId(requestId)));

    try {
      await rejectFriendRequest(requestId);
      showToast("Request rejected");
    } catch (err) {
      setIncomingRequests(previousIncoming);
      setError(getApiErrorMessage(err, "Unable to reject request."));
      showToast("Unable to reject request", "error");
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleSendRequest = async (receiverId) => {
    const normalizedReceiverId = normalizeId(receiverId);
    if (!normalizedReceiverId) {
      setError("Unable to send friend request: invalid user id.");
      return;
    }

    setSendingStates((prev) => ({ ...prev, [normalizedReceiverId]: "loading" }));
    setError("");
    
    const tempRequest = {
      requestId: "temp-" + Date.now(),
      receiverId: normalizedReceiverId,
      status: "PENDING"
    };
    
    // Optimistic UI
    setOutgoingRequests((prev) => [...prev, tempRequest]);

    try {
      await sendFriendRequest(normalizedReceiverId);
      setSendingStates((prev) => ({ ...prev, [normalizedReceiverId]: "success" }));
      showToast("Friend request sent");
      setTimeout(() => {
        setSendingStates((prev) => ({ ...prev, [normalizedReceiverId]: "idle" }));
      }, 1200);
    } catch (err) {
      setOutgoingRequests((prev) => prev.filter((r) => r.requestId !== tempRequest.requestId));
      setSendingStates((prev) => ({ ...prev, [normalizedReceiverId]: "idle" }));
      setError(getApiErrorMessage(err, "Unable to send friend request."));
      showToast("Unable to send friend request", "error");
    }
  };

  const showComingSoon = (message) => {
    setComingSoonMessage(message);
    setTimeout(() => setComingSoonMessage(""), 2000);
  };

  const openProfileDialog = (userId) => {
    const normalized = normalizeId(userId);
    if (!normalized) return;
    setSelectedUserId(normalized);
    setIsProfileDialogOpen(true);
  };

  const tabContext = useMemo(() => {
    if (activeTab === "friends") {
      return "Your accountability circle for consistency and momentum.";
    }
    if (activeTab === "requests") {
      return "Review pending connection actions and keep your network intentional.";
    }
    return "Discover peers to build a focused productivity support network.";
  }, [activeTab]);

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

          <p className="text-label-sm text-on-surface-variant">{tabContext}</p>
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
          {comingSoonMessage ? (
            <p className="text-label-sm text-primary bg-primary-container/20 border border-primary/20 rounded-lg px-sm py-xs">
              {comingSoonMessage}
            </p>
          ) : null}

          {hasActiveSearch ? (
            <section className="space-y-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-label-sm uppercase tracking-wider text-on-surface-variant">Search Results</h2>
                <p className="text-label-xs text-on-surface-variant">Relationship-aware</p>
              </div>

              {showSearchSkeleton ? <ConnectionsSkeleton rows={4} /> : null}

              {!loadingSearchResults && relationshipAwareSearchResults.length === 0 ? (
                <EmptyConnectionsState
                  title={`No users found for "${search.trim()}"`}
                  description="Try another name or keyword."
                />
              ) : null}

              {!showSearchSkeleton && relationshipAwareSearchResults.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
                  {relationshipAwareSearchResults.map((user) => {
                    const userId = normalizeId(user.id);
                    const relationshipType = user.relationshipType;

                    if (relationshipType === RELATIONSHIP.FRIEND) {
                      return (
                        <FriendCard
                          key={`search-${userId}`}
                          friend={{ id: userId, username: user.username, college: user.college || "" }}
                          removing={Number(removingId) === Number(userId)}
                          onRemove={handleRemoveFriend}
                          onViewProfile={(selectedFriend) => openProfileDialog(selectedFriend.id)}
                          onCompare={(selectedFriend) =>
                            showComingSoon(`Compare view with ${selectedFriend.username} is coming soon.`)
                          }
                        />
                      );
                    }

                    if (relationshipType === RELATIONSHIP.REQUEST_RECEIVED) {
                      const request = incomingRequestBySenderId[userId];
                      return (
                        <FriendRequestCard
                          key={`search-received-${userId}`}
                          request={request}
                          type="incoming"
                          college={user.college}
                          loading={Number(processingRequestId) === Number(request?.requestId)}
                          onAccept={handleAccept}
                          onReject={handleReject}
                          onOpenProfile={openProfileDialog}
                        />
                      );
                    }

                    if (relationshipType === RELATIONSHIP.REQUEST_SENT) {
                      return (
                        <article key={`search-sent-${userId}`} className="rounded-xl border border-outline-variant bg-surface-container p-md space-y-sm">
                          <DiscoverUserCard
                            user={user}
                            onSendRequest={handleSendRequest}
                            actionState="success"
                            onOpenProfile={openProfileDialog}
                          />
                          <div className="flex items-center justify-between gap-sm">
                            <span className="px-sm py-xs rounded-full bg-surface-variant text-on-surface-variant text-label-sm">Request sent</span>
                            <button
                              type="button"
                              onClick={() => showComingSoon("Cancel request will be available soon.")}
                              className="px-sm py-xs rounded-lg border border-outline-variant text-label-sm text-on-surface-variant hover:text-on-surface"
                            >
                              Cancel Request
                            </button>
                          </div>
                        </article>
                      );
                    }

                    if (relationshipType === RELATIONSHIP.SELF) {
                      return (
                        <article key={`search-self-${userId || user.username}`} className="rounded-xl border border-outline-variant bg-surface-container p-md">
                          <div className="flex items-center justify-between gap-sm">
                            <div className="min-w-0">
                              <p className="text-body-md text-on-surface truncate">{user.username}</p>
                              <p className="text-label-sm text-on-surface-variant truncate">{user.college || "LifeOS member"}</p>
                            </div>
                            <span className="px-sm py-xs rounded-full bg-primary-container/40 text-on-primary-container text-label-sm">You</span>
                          </div>
                        </article>
                      );
                    }

                    return (
                      <DiscoverUserCard
                        key={`search-discover-${userId || user.username}`}
                        user={user}
                        onSendRequest={handleSendRequest}
                        actionState={sendingStates[userId] || "idle"}
                        onOpenProfile={openProfileDialog}
                      />
                    );
                  })}
                </div>
              ) : null}
            </section>
          ) : (
            <>
              {showSkeleton ? <ConnectionsSkeleton rows={5} /> : null}

              {!showSkeleton && activeTab === "friends" ? (
                friends.length ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
                    {friends.map((friend) => (
                      <FriendCard
                        key={friend.id}
                        friend={{ ...friend, college: profilesById[friend.id]?.college || "" }}
                        removing={Number(removingId) === Number(friend.id)}
                        onRemove={handleRemoveFriend}
                        onViewProfile={(selectedFriend) => openProfileDialog(selectedFriend.id)}
                        onCompare={(selectedFriend) =>
                          showComingSoon(`Compare view with ${selectedFriend.username} is coming soon.`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyConnectionsState
                    title="No connections yet."
                    description="Build your accountability circle through Discover."
                  />
                )
              ) : null}

              {!showSkeleton && activeTab === "requests" ? (
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
                        onOpenProfile={openProfileDialog}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyConnectionsState
                    title={activeRequestTab === "incoming" ? "No incoming requests" : "No outgoing requests"}
                    description={
                      activeRequestTab === "incoming"
                        ? "You are all caught up. New accountability invites will appear here."
                        : "Requests you send will stay here until accepted or rejected."
                    }
                  />
                )
              ) : null}

              {!showSkeleton && activeTab === "discover" ? (
                discoverVisibleUsers.length ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
                    {discoverVisibleUsers.map((user) => (
                      <DiscoverUserCard
                        key={user.id}
                        user={user}
                        onSendRequest={handleSendRequest}
                        actionState={sendingStates[user.id] || "idle"}
                        onOpenProfile={openProfileDialog}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyConnectionsState
                    title={search ? "No users found" : "No users to discover"}
                    description={search ? "Try a different name or keyword." : "Explore later to discover more peers in your network."}
                  />
                )
              ) : null}
            </>
          )}
        </section>
      </main>
      <MobileBottomNav activeView="connections" />
      <PublicProfileDialog
        isOpen={isProfileDialogOpen}
        userId={selectedUserId}
        onClose={() => setIsProfileDialogOpen(false)}
        onRelationshipActionComplete={() => {
          if (activeTab === "friends") loadFriends();
          if (activeTab === "requests") loadRequests();
        }}
      />
    </div>
  );
};

export default ConnectionsPage;

const fs = require('fs');
const file = 'c:/Users/Rishi/Desktop/LifeOS/frontend/src/pages/Connections/ConnectionsPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\r\n/g, '\n');

if (!content.includes('useToast')) {
    content = content.replace(
        'import { getApiErrorMessage } from "../../utils/errorUtils";',
        'import { getApiErrorMessage } from "../../utils/errorUtils";\nimport { useToast } from "../../components/ui/ToastProvider";'
    );
}

if (!content.includes('const { showToast } = useToast();')) {
    content = content.replace(
        '  const { clearAuth, profile } = useAuth();',
        '  const { clearAuth, profile } = useAuth();\n  const { showToast } = useToast();'
    );
}

// handleRemoveFriend
content = content.replace(
    /const handleRemoveFriend = async \(friendId\) => \{[\s\S]*?finally \{\n\s*setRemovingId\(null\);\n\s*\}\n\s*\};/,
    `const handleRemoveFriend = async (friendId) => {
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
  };`
);

// handleAccept
content = content.replace(
    /const handleAccept = async \(requestId\) => \{[\s\S]*?finally \{\n\s*setProcessingRequestId\(null\);\n\s*\}\n\s*\};/,
    `const handleAccept = async (requestId) => {
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
  };`
);

// handleReject
content = content.replace(
    /const handleReject = async \(requestId\) => \{[\s\S]*?finally \{\n\s*setProcessingRequestId\(null\);\n\s*\}\n\s*\};/,
    `const handleReject = async (requestId) => {
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
  };`
);

// handleSendRequest
content = content.replace(
    /const handleSendRequest = async \(receiverId\) => \{[\s\S]*?setError\(getApiErrorMessage\(err, "Unable to send friend request."\)\);\n\s*\}\n\s*\};/,
    `const handleSendRequest = async (receiverId) => {
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
  };`
);

fs.writeFileSync(file, content);
console.log("ConnectionsPage optimistic UI applied.");
